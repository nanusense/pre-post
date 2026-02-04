'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      window.location.href = `/api/auth/verify?token=${token}`
    } else {
      router.push('/login?error=invalid')
    }
  }, [token, router])

  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
      <p className="text-gray-600">Verifying your login...</p>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </main>
  )
}
