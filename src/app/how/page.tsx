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
              &quot;You probably don&apos;t know this, but you&apos;ve had a bigger impact on my life than you realize...&quot;
            </p>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Focus on how they made you feel</h2>
          <p className="text-gray-600 mb-4">
            Instead of describing specific events that might reveal who you are,
            focus on the impact they had on you. Describe the feeling, not the moment.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg mb-4 text-gray-700">
            <p className="mb-2"><strong>Instead of:</strong> &quot;When we worked on that project together...&quot;</p>
            <p><strong>Try:</strong> &quot;You made me feel like my ideas mattered. That changed how I see myself.&quot;</p>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Say what you&apos;ve held back</h2>
          <p className="text-gray-600 mb-4">
            The words you&apos;ve never said are usually the ones that matter most.
            Share the emotion, not the story. Keep details vague to stay anonymous.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg mb-4 text-gray-700">
            <p className="italic">
              &quot;I&apos;ve always admired how you treat people. It inspires me to be better.&quot;
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
            they can&apos;t answer. Don&apos;t request a response &ndash; they don&apos;t know who you are, so they can&apos;t possibly respond. Just write.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Take your time</h2>
          <p className="text-gray-600 mb-4">
            There&apos;s no rush. Write a draft. Sleep on it. Come back.
            Make sure every word is one you mean.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Prompts to get you started</h2>
          <ul className="space-y-2 text-gray-600 mb-8">
            <li>&quot;I&apos;ve always admired how you...&quot;</li>
            <li>&quot;You make people feel...&quot;</li>
            <li>&quot;The world is better because you...&quot;</li>
            <li>&quot;I&apos;ve always wanted to thank you for being...&quot;</li>
            <li>&quot;If I could tell you one thing you should know about yourself, it&apos;s...&quot;</li>
          </ul>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-700 mb-4">
              Ready to write? Take your time. Make it count.
            </p>
            <Link
              href={user ? '/write' : '/login'}
              className="inline-block px-6 py-3 bg-[#DDE3D5] text-gray-900 rounded-lg font-medium hover:bg-[#CDD3C5]"
            >
              Start writing
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}
