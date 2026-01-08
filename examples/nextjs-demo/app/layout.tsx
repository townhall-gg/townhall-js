import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TownHall SDK Demo',
  description: 'Demo of @townhall/react form submission hooks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
