/**
 * TownHall Form Submission Types
 * @packageDocumentation
 */

/**
 * Configuration options for the TownHall client
 */
export interface TownHallConfig {
  /**
   * Base URL for the TownHall API
   * @default 'https://townhall.gg'
   */
  baseUrl?: string

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number

  /**
   * Custom fetch implementation (useful for testing or custom environments)
   */
  fetch?: typeof fetch
}

/**
 * Form field data - accepts any string-keyed object
 */
export type FormData = Record<string, unknown>

/**
 * Email notification status in the response
 */
export interface EmailStatus {
  notifications: {
    enabled: boolean
    count: number
  }
  autoReply: {
    enabled: boolean
    willSend: boolean
  }
}

/**
 * Successful form submission response
 */
export interface TownHallResponse {
  success: true
  message: string
  id: string
  emails: EmailStatus
  warning?: string
  inGracePeriod?: boolean
}

/**
 * Error response from TownHall API
 */
export interface TownHallErrorResponse {
  error: string
  details?: string
  overLimit?: {
    forms: boolean
    workspaces: boolean
    formsToRemove?: number
    workspacesToRemove?: number
  }
}

/**
 * TownHall API error with additional context
 */
export class TownHallError extends Error {
  public readonly status: number
  public readonly code: string
  public readonly details?: string

  constructor(message: string, status: number, code?: string, details?: string) {
    super(message)
    this.name = 'TownHallError'
    this.status = status
    this.code = code || 'UNKNOWN_ERROR'
    this.details = details
  }

  /**
   * Check if error is due to rate limiting
   */
  get isRateLimited(): boolean {
    return this.status === 429
  }

  /**
   * Check if error is due to form not found
   */
  get isNotFound(): boolean {
    return this.status === 404
  }

  /**
   * Check if error is due to form being inactive
   */
  get isFormInactive(): boolean {
    return this.status === 403 && this.message.includes('not accepting')
  }

  /**
   * Check if error is due to validation failure
   */
  get isValidationError(): boolean {
    return this.status === 400
  }
}

/**
 * Options for form submission
 */
export interface SubmitOptions {
  /**
   * Custom headers to include with the request
   */
  headers?: Record<string, string>

  /**
   * AbortController signal for request cancellation
   */
  signal?: AbortSignal
}

/**
 * Result type for form submission - either success or error
 */
export type SubmitResult =
  | { success: true; data: TownHallResponse }
  | { success: false; error: TownHallError }
