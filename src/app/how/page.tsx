import Link from 'next/link'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import Header from '@/components/Header'

export default async function HowPage() {
  const user = await getCurrentUser()

  return (
    <>
      <Header user={user ? { email: user.email, credits: user.credits, isAdmin: isAdmin(user.email) } : null} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back to home
          </Link>
        </div>

        <article className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-semibold mb-8">How to write a meaningful message</h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            You have one chance to say something to this person anonymously.
            Here&apos;s how to make it count.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Start with why they matter</h2>
          <p className="text-gray-600 mb-4">
            Don&apos;t start with &quot;I wanted to tell you...&quot; or &quot;I&apos;ve been meaning to say...&quot;
            Jump straight into why they&apos;re important to you.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg mb-4 text-gray-700">
            <p className="italic">
              &quot;You probably don&apos;t know this, but you changed my life when you...&quot;
            </p>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Be specific</h2>
          <p className="text-gray-600 mb-4">
            Generic praise is forgettable. Specific moments are unforgettable.
            Mention actual things they said or did. The more concrete, the better.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg mb-4 text-gray-700">
            <p className="mb-2"><strong>Instead of:</strong> &quot;You&apos;re always there for me.&quot;</p>
            <p><strong>Try:</strong> &quot;When I called you at 2am after my breakup and you just listened
              for two hours without trying to fix anything. That saved me.&quot;</p>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Say the uncomfortable part</h2>
          <p className="text-gray-600 mb-4">
            The words you&apos;re most afraid to say are usually the ones that matter most.
            This is your chance to say them without the fear of their reaction.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg mb-4 text-gray-700">
            <p className="italic">
              &quot;I know we&apos;ve grown apart, but I still think about our friendship all the time...&quot;
            </p>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Write as if you might never get another chance</h2>
          <p className="text-gray-600 mb-4">
            Because you won&apos;t. This is a one-time message to this person.
            What would you regret not saying?
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Don&apos;t explain who you are</h2>
          <p className="text-gray-600 mb-4">
            You&apos;re anonymous. Resist the urge to give hints about your identity.
            It&apos;s not about you being recognized. It&apos;s about them feeling valued.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Don&apos;t ask for anything</h2>
          <p className="text-gray-600 mb-4">
            This isn&apos;t a conversation. It&apos;s a gift. Don&apos;t ask questions
            they can&apos;t answer. Don&apos;t request a response. Just give.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Take your time</h2>
          <p className="text-gray-600 mb-4">
            There&apos;s no rush. Write a draft. Sleep on it. Come back.
            Make sure every word is one you mean.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Prompts to get you started</h2>
          <ul className="space-y-2 text-gray-600 mb-8">
            <li>&quot;I never told you this, but...&quot;</li>
            <li>&quot;You probably don&apos;t remember, but there was this time when you...&quot;</li>
            <li>&quot;When I think about the people who shaped who I am, you&apos;re...&quot;</li>
            <li>&quot;I&apos;ve always wanted to thank you for...&quot;</li>
            <li>&quot;If I could tell you one thing you should know about yourself, it&apos;s...&quot;</li>
          </ul>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-700 mb-4">
              Ready to write? Take your time. Make it count.
            </p>
            <Link
              href={user ? '/write' : '/login'}
              className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
            >
              Start writing
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}
