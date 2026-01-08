# @townhall-gg/react

React hooks and components for [TownHall](https://townhall.gg) form submissions.

## Installation

```bash
npm install @townhall-gg/react
# or
pnpm add @townhall-gg/react
# or
yarn add @townhall-gg/react
```

## Usage

### Basic Form

```tsx
import { useTownHallForm } from '@townhall-gg/react'

function ContactForm() {
  const { submit, isSubmitting, isSuccess, error } = useTownHallForm('your-form-id')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await submit(Object.fromEntries(formData))
  }

  if (isSuccess) {
    return (
      <div className="success">
        <h2>Thank you!</h2>
        <p>Your message has been sent.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Your name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      
      {error && <p className="error">{error.message}</p>}
    </form>
  )
}
```

### With Reset Functionality

```tsx
function NewsletterForm() {
  const { submit, isSubmitting, isSuccess, error, reset } = useTownHallForm('newsletter-form-id')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await submit(Object.fromEntries(formData))
  }

  if (isSuccess) {
    return (
      <div>
        <p>You're subscribed!</p>
        <button onClick={reset}>Subscribe another email</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Enter your email" required />
      <button disabled={isSubmitting}>Subscribe</button>
      {error && <span>{error.message}</span>}
    </form>
  )
}
```

### Global Configuration with Provider

```tsx
import { TownHallProvider } from '@townhall-gg/react'

function App() {
  return (
    <TownHallProvider 
      baseUrl="https://your-custom-domain.com"
      timeout={15000}
    >
      <YourApp />
    </TownHallProvider>
  )
}
```

### TypeScript Support

Full TypeScript support with typed responses:

```tsx
import { useTownHallForm, type TownHallResponse } from '@townhall-gg/react'

function MyForm() {
  const { submit, data } = useTownHallForm('form-id')

  const handleSuccess = (response: TownHallResponse) => {
    console.log('Submission ID:', response.id)
    console.log('Auto-reply sent:', response.emails.autoReply.willSend)
  }

  const handleSubmit = async (formData: Record<string, unknown>) => {
    const response = await submit(formData)
    if (response) {
      handleSuccess(response)
    }
  }

  // ...
}
```

## API Reference

### `useTownHallForm(formId, config?)`

React hook for form submissions.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `formId` | `string` | Your TownHall form ID |
| `config.baseUrl` | `string` | API base URL (default: `https://townhall.gg`) |
| `config.timeout` | `number` | Request timeout in ms (default: `30000`) |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `isSubmitting` | `boolean` | True while submission is in progress |
| `isSuccess` | `boolean` | True after successful submission |
| `error` | `TownHallError \| null` | Error from last submission |
| `data` | `TownHallResponse \| null` | Response data on success |
| `submit` | `(data) => Promise` | Submit form data |
| `reset` | `() => void` | Reset form state |
| `handleSubmit` | `(getData) => handler` | Create form submit handler |

### `TownHallProvider`

Context provider for global configuration.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `baseUrl` | `string` | API base URL |
| `timeout` | `number` | Request timeout |
| `children` | `ReactNode` | Child components |

## Error Handling

```tsx
const { error } = useTownHallForm('form-id')

if (error) {
  if (error.isRateLimited) {
    return <p>Too many submissions. Please wait a moment.</p>
  }
  if (error.isFormInactive) {
    return <p>This form is no longer accepting submissions.</p>
  }
  return <p>Error: {error.message}</p>
}
```

## License

MIT © [TownHall](https://townhall.gg)
