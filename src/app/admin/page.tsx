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

interface Report {
  id: string
  reason: string
  createdAt: string
  message: {
    id: string
    content: string
    recipientName: string
    recipientEmail: string
    sender: {
      id: string
      email: string
      suspended: boolean
    }
  }
  reporter: {
    email: string
  }
}

interface Stats {
  users: number
  messages: number
  unreadMessages: number
  pendingReports: number
  messagesToday: number
  usersToday: number
  readRate: number
  suspendedUsers: number
  messagesThisWeek: number
  totalCredits: number
  deletedMessages: number
}

interface AdminData {
  stats: Stats
  recentUsers: User[]
  recentMessages: Message[]
  pendingReports: Report[]
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

  async function handleAction(action: string, params: Record<string, string>) {
    const key = params.userId || params.reportId || ''
    setActionLoading(key)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...params }),
      })

      if (!res.ok) {
        throw new Error('Action failed')
      }

      await fetchData()
    } catch {
      setError('Failed to perform action')
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
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="p-4 rounded-lg bg-blue-50">
          <p className="text-sm text-blue-700">Total Users</p>
          <p className="text-2xl font-semibold text-blue-900">{data.stats.users}</p>
        </div>
        <div className="p-4 rounded-lg bg-sky-50">
          <p className="text-sm text-sky-700">Total Messages</p>
          <p className="text-2xl font-semibold text-sky-900">{data.stats.messages}</p>
        </div>
        <div className="p-4 rounded-lg bg-amber-50">
          <p className="text-sm text-amber-700">Unread Messages</p>
          <p className="text-2xl font-semibold text-amber-900">{data.stats.unreadMessages}</p>
        </div>
        <div className="p-4 rounded-lg bg-red-50">
          <p className="text-sm text-red-700">Pending Reports</p>
          <p className="text-2xl font-semibold text-red-900">{data.stats.pendingReports}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="p-4 rounded-lg bg-green-50">
          <p className="text-sm text-green-700">Messages Today</p>
          <p className="text-2xl font-semibold text-green-900">{data.stats.messagesToday}</p>
        </div>
        <div className="p-4 rounded-lg bg-emerald-50">
          <p className="text-sm text-emerald-700">New Users Today</p>
          <p className="text-2xl font-semibold text-emerald-900">{data.stats.usersToday}</p>
        </div>
        <div className="p-4 rounded-lg bg-violet-50">
          <p className="text-sm text-violet-700">Read Rate</p>
          <p className="text-2xl font-semibold text-violet-900">{data.stats.readRate}%</p>
        </div>
        <div className="p-4 rounded-lg bg-red-50">
          <p className="text-sm text-red-700">Suspended Users</p>
          <p className="text-2xl font-semibold text-red-900">{data.stats.suspendedUsers}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-teal-50">
          <p className="text-sm text-teal-700">Messages This Week</p>
          <p className="text-2xl font-semibold text-teal-900">{data.stats.messagesThisWeek}</p>
        </div>
        <div className="p-4 rounded-lg bg-yellow-50">
          <p className="text-sm text-yellow-700">Total Credits</p>
          <p className="text-2xl font-semibold text-yellow-900">{data.stats.totalCredits}</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-100">
          <p className="text-sm text-gray-600">Deleted Messages</p>
          <p className="text-2xl font-semibold text-gray-900">{data.stats.deletedMessages}</p>
        </div>
      </div>

      {/* Pending Reports */}
      {data.pendingReports.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-red-600">Pending Reports</h2>
          <div className="space-y-4">
            {data.pendingReports.map((report) => (
              <div key={report.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Reported by: <span className="font-medium text-gray-700">{report.reporter.email}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Sender: <span className="font-medium text-gray-700">{report.message.sender.email}</span>
                      {report.message.sender.suspended && (
                        <span className="ml-2 text-red-600">(Already suspended)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!report.message.sender.suspended && (
                      <button
                        onClick={() => handleAction('suspend-from-report', { reportId: report.id })}
                        disabled={actionLoading === report.id}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {actionLoading === report.id ? '...' : 'Suspend Sender'}
                      </button>
                    )}
                    <button
                      onClick={() => handleAction('dismiss-report', { reportId: report.id })}
                      disabled={actionLoading === report.id}
                      className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                  <p className="text-sm text-gray-600 bg-white p-2 rounded">{report.reason}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Message to {report.message.recipientName} ({report.message.recipientEmail}):
                  </p>
                  <p className="text-sm text-gray-600 bg-white p-2 rounded whitespace-pre-wrap">
                    {report.message.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
                      onClick={() => handleAction(user.suspended ? 'unsuspend' : 'suspend', { userId: user.id })}
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
