import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import Header from '@/components/Header'
import Pagination from '@/components/Pagination'

const PAGE_SIZE = 20

export default async function SentPage({
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

  const where = { senderId: user.id }

  const [messages, totalCount] = await Promise.all([
    db.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
    db.message.count({ where }),
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

        <h1 className="text-2xl font-semibold mb-6">Sent Messages</h1>

        {totalCount === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven&apos;t sent any messages yet</p>
            <Link
              href="/write"
              className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Write your first message
            </Link>
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
                <div
                  key={message.id}
                  className="p-4 rounded-lg bg-sky-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">PP ↑{messageNumber}</span>
                    <span className="text-sm text-gray-500">{date}</span>
                  </div>
                  <p className="text-sm text-gray-600">To: {message.recipientName} ({message.recipientEmail})</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {message.content.slice(0, 120)}...
                  </p>
                  <div className="mt-2">
                    {message.isRead ? (
                      <span className="text-xs text-green-600">Read by recipient</span>
                    ) : (
                      <span className="text-xs text-gray-400">Not yet read</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} basePath="/sent" />
      </main>
    </>
  )
}
