import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messageId, reason } = await request.json()

    if (!messageId || !reason) {
      return NextResponse.json({ error: 'Message ID and reason are required' }, { status: 400 })
    }

    // Verify the message exists and user is the recipient
    const message = await db.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    if (message.recipientId !== user.id) {
      return NextResponse.json({ error: 'You can only report messages sent to you' }, { status: 403 })
    }

    // Check if already reported
    const existingReport = await db.report.findFirst({
      where: {
        messageId,
        reporterId: user.id,
      },
    })

    if (existingReport) {
      return NextResponse.json({ error: 'You have already reported this message' }, { status: 400 })
    }

    // Create report
    const report = await db.report.create({
      data: {
        messageId,
        reporterId: user.id,
        reason: reason.trim(),
      },
    })

    return NextResponse.json({ success: true, reportId: report.id })
  } catch (error) {
    console.error('Report error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
