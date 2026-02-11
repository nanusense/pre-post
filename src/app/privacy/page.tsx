import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - Pre-Post',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          &larr; Home
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: February 11, 2026</p>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <p>
          Pre-Post (&quot;we&quot;, &quot;us&quot;) is an anonymous messaging platform. This policy explains what data we collect, how we use it, and your rights.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">What we collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Email address</strong> &mdash; Required to create an account and sign in. Also used to deliver messages and send notifications.
            </li>
            <li>
              <strong>Name</strong> (optional) &mdash; If you provide one, it&apos;s used for display purposes only.
            </li>
            <li>
              <strong>Messages you write</strong> &mdash; The content, recipient name, and recipient email address are stored so we can deliver messages. We do not access or read your messages &mdash; only the sender and recipient can see the content. The sole exception is when a message is reported for abuse, in which case it is reviewed by an administrator for moderation.
            </li>
            <li>
              <strong>Message metadata</strong> &mdash; Read status, timestamps, and whether a reminder email was sent.
            </li>
            <li>
              <strong>Reports</strong> &mdash; If you report a message, the reason you provide is stored for moderation.
            </li>
            <li>
              <strong>Usage data</strong> &mdash; We use Google Analytics to collect anonymous usage statistics such as page views and browser type. No personally identifiable information is sent to Google Analytics.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">What we don&apos;t collect</h2>
          <p>
            We do not collect passwords (we use magic link authentication), payment information, IP addresses, or location data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">How we use your data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To operate the service &mdash; delivering messages, managing credits, and maintaining your account.</li>
            <li>To send you emails &mdash; magic link login, new message notifications, and a one-time reminder if a message goes unread for 7 days.</li>
            <li>To moderate &mdash; reviewing reported messages and enforcing our rules.</li>
            <li>To understand usage &mdash; anonymous analytics help us improve the product.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Anonymity & message privacy</h2>
          <p>
            Your identity is never revealed to message recipients. Recipients see the message content and their own name &mdash; not who sent it.
          </p>
          <p className="mt-2">
            We cannot read your messages. Message content is only accessible to the sender and recipient. The only exception is when a message is reported for abuse &mdash; in that case, the message content is shown to administrators solely for moderation purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Cookies</h2>
          <p>We use one cookie:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong>session</strong> &mdash; An authentication token that keeps you signed in. It expires after 30 days, is HTTP-only, and cannot be read by JavaScript.
            </li>
          </ul>
          <p className="mt-2">
            We also store your theme preference (light/dark) in your browser&apos;s local storage.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Third-party services</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Resend</strong> &mdash; Delivers emails on our behalf. Receives recipient email addresses only as needed to send each email.</li>
            <li><strong>Google Analytics</strong> &mdash; Collects anonymous usage statistics.</li>
            <li><strong>Vercel</strong> &mdash; Hosts the application.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Data retention</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your account and messages are retained as long as your account exists.</li>
            <li>Messages are permanent by design &mdash; they cannot be edited after sending.</li>
            <li>You can delete messages you&apos;ve received from your inbox.</li>
            <li>Magic link tokens expire after 15 minutes and are single-use.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Your rights</h2>
          <p>
            You can request access to your data or ask us to delete your account by contacting us. Deleting your account removes your profile and associated data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Contact</h2>
          <p>
            For privacy questions, email us at{' '}
            <a href="mailto:hello@pre-post.com" className="underline hover:text-gray-900 dark:hover:text-gray-100">
              hello@pre-post.com
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}
