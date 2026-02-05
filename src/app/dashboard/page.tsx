import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import Header from '@/components/Header'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const unreadCount = await db.message.count({
    where: {
      recipientId: user.id,
      isRead: false,
    },
  })

  const readCount = await db.message.count({
    where: {
      recipientId: user.id,
      isRead: true,
    },
  })

  const sentCount = await db.message.count({
    where: {
      senderId: user.id,
    },
  })

  return (
    <>
      <Header user={{ email: user.email, credits: user.credits, isAdmin: isAdmin(user.email) }} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8">Welcome back</h1>

        {/* Main action */}
        <Link
          href="/write"
          className="block w-full p-6 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors mb-4"
        >
          <p className="text-lg font-medium text-emerald-900">Write a Message</p>
          <p className="text-sm text-emerald-700 mt-1">
            You have {user.credits} credit{user.credits !== 1 ? 's' : ''}
          </p>
        </Link>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4">
          <Link
            href="/inbox"
            className="p-5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
          >
            <p className="text-3xl font-semibold text-amber-900">{unreadCount}</p>
            <p className="text-sm text-amber-700 mt-1">Unread</p>
          </Link>

          <Link
            href="/inbox"
            className="p-5 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors"
          >
            <p className="text-3xl font-semibold text-violet-900">{readCount}</p>
            <p className="text-sm text-violet-700 mt-1">Read</p>
          </Link>

          <Link
            href="/sent"
            className="p-5 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors"
          >
            <p className="text-3xl font-semibold text-sky-900">{sentCount}</p>
            <p className="text-sm text-sky-700 mt-1">Sent</p>
          </Link>
        </div>
      </main>
    </>
  )
}
