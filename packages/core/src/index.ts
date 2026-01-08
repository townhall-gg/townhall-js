/**
 * @townhall/core
 *
 * Official TypeScript client for TownHall form submissions.
 *
 * @example
 * ```ts
 * import { createClient } from '@townhall/core'
 *
 * const client = createClient('your-form-id')
 * const result = await client.submit({ email: 'user@example.com' })
 * ```
 *
 * @packageDocumentation
 */

export { createClient, submit } from './client'

export {
  TownHallError,
  type TownHallConfig,
  type TownHallResponse,
  type TownHallErrorResponse,
  type FormData,
  type EmailStatus,
  type SubmitOptions,
  type SubmitResult,
} from './types'
