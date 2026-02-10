import { Resend } from 'resend'

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendMagicLinkEmail(email: string, token: string, isNewUser = false) {
  const magicLink = `${APP_URL}/verify?token=${token}`

  const resend = getResendClient()

  // In development without API key, just log the link
  if (!resend) {
    console.log('Magic link (no email sent):', magicLink)
    return { success: true, magicLink }
  }

  const subject = isNewUser
    ? 'Welcome to Pre-Post – sign in to get started'
    : 'Your login link for Pre-Post'

  const html = isNewUser
    ? `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">Welcome to Pre-Post!</p>
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          Pre-Post is a place for anonymous, meaningful messages. People use it to say things they've never had the courage to say.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          Someone may have already written something for you. To read it, you'll first need to pay it forward by writing a message to someone you care about.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          Sign in here (link expires in 15 minutes): <a href="${magicLink}">${magicLink}</a>
        </p>
        <p style="font-size: 14px; color: #999; margin-top: 32px;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `
    : `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          Here's your sign-in link for Pre-Post. It expires in 15 minutes.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          <a href="${magicLink}">${magicLink}</a>
        </p>
        <p style="font-size: 14px; color: #999; margin-top: 32px;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `

  const text = isNewUser
    ? `Welcome to Pre-Post!\n\nPre-Post is a place for anonymous, meaningful messages. People use it to say things they've never had the courage to say.\n\nSomeone may have already written something for you. To read it, you'll first need to pay it forward by writing a message to someone you care about.\n\nSign in here (link expires in 15 minutes): ${magicLink}\n\nIf you didn't request this email, you can safely ignore it.`
    : `Here's your sign-in link for Pre-Post. It expires in 15 minutes.\n\n${magicLink}\n\nIf you didn't request this email, you can safely ignore it.`

  const { error } = await resend.emails.send({
    from: 'Pre-Post <hello@pre-post.com>',
    to: email,
    subject,
    html,
    text,
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

  const greeting = recipientName ? `Hi ${recipientName},` : 'Hi,'
  const loginUrl = `${APP_URL}/login`

  const { error } = await resend.emails.send({
    from: 'Pre-Post <hello@pre-post.com>',
    to: recipientEmail,
    subject: 'You have a new message on Pre-Post',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">${greeting}</p>
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          Someone has written an anonymous message for you on Pre-Post.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          Pre-Post lets people say things they've never had the courage to say. The sender's identity is never revealed.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          To read your message, sign in and write a message to someone you care about first. Then your message will be unlocked.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          Sign in here: <a href="${loginUrl}">${loginUrl}</a>
        </p>
        <p style="font-size: 14px; color: #999; margin-top: 32px;">
          This is a one-time notification. If you don't want to read this message, simply ignore this email.
        </p>
      </div>
    `,
    text: `${greeting}\n\nSomeone has written an anonymous message for you on Pre-Post.\n\nPre-Post lets people say things they've never had the courage to say. The sender's identity is never revealed.\n\nTo read your message, sign in and write a message to someone you care about first. Then your message will be unlocked.\n\nSign in here: ${loginUrl}\n\nThis is a one-time notification. If you don't want to read this message, simply ignore this email.`,
  })

  if (error) {
    console.error('Failed to send notification:', error)
    return { success: false, error }
  }

  return { success: true }
}

export async function sendReminderEmail(recipientEmail: string, recipientName: string) {
  const resend = getResendClient()

  if (!resend) {
    console.log('Reminder email (no email sent):', recipientEmail)
    return { success: true }
  }

  const greeting = recipientName ? `Hi ${recipientName},` : 'Hi,'
  const loginUrl = `${APP_URL}/login`

  const { error } = await resend.emails.send({
    from: 'Pre-Post <hello@pre-post.com>',
    to: recipientEmail,
    subject: 'Reminder: Someone wrote something for you',
    text: `${greeting}\n\nAbout a week ago, someone who knows you wrote you an anonymous message on Pre-Post. You haven't read it yet.\n\nPre-Post is a place where people say things they've never had the courage to say. The sender's identity is never revealed.\n\nTo read your message, sign in and write a message to someone you care about first. Then your message will be unlocked.\n\nSign in here: ${loginUrl}\n\nIf you want to know more about Pre-Post: ${APP_URL}/why\n\nIf you're not interested, no worries - we won't email you about this again.`,
  })

  if (error) {
    console.error('Failed to send reminder email:', error)
    return { success: false, error }
  }

  return { success: true }
}

export async function sendWelcomeEmail(email: string) {
  const resend = getResendClient()

  // In development without API key, just log
  if (!resend) {
    console.log('Welcome email (no email sent):', email)
    return { success: true }
  }

  const writeUrl = `${APP_URL}/write`

  const { error } = await resend.emails.send({
    from: 'Pre-Post <hello@pre-post.com>',
    to: email,
    subject: 'Welcome to Pre-Post',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">Welcome to Pre-Post!</p>
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          You're now part of a community that believes in saying things before it's too late.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          How it works: write an anonymous message to someone who matters to you. You earn 1 credit for each message you send. Use credits to read messages others have sent you.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          Start by writing your first message. Think of someone who's made a difference in your life.
        </p>
        <p style="font-size: 16px; color: #333; margin-bottom: 16px;">
          Write your first message: <a href="${writeUrl}">${writeUrl}</a>
        </p>
        <p style="font-size: 14px; color: #999; margin-top: 32px;">
          Say it pre, not post.
        </p>
      </div>
    `,
    text: `Welcome to Pre-Post!\n\nYou're now part of a community that believes in saying things before it's too late.\n\nHow it works: write an anonymous message to someone who matters to you. You earn 1 credit for each message you send. Use credits to read messages others have sent you.\n\nStart by writing your first message. Think of someone who's made a difference in your life.\n\nWrite your first message: ${writeUrl}\n\nSay it pre, not post.`,
  })

  if (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }

  return { success: true }
}
