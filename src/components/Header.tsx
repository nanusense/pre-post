'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  user?: {
    email: string
    credits: number
    isAdmin?: boolean
  } | null
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
          Pre-Post
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-gray-100"
                >
                  Admin
                </Link>
              )}
              <span className={`text-sm px-3 py-1 rounded-full ${
                  user.credits === 0
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                {user.credits} credit{user.credits !== 1 ? 's' : ''}
              </span>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-gray-100"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-gray-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-gray-100"
            >
              Sign in
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
