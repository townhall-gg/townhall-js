# @townhall-gg/core

Official TypeScript client for [TownHall](https://townhall.gg) form submissions.

## Installation

```bash
npm install @townhall-gg/core
# or
pnpm add @townhall-gg/core
# or
yarn add @townhall-gg/core
```

## Usage

### Basic Usage

```ts
import { createClient } from '@townhall-gg/core'

const client = createClient('your-form-id')

const result = await client.submit({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello from TownHall!'
})

if (result.success) {
  console.log('Submission ID:', result.data.id)
  console.log('Message:', result.data.message)
} else {
  console.error('Error:', result.error.message)
}
```

### One-off Submission

```ts
import { submit } from '@townhall-gg/core'

const result = await submit('your-form-id', {
  email: 'user@example.com',
  message: 'Quick submission'
})
```

### Error Handling with Try/Catch

```ts
import { createClient, TownHallError } from '@townhall-gg/core'

const client = createClient('your-form-id')

try {
  const response = await client.submitOrThrow({
    email: 'user@example.com'
  })
  console.log('Success!', response.id)
} catch (error) {
  if (error instanceof TownHallError) {
    if (error.isRateLimited) {
      console.log('Too many requests, please wait')
    } else if (error.isNotFound) {
      console.log('Form not found')
    } else {
      console.log('Error:', error.message)
    }
  }
}
```

### Custom Configuration

```ts
const client = createClient('your-form-id', {
  baseUrl: 'https://your-custom-domain.com', // Self-hosted TownHall
  timeout: 10000, // 10 second timeout
})
```

## API Reference

### `createClient(formId, config?)`

Creates a TownHall client instance.

| Parameter | Type | Description |
|-----------|------|-------------|
| `formId` | `string` | Your TownHall form ID |
| `config.baseUrl` | `string` | API base URL (default: `https://townhall.gg`) |
| `config.timeout` | `number` | Request timeout in ms (default: `30000`) |

### `client.submit(data, options?)`

Submit form data. Returns a result object with `success` boolean.

### `client.submitOrThrow(data, options?)`

Submit form data. Throws `TownHallError` on failure.

### `TownHallError`

Error class with helpful properties:

- `status` - HTTP status code
- `code` - Error code string
- `isRateLimited` - True if rate limited (429)
- `isNotFound` - True if form not found (404)
- `isFormInactive` - True if form is disabled
- `isValidationError` - True if validation failed (400)

## Response Types

```ts
interface TownHallResponse {
  success: true
  message: string      // Success message (customizable in dashboard)
  id: string           // Submission ID
  emails: {
    notifications: { enabled: boolean; count: number }
    autoReply: { enabled: boolean; willSend: boolean }
  }
  warning?: string     // Plan limit warning if applicable
}
```

## License

MIT © [TownHall](https://townhall.gg)
