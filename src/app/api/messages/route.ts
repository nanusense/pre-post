import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { awardCredit } from '@/lib/credits'
import { sendNewMessageNotification } from '@/lib/email'
import { containsBlockedContent } from '@/lib/content-filter'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.suspended) {
      return NextResponse.json({ error: 'Account suspended' }, { status: 403 })
    }

    const { recipientName, recipientEmail, content } = await request.json()

    if (!recipientName || !recipientEmail || !content) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Check for blocked content
    const contentCheck = containsBlockedContent(content)
    if (contentCheck.blocked) {
      return NextResponse.json({ error: contentCheck.reason }, { status: 400 })
    }

    const nameCheck = containsBlockedContent(recipientName)
    if (nameCheck.blocked) {
      return NextResponse.json({ error: 'Recipient name contains inappropriate content' }, { status: 400 })
    }

    const normalizedEmail = recipientEmail.toLowerCase().trim()

    // Can't send to yourself (disabled for testing)
    // if (normalizedEmail === user.email.toLowerCase()) {
    //   return NextResponse.json({ error: "You can't send a message to yourself" }, { status: 400 })
    // }

    // Check if already sent a message to this person
    const existingMessage = await db.message.findUnique({
      where: {
        senderId_recipientEmail: {
          senderId: user.id,
          recipientEmail: normalizedEmail,
        },
      },
    })

    if (existingMessage) {
      return NextResponse.json(
        { error: "You've already sent a message to this person" },
        { status: 400 }
      )
    }

    // Check if recipient is a registered user
    const recipient = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Create message
    const message = await db.message.create({
      data: {
        senderId: user.id,
        recipientEmail: normalizedEmail,
        recipientName: recipientName.trim(),
        recipientId: recipient?.id,
        content: content.trim(),
      },
    })

    // Award credit
    await awardCredit(user.id)

    // Send notification email
    await sendNewMessageNotification(normalizedEmail, recipientName.trim())

    return NextResponse.json({ success: true, messageId: message.id })
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
