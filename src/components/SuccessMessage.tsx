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
      const timer = setTimeout(() => setShow(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [sent])

  if (!show) return null

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <p className="font-medium text-green-800 mb-1">Message sent!</p>
      <p className="text-sm text-green-700">
        Your message is on its way. You earned 1 credit to read a message.
      </p>
    </div>
  )
}
