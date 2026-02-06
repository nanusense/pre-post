'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
    <header className="border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
          Pre-Post
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className={`text-sm px-3 py-1 rounded-full ${
                  user.credits === 0
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                {user.credits} credit{user.credits !== 1 ? 's' : ''}
              </span>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-black"
              >
                Dashboard
              </Link>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-black"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-black"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
