/**
 * @townhall/react
 *
 * React hooks and components for TownHall form submissions.
 *
 * @example
 * ```tsx
 * import { useTownHallForm } from '@townhall/react'
 *
 * function ContactForm() {
 *   const { submit, isSubmitting, isSuccess, error } = useTownHallForm('your-form-id')
 *
 *   // ... your form JSX
 * }
 * ```
 *
 * @packageDocumentation
 */

export { useTownHallForm } from './use-townhall-form'
export type {
  UseTownHallFormState,
  UseTownHallFormActions,
  UseTownHallFormReturn,
} from './use-townhall-form'

export { TownHallProvider, useTownHallConfig } from './context'
export type { TownHallProviderProps } from './context'

// Re-export core types for convenience
export {
  TownHallError,
  type TownHallConfig,
  type TownHallResponse,
  type FormData,
} from '@townhall-gg/core'
