'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getAccounts, getActiveApiKey, setActiveApiKey } from '@/lib/storage'

function deriveActivePage(pathname) {
  if (!pathname || pathname === '/') return 'home'
  if (pathname.startsWith('/profiles')) return 'profiles'
  if (pathname.startsWith('/events')) return 'events'
  if (pathname.startsWith('/catalog')) return 'catalog'
  if (pathname.startsWith('/settings')) return 'settings'
  return 'home'
}

const NAV_LINKS = [
  { href: '/profiles', page: 'profiles', label: 'Profiles' },
  { href: '/events', page: 'events', label: 'Events' },
  { href: '/catalog', page: 'catalog', label: 'Data Catalog' },
  { href: '/settings', page: 'settings', label: 'Settings' },
]

export default function Navigation({ activePage: activePageProp }) {
  const pathname = usePathname()
  const activePage = activePageProp ?? deriveActivePage(pathname)

  const [accounts, setAccounts] = useState([])
  const [activeApiKey, setActiveApiKeyState] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    loadAccounts()

    const handleStorageChange = () => {
      loadAccounts()
    }
    window.addEventListener('storage', handleStorageChange)

    const interval = setInterval(loadAccounts, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const loadAccounts = () => {
    const accountsList = getAccounts()
    setAccounts(accountsList)
    const active = getActiveApiKey()
    setActiveApiKeyState(active)
  }

  const handleAccountChange = (apiKey) => {
    setActiveApiKey(apiKey)
    setActiveApiKeyState(apiKey)
    setShowDropdown(false)
    window.location.reload()
  }

  const activeAccount = accounts.find((a) => a.apiKey === activeApiKey)

  const linkClass = (page) =>
    `flex items-center rounded-lg px-4 py-3.5 text-base font-medium transition-colors min-h-[48px] ${
      activePage === page
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-gray-700 hover:bg-gray-100'
    }`

  return (
    <nav
      className="sticky top-0 flex w-72 shrink-0 flex-col h-screen bg-white border-r border-gray-200 shadow-sm overflow-y-auto"
      aria-label="Main navigation"
    >
      <div className="p-4 border-b border-gray-100">
        <Link href="/" className="block min-w-0">
          <span className="text-2xl font-bold text-gray-900 truncate tracking-tight">K:Dummy</span>
        </Link>
      </div>

      {/* Account dropdown */}
      <div className="p-3 border-b border-gray-100">
        <div className="px-1 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Accounts
        </div>

        {accounts.length > 0 ? (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex w-full items-center gap-2 px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors border border-gray-200 bg-white"
            >
              <span className="flex-1 text-left truncate">
                {activeAccount ? activeAccount.accountName : 'No Account'}
              </span>
              {activeAccount && (
                <span className="shrink-0 px-1.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                  Active
                </span>
              )}
              <svg
                className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 max-h-64 overflow-y-auto">
                <div className="py-1" role="menu">
                  {accounts.map((account) => (
                    <button
                      key={account.apiKey}
                      type="button"
                      onClick={() => handleAccountChange(account.apiKey)}
                      className={`${
                        account.apiKey === activeApiKey
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      } w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2`}
                      role="menuitem"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{account.accountName}</div>
                        <div className="text-xs text-gray-500 font-mono truncate">{account.apiKey}</div>
                      </div>
                      {account.apiKey === activeApiKey && (
                        <svg className="w-5 h-5 text-indigo-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-gray-200 mt-1">
                    <Link
                      href="/settings"
                      onClick={() => setShowDropdown(false)}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      role="menuitem"
                    >
                      Manage Accounts…
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/settings"
            className="inline-flex w-full justify-center items-center gap-2 px-4 py-3 text-base font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors min-h-[48px]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 010 2h-5v5a1 1 0 01-2 0v-5H4a1 1 0 010-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Connect account</span>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3 flex-1">
        {NAV_LINKS.map(({ href, page, label }) => (
          <Link key={href} href={href} className={linkClass(page)}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
