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
          className="block w-full p-6 bg-black text-white rounded-lg hover:bg-gray-800 mb-4"
        >
          <p className="text-lg font-medium">Write a Message</p>
          <p className="text-sm text-gray-300 mt-1">
            You have {user.credits} credit{user.credits !== 1 ? 's' : ''}
          </p>
        </Link>

        {/* Inbox cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            href="/inbox"
            className="p-5 border border-gray-200 rounded-lg hover:border-gray-300"
          >
            <p className="text-3xl font-semibold">{unreadCount}</p>
            <p className="text-sm text-gray-500 mt-1">Unread</p>
          </Link>

          <Link
            href="/inbox"
            className="p-5 border border-gray-200 rounded-lg hover:border-gray-300"
          >
            <p className="text-3xl font-semibold">{readCount}</p>
            <p className="text-sm text-gray-500 mt-1">Read</p>
          </Link>
        </div>

        {/* Stats */}
        <p className="text-sm text-gray-500">
          You&apos;ve written {sentCount} message{sentCount !== 1 ? 's' : ''}
        </p>
      </main>
    </>
  )
}
