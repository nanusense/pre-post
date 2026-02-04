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
          ? 'border-gray-200 hover:border-gray-300'
          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
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
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-black text-white">
                  New
                </span>
              </span>
            )}
          </p>
          {preview && (
            <p className="mt-1 text-sm text-gray-600 truncate">{preview}</p>
          )}
        </div>
        <time className="text-sm text-gray-500 shrink-0">{formattedDate}</time>
      </div>
    </Link>
  )
}
