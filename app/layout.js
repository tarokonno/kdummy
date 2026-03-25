import './globals.css'
import { ConfirmProvider } from '@/context/ConfirmContext'
import AppShell from '@/components/AppShell'

export const metadata = {
  title: 'K:Dummy - Klaviyo Dummy Data Generator',
  description: 'Quickly create personalised dummy data for demo and educational purposes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConfirmProvider>
          <AppShell>{children}</AppShell>
        </ConfirmProvider>
      </body>
    </html>
  )
}

