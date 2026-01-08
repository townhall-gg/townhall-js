# TownHall React SDK Demo

A Next.js demo application showcasing the `@townhall/react` SDK for form submissions.

## Getting Started

1. First, install dependencies from the root of the monorepo:

```bash
cd ../..  # Go to townhall-js root
pnpm install
```

2. Build the packages:

```bash
pnpm build
```

3. Run the demo:

```bash
cd examples/nextjs-demo
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

Replace `DEMO_FORM_ID` in `app/page.tsx` with your actual TownHall form ID:

```tsx
const DEMO_FORM_ID = 'your-actual-form-id'
```

## Features Demonstrated

- **Contact Form**: Full form with name, email, and message fields
- **Newsletter Form**: Simple email signup with extra metadata
- **Loading States**: Automatic `isSubmitting` state management
- **Success States**: `isSuccess` flag with response data
- **Error Handling**: Built-in error display
- **Reset Functionality**: `reset()` to submit again

## Learn More

- [TownHall SDK Documentation](https://townhall.gg/docs/sdk)
- [GitHub Repository](https://github.com/townhallgg/townhall-js)
