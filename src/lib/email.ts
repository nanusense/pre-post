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
        <p style="font-size: 16px; color: #444; margin-bottom: 24px;">
          Someone has written a heartfelt message just for you on Pre-Post.
        </p>
        <p style="font-size: 16px; color: #444; margin-bottom: 24px;">
          To read it, you'll need to pay it forward by writing a message to someone you care about.
        </p>
        <a href="${APP_URL}/login" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          Read Your Message
        </a>
        <p style="font-size: 14px; color: #666; margin-top: 32px;">
          Pre-Post is a place for anonymous, heartfelt messages.
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
