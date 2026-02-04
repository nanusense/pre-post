'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Message {
  id: string
  recipientName: string
  content: string
  createdAt: string
  readAt: string | null
}

export default function MessagePage() {
  const router = useRouter()
  const params = useParams()
  const messageId = params.id as string

  const [message, setMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [needsCredits, setNeedsCredits] = useState(false)

  const fetchMessage = useCallback(async () => {
    if (!messageId) return

    try {
      const res = await fetch(`/api/messages/${messageId}`)
      const data = await res.json()

      if (res.status === 402 && data.needsCredits) {
        setNeedsCredits(true)
        return
      }

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login')
          return
        }
        setError(data.error || 'Failed to load message')
        return
      }

      setMessage(data.message)
    } catch {
      setError('Failed to load message')
    } finally {
      setLoading(false)
    }
  }, [messageId, router])

  useEffect(() => {
    fetchMessage()
  }, [fetchMessage])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </main>
    )
  }

  if (needsCredits) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/inbox" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back to inbox
          </Link>
        </div>

        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold mb-4">You need a credit to read this</h1>
          <p className="text-gray-600 mb-6">
            Write a heartfelt message to someone you care about to earn a credit.
          </p>
          <Link
            href="/write"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
          >
            Write a Message
          </Link>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/inbox" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back to inbox
          </Link>
        </div>
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      </main>
    )
  }

  if (!message) {
    return null
  }

  const formattedDate = new Date(message.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/inbox" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to inbox
        </Link>
      </div>

      <article className="prose prose-gray max-w-none">
        <header className="mb-8 pb-6 border-b border-gray-200">
          <p className="text-gray-500 text-sm mb-2">
            Written for <span className="font-medium text-gray-900">{message.recipientName}</span>
          </p>
          <time className="text-sm text-gray-400">{formattedDate}</time>
        </header>

        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {message.content}
        </div>
      </article>

      <footer className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-4">
          This message was written anonymously. You will never know who sent it.
        </p>
        <Link
          href="/write"
          className="inline-block text-sm text-black underline hover:no-underline"
        >
          Pay it forward - write a message to someone you care about
        </Link>
      </footer>
    </main>
  )
}
