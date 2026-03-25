'use client'

import Navigation from '@/components/Navigation'

/**
 * App shell: left sidebar nav + scrollable main content area.
 */
export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navigation />
      <div className="flex-1 min-w-0 min-h-screen flex flex-col overflow-auto">
        {children}
      </div>
    </div>
  )
}
