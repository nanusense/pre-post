import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { db } from '@/lib/db'
import { sendMagicLinkEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Create or get user
    let user = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    let isNewUser = false
    if (!user) {
      user = await db.user.create({
        data: { email: normalizedEmail },
      })
      isNewUser = true

      // Link any messages that were sent to this email
      await db.message.updateMany({
        where: { recipientEmail: normalizedEmail, recipientId: null },
        data: { recipientId: user.id },
      })
    }

    if (user.suspended) {
      return NextResponse.json({ error: 'Account suspended' }, { status: 403 })
    }

    // Generate magic link token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    await db.magicLink.create({
      data: {
        email: normalizedEmail,
        token,
        expiresAt,
        userId: user.id,
      },
    })

    // Send email
    const result = await sendMagicLinkEmail(normalizedEmail, token, isNewUser)

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
