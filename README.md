# TownHall JavaScript SDK

Official JavaScript/TypeScript SDK for [TownHall](https://townhall.gg) form submissions.

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`@townhall/core`](./packages/core) | Core TypeScript client | [![npm](https://img.shields.io/npm/v/@townhall/core)](https://www.npmjs.com/package/@townhall/core) |
| [`@townhall/react`](./packages/react) | React hooks & components | [![npm](https://img.shields.io/npm/v/@townhall/react)](https://www.npmjs.com/package/@townhall/react) |

## Examples

| Example | Description |
|---------|-------------|
| [`nextjs-demo`](./examples/nextjs-demo) | Next.js 15 demo with contact and newsletter forms |

## Quick Start

### React

```bash
npm install @townhall/react
```

```tsx
import { useTownHallForm } from '@townhall/react'

function ContactForm() {
  const { submit, isSubmitting, isSuccess, error } = useTownHallForm('your-form-id')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await submit(Object.fromEntries(formData))
  }

  if (isSuccess) return <p>Thanks for your message!</p>

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  )
}
```

### Vanilla JavaScript/TypeScript

```bash
npm install @townhall/core
```

```ts
import { createClient } from '@townhall/core'

const client = createClient('your-form-id')

const result = await client.submit({
  email: 'user@example.com',
  message: 'Hello!'
})

if (result.success) {
  console.log('Submitted:', result.data.id)
} else {
  console.error('Error:', result.error.message)
}
```

## Features

- **TypeScript first** - Full type safety with comprehensive types
- **Tiny bundle** - No unnecessary dependencies
- **Tree-shakeable** - Only import what you need
- **Framework agnostic core** - Use with any framework via `@townhall/core`
- **React hooks** - `useTownHallForm` with loading, error, and success states
- **Error handling** - Typed errors with helpful properties (`isRateLimited`, `isNotFound`, etc.)

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Development mode (watch)
pnpm dev

# Type checking
pnpm typecheck

# Run the demo
cd examples/nextjs-demo
pnpm dev
```

## Publishing

This repo uses [Changesets](https://github.com/changesets/changesets) for versioning.

```bash
# Add a changeset
pnpm changeset

# Version packages
pnpm version

# Publish to npm
pnpm release
```

## License

MIT © [TownHall](https://townhall.gg)
