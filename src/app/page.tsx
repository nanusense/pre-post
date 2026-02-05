import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold">Pre-Post</span>
          {user ? (
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="text-sm text-gray-600 hover:text-black">
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6">
          One message. Anonymous. Say it before it&apos;s too late.
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Send anonymous, heartfelt messages to people you care about.
          To read a message someone wrote for you, first pay it forward
          by writing one yourself.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={user ? '/write' : '/login'}
            className="inline-block px-6 py-3 bg-black text-white text-center rounded-lg font-medium hover:bg-gray-800"
          >
            Write a Message
          </Link>
          <Link
            href="/why"
            className="inline-block px-6 py-3 border border-gray-300 text-center rounded-lg font-medium hover:border-gray-400"
          >
            Why This Exists
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>
          <p className="text-gray-600 mb-8">
            We often say the right things about people after they&apos;re no longer in our lives, or after they&apos;ve left us too soon. Pre-Post helps you say it now.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-medium">
                1
              </div>
              <div>
                <h3 className="font-medium mb-1">Write from the heart</h3>
                <p className="text-gray-600">
                  Think of someone who matters to you. Write them a message you&apos;ve
                  never had the courage to say. It&apos;s completely anonymous.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-medium">
                2
              </div>
              <div>
                <h3 className="font-medium mb-1">They get notified</h3>
                <p className="text-gray-600">
                  The recipient receives an email saying someone wrote them a
                  message. They won&apos;t know it&apos;s from you.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-medium">
                3
              </div>
              <div>
                <h3 className="font-medium mb-1">Pay it forward</h3>
                <p className="text-gray-600">
                  To read a message, they must first write one to someone else.
                  This creates a chain of kind words spreading through the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold mb-4">Our promise</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex gap-2">
              <span className="text-black">&#10003;</span>
              <span>Your identity is never revealed to the recipient</span>
            </li>
            <li className="flex gap-2">
              <span className="text-black">&#10003;</span>
              <span>Messages sent are permanent - no edits, no deletes</span>
            </li>
            <li className="flex gap-2">
              <span className="text-black">&#10003;</span>
              <span>One message per person - make it count</span>
            </li>
            <li className="flex gap-2">
              <span className="text-black">&#10003;</span>
              <span>Messages stay in your inbox, until you delete them</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Who needs to hear from you?
          </h2>
          <p className="text-gray-600 mb-8">
            There&apos;s someone you&apos;ve been meaning to tell something.
            Now&apos;s the time.
          </p>
          <Link
            href={user ? '/write' : '/login'}
            className="inline-block px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
          >
            Write Your Message
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <span>Pre-Post</span>
            <nav className="flex gap-6">
              <Link href="/why" className="hover:text-gray-700">Why</Link>
              <Link href="/how" className="hover:text-gray-700">How to Write</Link>
              {user ? (
                <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              ) : (
                <Link href="/login" className="hover:text-gray-700">Sign in</Link>
              )}
            </nav>
          </div>
        </div>
      </footer>
    </main>
  )
}
