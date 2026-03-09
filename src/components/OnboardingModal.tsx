'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function OnboardingModal() {
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome')
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isWelcome === 'true') {
      setShow(true)
      // Clean up URL without refreshing page
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [isWelcome])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Pre-Post</h2>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You&apos;re now part of a community that believes in saying things before it&apos;s too late.
        </p>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-3">How it works:</h3>
          <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex gap-2">
              <span className="font-semibold text-gray-900 dark:text-gray-100">1.</span>
              <span>Write an anonymous message to someone who matters to you</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-gray-900 dark:text-gray-100">2.</span>
              <span>You earn 1 credit for each message you send</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-gray-900 dark:text-gray-100">3.</span>
              <span>Use credits to read messages others have sent you</span>
            </li>
          </ol>
        </div>

        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-violet-800 dark:text-violet-300">
            <strong>Tip:</strong> Think of someone who&apos;s made a difference in your life.
            Say what you&apos;ve never said. Your identity stays completely anonymous.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShow(false)}
            className="flex-1 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300"
          >
            Maybe later
          </button>
          <Link
            href="/write"
            className="flex-1 px-4 py-3 bg-[#DDE3D5] dark:bg-[#3a4a2f] text-gray-900 dark:text-gray-100 rounded-full font-medium text-center hover:bg-[#CDD3C5] dark:hover:bg-[#4a5a3f] hover:shadow-lg hover:shadow-[#DDE3D5]/30 dark:hover:shadow-[#3a4a2f]/30 transition-all duration-300"
          >
            Write my first message
          </Link>
        </div>
      </div>
    </div>
  )
}
