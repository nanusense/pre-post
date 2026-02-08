import Link from 'next/link'

interface MessageCardProps {
  id: string
  recipientName: string
  createdAt: Date
  isRead: boolean
  preview?: string
}

export default function MessageCard({
  id,
  recipientName,
  createdAt,
  isRead,
  preview,
}: MessageCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      href={`/message/${id}`}
      className={`block p-4 border rounded-lg transition-colors ${
        isRead
          ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-medium">
            {isRead ? (
              <span>To: {recipientName}</span>
            ) : (
              <span>
                To: {recipientName}
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-black dark:bg-white text-white dark:text-black">
                  New
                </span>
              </span>
            )}
          </p>
          {preview && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate">{preview}</p>
          )}
        </div>
        <time className="text-sm text-gray-500 dark:text-gray-400 shrink-0">{formattedDate}</time>
      </div>
    </Link>
  )
}
