import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { TownHallConfig } from '@townhall/core'

interface TownHallContextValue {
  config: TownHallConfig
}

const TownHallContext = createContext<TownHallContextValue | null>(null)

export interface TownHallProviderProps {
  children: ReactNode
  /**
   * Base URL for TownHall API
   * @default 'https://townhall.gg'
   */
  baseUrl?: string
  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number
}

/**
 * Provider component for global TownHall configuration
 *
 * @example
 * ```tsx
 * import { TownHallProvider } from '@townhall/react'
 *
 * function App() {
 *   return (
 *     <TownHallProvider baseUrl="https://your-domain.com">
 *       <YourApp />
 *     </TownHallProvider>
 *   )
 * }
 * ```
 */
export function TownHallProvider({
  children,
  baseUrl,
  timeout,
}: TownHallProviderProps) {
  const value = useMemo(
    () => ({
      config: { baseUrl, timeout },
    }),
    [baseUrl, timeout]
  )

  return (
    <TownHallContext.Provider value={value}>
      {children}
    </TownHallContext.Provider>
  )
}

/**
 * Hook to access TownHall context configuration
 * @internal
 */
export function useTownHallConfig(): TownHallConfig {
  const context = useContext(TownHallContext)
  return context?.config ?? {}
}
