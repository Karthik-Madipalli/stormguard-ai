import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StormGuard AI | Security Operations Command Center',
  description: 'AI-augmented network defense and real-time threat investigation command center.',
  generator: 'StormGuard AI',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#070a10',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body>
    </html>
  )
}
