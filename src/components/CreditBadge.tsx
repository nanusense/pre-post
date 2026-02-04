interface CreditBadgeProps {
  credits: number
}

export default function CreditBadge({ credits }: CreditBadgeProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
      {credits} credit{credits !== 1 ? 's' : ''}
    </span>
  )
}
