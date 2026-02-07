'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { containsBlockedContent } from '@/lib/content-filter'

export default function MessageForm() {
  const router = useRouter()
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Check for blocked content
    const contentCheck = containsBlockedContent(content)
    if (contentCheck.blocked) {
      setError(contentCheck.reason || 'Message contains inappropriate content')
      setLoading(false)
      return
    }

    const nameCheck = containsBlockedContent(recipientName)
    if (nameCheck.blocked) {
      setError('Recipient name contains inappropriate content')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName,
          recipientEmail,
          content,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      router.push('/dashboard?sent=true')
      router.refresh()
    } catch {
      setError('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
          Their name
        </label>
        <input
          id="recipientName"
          type="text"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="The person on your mind"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Their email
        </label>
        <input
          id="recipientEmail"
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="they@example.com"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Your message
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Say what you've always meant to..."
          required
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
        />
        <p className="mt-1 text-sm text-gray-500">
          This message is permanent and anonymous. They will never know it&apos;s from you. Not even admins can read it.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#DDE3D5] text-gray-900 rounded-lg font-medium hover:bg-[#CDD3C5] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}
