import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createSession } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid', request.url))
    }

    // Find and validate magic link
    const magicLink = await db.magicLink.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!magicLink) {
      return NextResponse.redirect(new URL('/login?error=invalid', request.url))
    }

    if (magicLink.used) {
      return NextResponse.redirect(new URL('/login?error=used', request.url))
    }

    if (magicLink.expiresAt < new Date()) {
      return NextResponse.redirect(new URL('/login?error=expired', request.url))
    }

    // Mark as used
    await db.magicLink.update({
      where: { id: magicLink.id },
      data: { used: true },
    })

    // Get or create user
    let user = magicLink.user
    let isNewUser = false

    if (!user) {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email: magicLink.email },
      })

      if (existingUser) {
        user = existingUser
      } else {
        user = await db.user.create({
          data: { email: magicLink.email },
        })
        isNewUser = true

        // Send welcome email to new users
        await sendWelcomeEmail(user.email)
      }

      // Link any messages sent to this email
      await db.message.updateMany({
        where: { recipientEmail: magicLink.email, recipientId: null },
        data: { recipientId: user.id },
      })
    }

    if (user.suspended) {
      return NextResponse.redirect(new URL('/login?error=suspended', request.url))
    }

    // Create session
    const sessionToken = await createSession(user.id, user.email)

    // Redirect to dashboard with session cookie
    const redirectUrl = new URL('/dashboard', request.url)
    if (isNewUser) {
      redirectUrl.searchParams.set('welcome', 'true')
    }
    const response = NextResponse.redirect(redirectUrl)
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.redirect(new URL('/login?error=server', request.url))
  }
}
