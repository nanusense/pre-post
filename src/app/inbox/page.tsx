import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import Header from '@/components/Header'
import Pagination from '@/components/Pagination'

const PAGE_SIZE = 20

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const skip = (page - 1) * PAGE_SIZE

  const where = {
    recipientId: user.id,
    isDeleted: false,
  }

  const [messages, totalCount, unreadCount] = await Promise.all([
    db.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
    db.message.count({ where }),
    db.message.count({ where: { ...where, isRead: false } }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (
    <>
      <Header user={{ email: user.email, credits: user.credits, isAdmin: isAdmin(user.email) }} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back
          </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-6">Inbox</h1>

        {user.credits < 1 && unreadCount > 0 && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="font-medium text-orange-800 mb-1">You need credits to read messages</p>
            <p className="text-sm text-orange-700 mb-3">
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}, so you need {unreadCount} credit{unreadCount !== 1 ? 's' : ''}.
              Write a message to someone to earn 1 credit.
            </p>
            <Link
              href="/write"
              className="inline-block px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
            >
              Write a message
            </Link>
          </div>
        )}

        {totalCount === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No messages yet</p>
            <p className="text-sm text-gray-400">Someone might be writing one for you right now!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => {
              const messageNumber = String(totalCount - skip - index).padStart(3, '0')
              const messageDate = new Date(message.createdAt)
              const now = new Date()
              const diffMs = now.getTime() - messageDate.getTime()
              const diffMins = Math.floor(diffMs / 60000)
              const diffHours = Math.floor(diffMs / 3600000)
              const diffDays = Math.floor(diffMs / 86400000)

              const formattedDate = messageDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
              })

              let relativeTime: string
              if (diffMins < 60) {
                relativeTime = diffMins <= 1 ? 'Just now' : `${diffMins} mins ago`
              } else if (diffHours < 24) {
                relativeTime = diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
              } else if (diffDays < 7) {
                relativeTime = diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`
              } else {
                relativeTime = ''
              }

              const date = relativeTime ? `${relativeTime} · ${formattedDate}` : formattedDate

              return (
                <Link
                  key={message.id}
                  href={`/message/${message.id}`}
                  className={`block p-4 rounded-lg transition-colors ${
                    message.isRead
                      ? 'bg-gray-100 hover:bg-gray-200'
                      : 'bg-red-50 hover:bg-red-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!message.isRead && (
                        <span className="w-2 h-2 bg-black rounded-full"></span>
                      )}
                      <span className={message.isRead ? 'text-gray-600' : 'font-medium'}>
                        Pre-Post ↓{messageNumber} {message.isRead ? '(read)' : '(unread)'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{date}</span>
                  </div>
                  {message.isRead && (
                    <p className="text-sm text-gray-500 mt-1 truncate pl-5">
                      {message.content.slice(0, 80)}...
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} basePath="/inbox" />
      </main>
    </>
  )
}
