'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const errorMessages: Record<string, string> = {
  invalid: 'Invalid or expired link. Please try again.',
  used: 'This link has already been used. Please request a new one.',
  expired: 'This link has expired. Please request a new one.',
  suspended: 'Your account has been suspended.',
  server: 'Something went wrong. Please try again.',
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [devLink, setDevLink] = useState('')

  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setSent(true)
      if (data.devMagicLink) {
        setDevLink(data.devMagicLink)
      }
    } catch {
      setError('Failed to send login link')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-4">Check your email</h1>
        <p className="text-gray-600 mb-6">
          We sent a login link to <strong>{email}</strong>
        </p>
        {devLink && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm">
            <p className="text-gray-500 mb-2">Development mode:</p>
            <a href={devLink} className="text-blue-600 break-all hover:underline">
              Click here to login
            </a>
          </div>
        )}
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-gray-500 hover:text-gray-700"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
      <p className="text-gray-600 mb-6">
        Enter your email to receive a magic link
      </p>

      {(errorParam || error) && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error || (errorParam && errorMessages[errorParam]) || 'An error occurred'}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Login Link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">
          Back to home
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <Suspense fallback={
        <div className="w-full max-w-sm">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  )
}
