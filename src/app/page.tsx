import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import ThemeToggle from '@/components/ThemeToggle'

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold">Pre-Post</span>
          <nav className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-gray-100 transition-colors" aria-label="Sign in">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </Link>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-[#DDE3D5]/20 via-transparent to-transparent dark:from-[#3a4a2f]/20 dark:via-transparent dark:to-transparent" />
        <div className="relative max-w-2xl mx-auto px-6">
          <p className="text-sm tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-6">Say it while they can read it</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6 leading-[1.15]">
            One message.<br className="hidden sm:block" /> Anonymous.<br />
            <span className="text-gray-500 dark:text-gray-400">Say it before it&apos;s too late.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-lg">
            Tell someone what they mean to you, without them knowing it&apos;s you.
            Before you can read, you must write. That&apos;s how kindness spreads.
          </p>

          <div className="flex flex-row gap-3">
            <Link
              href={user ? '/write' : '/login'}
              className="inline-block px-7 py-3.5 bg-[#DDE3D5] dark:bg-[#3a4a2f] text-gray-900 dark:text-gray-100 text-center rounded-full font-medium hover:bg-[#CDD3C5] dark:hover:bg-[#4a5a3f] hover:shadow-lg hover:shadow-[#DDE3D5]/30 dark:hover:shadow-[#3a4a2f]/30 transition-all duration-300"
            >
              Write a Message
            </Link>
            <Link
              href="/why"
              className="inline-block px-7 py-3.5 border border-gray-200 dark:border-gray-700 text-center rounded-full font-medium hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
            >
              Why Pre-Post?
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-20 sm:py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-sm tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-3">How it works</p>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Simple by nature</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-lg">
            We often say the right things about people after they&apos;re no longer in our lives, or after they&apos;ve left us too soon. Pre-Post helps you say it now.
          </p>

          {/* Steps with connecting line */}
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[19px] top-10 bottom-10 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />

            <div className="space-y-8">
              <div className="relative flex gap-5 items-start group">
                <div className="relative z-10 w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-medium flex-shrink-0 text-sm group-hover:scale-110 transition-transform duration-300">1</div>
                <div className="pt-1.5">
                  <h3 className="font-semibold mb-1.5">Write your message</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Think of someone who matters to you. Write them a message you&apos;ve
                    never had the courage to say. It stays completely anonymous.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-5 items-start group">
                <div className="relative z-10 w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-medium flex-shrink-0 text-sm group-hover:scale-110 transition-transform duration-300">2</div>
                <div className="pt-1.5">
                  <h3 className="font-semibold mb-1.5">They get notified</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    They receive an email from Pre-Post saying someone wrote them a
                    message. They won&apos;t know it&apos;s from you.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-5 items-start group">
                <div className="relative z-10 w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-medium flex-shrink-0 text-sm group-hover:scale-110 transition-transform duration-300">3</div>
                <div className="pt-1.5">
                  <h3 className="font-semibold mb-1.5">Pay it forward</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    To read a message, you need 1 credit. To earn a credit, write a message.
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium mt-1.5">
                    Simple: give one, get one.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="relative py-20 sm:py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white dark:from-gray-800/40 dark:to-gray-900" />
        <div className="relative max-w-2xl mx-auto px-6">
          <p className="text-sm tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-3">Our promise</p>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-10">Private by design</h2>
          <ul className="space-y-5">
            <li className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DDE3D5] dark:bg-[#3a4a2f] flex items-center justify-center mt-0.5">
                <svg className="w-3.5 h-3.5 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300 leading-relaxed">Your identity is never revealed to the recipient</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DDE3D5] dark:bg-[#3a4a2f] flex items-center justify-center mt-0.5">
                <svg className="w-3.5 h-3.5 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300 leading-relaxed">What you write stays between sender and recipient. Not even admins can access your messages.</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DDE3D5] dark:bg-[#3a4a2f] flex items-center justify-center mt-0.5">
                <svg className="w-3.5 h-3.5 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300 leading-relaxed">Messages sent are permanent &ndash; no edits, no deletes</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DDE3D5] dark:bg-[#3a4a2f] flex items-center justify-center mt-0.5">
                <svg className="w-3.5 h-3.5 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300 leading-relaxed">One message per person &ndash; make it count</span>
            </li>
            <li className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#DDE3D5] dark:bg-[#3a4a2f] flex items-center justify-center mt-0.5">
                <svg className="w-3.5 h-3.5 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300 leading-relaxed">Messages stay in your inbox, until you delete them</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#DDE3D5]/10 to-transparent dark:via-[#3a4a2f]/10" />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4 tracking-tight">
            Who needs to hear from you?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
            There&apos;s someone you&apos;ve been meaning to tell something.
            Now&apos;s the time.
          </p>
          <Link
            href={user ? '/write' : '/login'}
            className="inline-block px-10 py-4 bg-[#DDE3D5] dark:bg-[#3a4a2f] text-gray-900 dark:text-gray-100 rounded-full font-medium hover:bg-[#CDD3C5] dark:hover:bg-[#4a5a3f] hover:shadow-xl hover:shadow-[#DDE3D5]/40 dark:hover:shadow-[#3a4a2f]/40 hover:scale-[1.02] transition-all duration-300"
          >
            Write Your Message
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 dark:text-gray-500">
            <span>&copy; Pre-Post</span>
            <nav className="flex gap-6">
              <Link href="/why" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Why</Link>
              <Link href="/how" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">How to Write</Link>
              <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy</Link>
              {!user && (
                <Link href="/login" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Sign in</Link>
              )}
            </nav>
          </div>
        </div>
      </footer>
    </main>
  )
}
