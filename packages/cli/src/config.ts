import Conf from 'conf'

interface ConfigSchema {
  apiKey?: string
  baseUrl: string
  workspaceId?: string
  workspaceName?: string
}

export const config = new Conf<ConfigSchema>({
  projectName: 'townhall',
  defaults: {
    baseUrl: 'https://townhall.gg',
  },
})

export function getApiKey(): string | undefined {
  return config.get('apiKey')
}

export function setApiKey(key: string): void {
  config.set('apiKey', key)
}

export function clearAuth(): void {
  config.delete('apiKey')
  config.delete('workspaceId')
  config.delete('workspaceName')
}

export function getBaseUrl(): string {
  return config.get('baseUrl')
}

export function setWorkspace(id: string, name: string): void {
  config.set('workspaceId', id)
  config.set('workspaceName', name)
}

export function isAuthenticated(): boolean {
  return !!config.get('apiKey')
}
