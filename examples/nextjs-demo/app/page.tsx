'use client'

import { useTownHallForm } from '@townhall-gg/react'

// Demo form ID - replace with your own form ID
const DEMO_FORM_ID = 'demo-form-id'

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>TownHall SDK</span>
        </div>
        <span className="badge">@townhall/react Demo</span>
        <h1>Form Submission Demo</h1>
        <p>
          Interactive examples showing how to use the TownHall React SDK for form submissions
          with built-in state management.
        </p>
      </header>

      <div className="grid">
        <ContactForm />
        <NewsletterForm />
      </div>

      <footer className="footer">
        <p>
          Built with{' '}
          <a href="https://github.com/townhall-gg/townhall-js" target="_blank" rel="noopener">
            @townhall/react
          </a>
          {' · '}
          <a href="https://townhall.gg/docs/sdk" target="_blank" rel="noopener">
            Documentation
          </a>
        </p>
      </footer>
    </div>
  )
}

function ContactForm() {
  const { submit, isSubmitting, isSuccess, error, data, reset } = useTownHallForm(DEMO_FORM_ID)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await submit(Object.fromEntries(formData))
  }

  if (isSuccess) {
    return (
      <div className="card">
        <div className="success">
          <div className="successIcon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3>Message Sent!</h3>
          <p>{data?.message || 'Thank you for your submission.'}</p>
          {data?.id && <div className="submissionId">ID: {data.id}</div>}
          <button onClick={reset} className="resetBtn">
            Send another message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Contact Form
      </h2>
      <p>Basic contact form with name, email, and message fields.</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="formGroup">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="How can we help you?"
            required
          />
        </div>

        {error && (
          <div className="error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error.message}
          </div>
        )}

        <button type="submit" className="submitBtn" disabled={isSubmitting}>
          {isSubmitting && <span className="spinner" />}
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <div className="codeBlock">
        <pre>{`const { submit, isSubmitting, isSuccess, error } = useTownHallForm('form-id')

const handleSubmit = async (e) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  await submit(Object.fromEntries(formData))
}`}</pre>
      </div>
    </div>
  )
}

function NewsletterForm() {
  const { submit, isSubmitting, isSuccess, error, reset } = useTownHallForm(DEMO_FORM_ID)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await submit({
      ...Object.fromEntries(formData),
      source: 'newsletter',
    })
  }

  if (isSuccess) {
    return (
      <div className="card">
        <div className="success">
          <div className="successIcon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3>You&apos;re Subscribed!</h3>
          <p>Thanks for subscribing to our newsletter.</p>
          <button onClick={reset} className="resetBtn">
            Subscribe another email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        Newsletter Signup
      </h2>
      <p>Simple email-only form with additional metadata.</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="formGroup">
          <label htmlFor="newsletter-email">Email address</label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            placeholder="you@example.com"
            required
          />
        </div>

        {error && (
          <div className="error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error.message}
          </div>
        )}

        <button type="submit" className="submitBtn" disabled={isSubmitting}>
          {isSubmitting && <span className="spinner" />}
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      <div className="codeBlock">
        <pre>{`// Add extra metadata with form data
await submit({
  ...Object.fromEntries(formData),
  source: 'newsletter',
  subscribedAt: new Date().toISOString()
})`}</pre>
      </div>
    </div>
  )
}
