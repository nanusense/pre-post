import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import Header from '@/components/Header'
import SuccessMessage from '@/components/SuccessMessage'
import OnboardingModal from '@/components/OnboardingModal'

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
        <h1 className="text-2xl font-semibold mb-4">Welcome back</h1>

        {/* Success message after sending */}
        <Suspense fallback={null}>
          <SuccessMessage />
        </Suspense>

        {/* Onboarding modal for new users */}
        <Suspense fallback={null}>
          <OnboardingModal />
        </Suspense>

        {/* First-time user prompt */}
        {user.credits === 0 && sentCount === 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
            <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">Getting started</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Write your first message to someone who matters to you. Once you send it, you&apos;ll earn 1 credit to read any messages waiting for you.
            </p>
          </div>
        )}

        {/* Main action */}
        <Link
          href="/write"
          className="block w-full p-6 bg-[#DDE3D5] dark:bg-[#3a4a2f] rounded-lg hover:bg-[#CDD3C5] dark:hover:bg-[#4a5a3f] transition-colors mb-4"
        >
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Write a Message</p>
          <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">
            You have {user.credits} credit{user.credits !== 1 ? 's' : ''}
          </p>
        </Link>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4">
          <Link
            href="/inbox"
            className="p-5 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <p className="text-3xl font-semibold text-red-900 dark:text-red-300">{unreadCount}</p>
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">Unread</p>
          </Link>

          <Link
            href="/inbox"
            className="p-5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{readCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Read</p>
          </Link>

          <Link
            href="/sent"
            className="p-5 rounded-lg bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors"
          >
            <p className="text-3xl font-semibold text-sky-900 dark:text-sky-300">{sentCount}</p>
            <p className="text-sm text-sky-700 dark:text-sky-400 mt-1">Sent</p>
          </Link>
        </div>
      </main>
    </>
  )
}
