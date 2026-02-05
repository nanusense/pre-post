import { Resend } from 'resend'

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendMagicLinkEmail(email: string, token: string) {
  const magicLink = `${APP_URL}/verify?token=${token}`

  const resend = getResendClient()

  // In development without API key, just log the link
  if (!resend) {
    console.log('Magic link (no email sent):', magicLink)
    return { success: true, magicLink }
  }

  const { error } = await resend.emails.send({
    from: 'Pre-Post <noreply@resend.dev>',
    to: email,
    subject: 'Your login link for Pre-Post',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">Sign in to Pre-Post</h1>
        <p style="font-size: 16px; color: #444; margin-bottom: 24px;">
          Click the button below to sign in. This link expires in 15 minutes.
        </p>
        <a href="${magicLink}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          Sign In
        </a>
        <p style="font-size: 14px; color: #666; margin-top: 32px;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }

  return { success: true }
}

export async function sendNewMessageNotification(recipientEmail: string, recipientName: string) {
  const resend = getResendClient()

  // In development without API key, just log
  if (!resend) {
    console.log('New message notification (no email sent):', recipientEmail)
    return { success: true }
  }

  const { error } = await resend.emails.send({
    from: 'Pre-Post <noreply@resend.dev>',
    to: recipientEmail,
    subject: 'Someone wrote something heartfelt for you',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">Hi${recipientName ? ` ${recipientName}` : ''},</h1>

        <p style="font-size: 16px; color: #444; margin-bottom: 16px;">
          Someone who knows you has written an anonymous message just for you.
        </p>

        <p style="font-size: 16px; color: #444; margin-bottom: 24px;">
          They chose to share something meaningful with you - words they may have never said out loud.
        </p>

        <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">What is Pre-Post?</p>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
            Pre-Post is a platform for anonymous messages. People use it to say things they've never had the courage to say - thank yous, apologies, appreciations, and words that matter.
          </p>
          <p style="font-size: 14px; color: #6b7280;">
            The sender's identity is never revealed. You'll never know who wrote it.
          </p>
        </div>

        <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="font-size: 14px; font-weight: 600; color: #92400e; margin-bottom: 8px;">How it works</p>
          <p style="font-size: 14px; color: #a16207;">
            To read your message, you'll first need to "pay it forward" by writing a message to someone you care about. Once you do, you'll unlock your message.
          </p>
        </div>

        <a href="${APP_URL}/login" style="display: inline-block; background: #7c3aed; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Read Your Message
        </a>

        <p style="font-size: 13px; color: #9ca3af; margin-top: 32px;">
          This is a one-time notification. If you don't want to read this message, simply ignore this email.
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send notification:', error)
    return { success: false, error }
  }

  return { success: true }
}
