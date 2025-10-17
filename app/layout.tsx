import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'World Clock - Enhanced',
  description: 'A beautiful world clock with multiple timezones, analog and digital display',
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
