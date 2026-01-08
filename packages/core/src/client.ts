import type {
  TownHallConfig,
  FormData,
  TownHallResponse,
  TownHallErrorResponse,
  SubmitOptions,
  SubmitResult,
} from './types'
import { TownHallError } from './types'

const DEFAULT_BASE_URL = 'https://townhall.gg'
const DEFAULT_TIMEOUT = 30000

/**
 * Create a TownHall client for form submissions
 *
 * @example
 * ```ts
 * import { createClient } from '@townhall-gg/core'
 *
 * const client = createClient('your-form-id')
 *
 * const result = await client.submit({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   message: 'Hello!'
 * })
 *
 * if (result.success) {
 *   console.log('Submitted!', result.data.id)
 * } else {
 *   console.error('Error:', result.error.message)
 * }
 * ```
 */
export function createClient(formId: string, config: TownHallConfig = {}) {
  const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL
  const timeout = config.timeout ?? DEFAULT_TIMEOUT
  const fetchFn = config.fetch ?? globalThis.fetch

  if (!formId) {
    throw new Error('TownHall: formId is required')
  }

  const endpoint = `${baseUrl}/f/${formId}`

  /**
   * Submit form data to TownHall
   */
  async function submit(
    data: FormData,
    options: SubmitOptions = {}
  ): Promise<SubmitResult> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetchFn(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        signal: options.signal ?? controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as TownHallErrorResponse
        const error = new TownHallError(
          errorData.error || `Request failed with status ${response.status}`,
          response.status,
          getErrorCode(response.status),
          errorData.details
        )
        return { success: false, error }
      }

      const responseData = (await response.json()) as TownHallResponse
      return { success: true, data: responseData }
    } catch (err) {
      clearTimeout(timeoutId)

      if (err instanceof TownHallError) {
        return { success: false, error: err }
      }

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          return {
            success: false,
            error: new TownHallError('Request timed out', 408, 'TIMEOUT'),
          }
        }
        return {
          success: false,
          error: new TownHallError(err.message, 0, 'NETWORK_ERROR'),
        }
      }

      return {
        success: false,
        error: new TownHallError('Unknown error occurred', 0, 'UNKNOWN_ERROR'),
      }
    }
  }

  /**
   * Submit form data and throw on error (for try/catch patterns)
   */
  async function submitOrThrow(
    data: FormData,
    options: SubmitOptions = {}
  ): Promise<TownHallResponse> {
    const result = await submit(data, options)
    if (!result.success) {
      throw result.error
    }
    return result.data
  }

  return {
    submit,
    submitOrThrow,
    formId,
    endpoint,
  }
}

/**
 * One-off form submission without creating a client
 *
 * @example
 * ```ts
 * import { submit } from '@townhall-gg/core'
 *
 * const result = await submit('your-form-id', {
 *   email: 'user@example.com',
 *   message: 'Hello!'
 * })
 * ```
 */
export async function submit(
  formId: string,
  data: FormData,
  config?: TownHallConfig & SubmitOptions
): Promise<SubmitResult> {
  const client = createClient(formId, config)
  return client.submit(data, config)
}

function getErrorCode(status: number): string {
  switch (status) {
    case 400:
      return 'VALIDATION_ERROR'
    case 403:
      return 'FORBIDDEN'
    case 404:
      return 'NOT_FOUND'
    case 429:
      return 'RATE_LIMITED'
    case 500:
      return 'SERVER_ERROR'
    default:
      return 'UNKNOWN_ERROR'
  }
}
