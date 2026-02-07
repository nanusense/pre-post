import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { db } from '@/lib/db'
import { sendMagicLinkEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, company } = await request.json()

    // Honeypot: if the hidden field is filled, silently reject
    if (company) {
      return NextResponse.json({ success: true, message: 'Check your email for the login link' })
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Look up existing user (don't create if missing — user creation is deferred to verify)
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (user?.suspended) {
      return NextResponse.json({ error: 'Account suspended' }, { status: 403 })
    }

    // Rate limit: skip sending if there's already an unused, unexpired magic link for this email
    const existingLink = await db.magicLink.findFirst({
      where: {
        email: normalizedEmail,
        used: false,
        expiresAt: { gt: new Date() },
      },
    })

    if (existingLink) {
      return NextResponse.json({ success: true, message: 'We already sent you a link — check your inbox or spam folder' })
    }

    // Generate magic link token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    await db.magicLink.create({
      data: {
        email: normalizedEmail,
        token,
        expiresAt,
        userId: user?.id ?? null,
      },
    })

    // Send email (always use standard login template; welcome email is sent after verify)
    const result = await sendMagicLinkEmail(normalizedEmail, token)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Unable to send login email right now. Please try again in a few minutes.' },
        { status: 500 }
      )
    }

    // In development, return the magic link for testing
    if (!process.env.RESEND_API_KEY && 'magicLink' in result) {
      return NextResponse.json({
        success: true,
        message: 'Check your email for the login link',
        devMagicLink: result.magicLink
      })
    }

    return NextResponse.json({ success: true, message: 'Check your email for the login link' })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
