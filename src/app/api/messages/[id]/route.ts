import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { spendCredit } from '@/lib/credits'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const message = await db.message.findUnique({
      where: { id },
    })

    if (!message || message.isDeleted) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Check if user is the recipient
    if (message.recipientId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // If already read, return message without spending credit
    if (message.isRead) {
      return NextResponse.json({ message })
    }

    // Check credits
    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits', needsCredits: true },
        { status: 402 }
      )
    }

    // Spend credit and mark as read
    await spendCredit(user.id)

    const updatedMessage = await db.message.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return NextResponse.json({ message: updatedMessage, creditSpent: true })
  } catch (error) {
    console.error('Read message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const message = await db.message.findUnique({
      where: { id },
    })

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Only recipient can delete
    if (message.recipientId !== user.id) {
      return NextResponse.json({ error: 'You can only delete messages sent to you' }, { status: 403 })
    }

    // Soft delete - keep for admin review
    await db.message.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
