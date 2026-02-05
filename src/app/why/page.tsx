import Link from 'next/link'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import Header from '@/components/Header'

export default async function WhyPage() {
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
          <h1 className="text-3xl font-semibold mb-8">Why Pre-Post exists</h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            We all have things we&apos;ve never said. To parents, friends, partners,
            mentors, old classmates. Words that got stuck somewhere between
            our hearts and our mouths.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">The problem with &quot;someday&quot;</h2>
          <p className="text-gray-600 mb-4">
            We tell ourselves we&apos;ll say it someday. When the moment is right.
            When we&apos;re brave enough. When it won&apos;t be awkward.
          </p>
          <p className="text-gray-600 mb-4">
            But someday rarely comes. And sometimes, it comes too late.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">We say the nicest things too late</h2>
          <p className="text-gray-600 mb-4">
            Have you ever noticed how memory walls and tribute pages overflow with
            heartfelt messages? People write the most beautiful things about someone
            - after they&apos;re gone.
          </p>
          <p className="text-gray-600 mb-4">
            &quot;You changed my life.&quot; &quot;I never told you how much you meant to me.&quot;
            &quot;I wish I had said this sooner.&quot;
          </p>
          <p className="text-gray-600 mb-4">
            These memory walls often have more messages than that person ever received
            in their DMs while they were alive. We wait until it&apos;s too late to say
            what we really feel.
          </p>
          <p className="text-gray-600 mb-4">
            Pre-Post exists so you don&apos;t have to wait. Say it now, while they can
            still read it.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Why anonymity matters</h2>
          <p className="text-gray-600 mb-4">
            The hardest words to say aren&apos;t hard because of what they contain.
            They&apos;re hard because of what they reveal about us. Our vulnerability.
            Our need. Our love.
          </p>
          <p className="text-gray-600 mb-4">
            Anonymity removes that barrier. When you write here, you can say
            what you truly mean without worrying about how it changes how
            they see you.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Why pay it forward?</h2>
          <p className="text-gray-600 mb-4">
            Anyone can receive a nice message. But there&apos;s something
            transformative about writing one first.
          </p>
          <p className="text-gray-600 mb-4">
            When you sit down and think about someone you care about, when you
            put into words what they mean to you, something shifts inside you.
            You become more present to the love and gratitude that&apos;s already there.
          </p>
          <p className="text-gray-600 mb-4">
            That&apos;s why we ask you to write before you read. Not as a gate,
            but as a gift to yourself.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">One message, one person</h2>
          <p className="text-gray-600 mb-4">
            You can only send one message per person. This isn&apos;t a limitation,
            it&apos;s liberation.
          </p>
          <p className="text-gray-600 mb-4">
            When you know this is your only chance to say something to them,
            you don&apos;t waste it on small talk. You say what actually matters.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">No edits, no deletes</h2>
          <p className="text-gray-600 mb-4">
            Once you send a message, it&apos;s permanent. You can&apos;t take it back.
            You can&apos;t revise it.
          </p>
          <p className="text-gray-600 mb-4">
            This forces you to mean what you say. And it makes the message
            more meaningful to the recipient. They know you can&apos;t unsay it.
          </p>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-700 mb-4">
              Think of someone right now. Someone who&apos;s made your life better.
              Someone you&apos;ve never properly thanked. Someone who needs to
              hear something from you.
            </p>
            <Link
              href={user ? '/write' : '/login'}
              className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
            >
              Write to them now
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}
