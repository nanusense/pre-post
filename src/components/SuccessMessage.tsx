'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SuccessMessage() {
  const searchParams = useSearchParams()
  const sent = searchParams.get('sent')
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sent === 'true') {
      setShow(true)
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setShow(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [sent])

  if (!show) return null

  return (
    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <p className="font-medium text-green-800 dark:text-green-300 mb-1">Message sent!</p>
      <p className="text-sm text-green-700 dark:text-green-400">
        Your message is on its way. You earned 1 credit to read a message.
      </p>
    </div>
  )
}
