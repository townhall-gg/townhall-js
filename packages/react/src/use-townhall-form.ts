import { useState, useCallback, useRef } from 'react'
import {
  createClient,
  type TownHallConfig,
  type TownHallResponse,
  type TownHallError,
  type FormData,
} from '@townhall-gg/core'

/**
 * State returned by useTownHallForm hook
 */
export interface UseTownHallFormState {
  /** Whether a submission is in progress */
  isSubmitting: boolean
  /** Whether the form was submitted successfully */
  isSuccess: boolean
  /** Error from the last submission attempt */
  error: TownHallError | null
  /** Response data from successful submission */
  data: TownHallResponse | null
}

/**
 * Actions returned by useTownHallForm hook
 */
export interface UseTownHallFormActions {
  /** Submit form data */
  submit: (data: FormData) => Promise<TownHallResponse | null>
  /** Reset form state */
  reset: () => void
  /** Handle form submission event (for use with onSubmit) */
  handleSubmit: (
    getData: () => FormData | Promise<FormData>
  ) => (e: React.FormEvent) => Promise<void>
}

export type UseTownHallFormReturn = UseTownHallFormState & UseTownHallFormActions

/**
 * React hook for TownHall form submissions
 *
 * @example
 * ```tsx
 * function ContactForm() {
 *   const { submit, isSubmitting, isSuccess, error } = useTownHallForm('your-form-id')
 *
 *   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 *     e.preventDefault()
 *     const formData = new FormData(e.currentTarget)
 *     await submit(Object.fromEntries(formData))
 *   }
 *
 *   if (isSuccess) return <p>Thanks for your submission!</p>
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="email" type="email" required />
 *       <button disabled={isSubmitting}>
 *         {isSubmitting ? 'Sending...' : 'Submit'}
 *       </button>
 *       {error && <p className="error">{error.message}</p>}
 *     </form>
 *   )
 * }
 * ```
 */
export function useTownHallForm(
  formId: string,
  config?: TownHallConfig
): UseTownHallFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<TownHallError | null>(null)
  const [data, setData] = useState<TownHallResponse | null>(null)

  // Keep client ref stable
  const clientRef = useRef(createClient(formId, config))

  const submit = useCallback(async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)

    const result = await clientRef.current.submit(formData)

    setIsSubmitting(false)

    if (result.success) {
      setData(result.data)
      setIsSuccess(true)
      return result.data
    } else {
      setError(result.error)
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setIsSubmitting(false)
    setIsSuccess(false)
    setError(null)
    setData(null)
  }, [])

  const handleSubmit = useCallback(
    (getData: () => FormData | Promise<FormData>) => {
      return async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = await getData()
        await submit(formData)
      }
    },
    [submit]
  )

  return {
    isSubmitting,
    isSuccess,
    error,
    data,
    submit,
    reset,
    handleSubmit,
  }
}
