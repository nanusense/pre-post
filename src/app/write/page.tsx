import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import Header from '@/components/Header'
import MessageForm from '@/components/MessageForm'

export default async function WritePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <Header user={{ email: user.email, credits: user.credits, isAdmin: isAdmin(user.email) }} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            &larr; Back to dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-2">Write a message</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Send an anonymous message to someone you care about.
          You&apos;ll earn 1 credit when you send it.
          You can only send one message per person, so make it count.
        </p>

        <MessageForm />

        <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
          <h2 className="font-medium mb-2 text-red-800 dark:text-red-300">Community guidelines</h2>
          <p className="text-sm text-red-700 dark:text-red-400">
            Foul language, hate speech, and abusive messages are not allowed.
            Users who violate these guidelines may be reported and banned.
          </p>
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="font-medium mb-2">Writing tips</h2>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>Be specific about what you appreciate about them</li>
            <li>Share a memory that means something to you</li>
            <li>Tell them something you&apos;ve never said before</li>
            <li>Write as if you might never get another chance</li>
          </ul>
          <Link href="/how" className="text-sm text-black dark:text-gray-100 underline mt-3 inline-block">
            Read more writing tips &rarr;
          </Link>
        </div>
      </main>
    </>
  )
}
