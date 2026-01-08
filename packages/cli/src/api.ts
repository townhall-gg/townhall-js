import { getApiKey, getBaseUrl } from './config.js'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const apiKey = getApiKey()
  const baseUrl = getBaseUrl()

  if (!apiKey) {
    throw new Error('Not authenticated. Run `townhall login` first.')
  }

  const response = await fetch(`${baseUrl}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new ApiError(error.error || `Request failed with status ${response.status}`, response.status)
  }

  return response.json()
}

export interface User {
  id: string
  email: string
  name: string | null
}

export interface Workspace {
  id: string
  name: string
  slug: string
}

export interface Form {
  id: string
  name: string
  workspaceId: string
  status: 'active' | 'inactive'
  submissionCount: number
  createdAt: string
}

export interface Submission {
  id: string
  formId: string
  data: Record<string, unknown>
  createdAt: string
}

export async function getCurrentUser(): Promise<{ user: User; workspaces: Workspace[] }> {
  return apiRequest('/cli/me')
}

export async function listForms(workspaceId?: string): Promise<Form[]> {
  const query = workspaceId ? `?workspaceId=${workspaceId}` : ''
  return apiRequest(`/cli/forms${query}`)
}

export async function getForm(formId: string): Promise<Form> {
  return apiRequest(`/cli/forms/${formId}`)
}

export async function listSubmissions(formId: string, limit = 10): Promise<Submission[]> {
  return apiRequest(`/cli/forms/${formId}/submissions?limit=${limit}`)
}

export async function createForm(data: { name: string; workspaceId: string }): Promise<Form> {
  return apiRequest('/cli/forms', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
