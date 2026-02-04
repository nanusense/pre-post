'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  credits: number
  suspended: boolean
  createdAt: string
  _count: {
    sentMessages: number
    receivedMessages: number
  }
}

interface Message {
  id: string
  recipientEmail: string
  recipientName: string
  isRead: boolean
  createdAt: string
  sender: { email: string }
}

interface Stats {
  users: number
  messages: number
  unreadMessages: number
}

interface AdminData {
  stats: Stats
  recentUsers: User[]
  recentMessages: Message[]
}

export default function AdminPage() {
  const router = useRouter()
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin')

      if (res.status === 403) {
        router.push('/dashboard')
        return
      }

      if (!res.ok) {
        throw new Error('Failed to fetch admin data')
      }

      const data = await res.json()
      setData(data)
    } catch {
      setError('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleSuspend(userId: string, suspend: boolean) {
    setActionLoading(userId)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: suspend ? 'suspend' : 'unsuspend',
          userId,
        }),
      })

      if (!res.ok) {
        throw new Error('Action failed')
      }

      // Refresh data
      await fetchData()
    } catch {
      setError('Failed to update user')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      </main>
    )
  }

  if (!data) return null

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-semibold">{data.stats.users}</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">Total Messages</p>
          <p className="text-2xl font-semibold">{data.stats.messages}</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">Unread Messages</p>
          <p className="text-2xl font-semibold">{data.stats.unreadMessages}</p>
        </div>
      </div>

      {/* Recent Users */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Credits
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Received
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">{user.credits}</td>
                  <td className="px-4 py-3 text-sm">{user._count.sentMessages}</td>
                  <td className="px-4 py-3 text-sm">{user._count.receivedMessages}</td>
                  <td className="px-4 py-3 text-sm">
                    {user.suspended ? (
                      <span className="text-red-600">Suspended</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleSuspend(user.id, !user.suspended)}
                      disabled={actionLoading === user.id}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      {actionLoading === user.id
                        ? '...'
                        : user.suspended
                        ? 'Unsuspend'
                        : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Messages */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  From
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  To
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.recentMessages.map((message) => (
                <tr key={message.id}>
                  <td className="px-4 py-3 text-sm">{message.sender.email}</td>
                  <td className="px-4 py-3 text-sm">
                    {message.recipientName} ({message.recipientEmail})
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {message.isRead ? (
                      <span className="text-gray-500">Read</span>
                    ) : (
                      <span className="text-black font-medium">Unread</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
