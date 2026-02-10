import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendReminderEmail } from '@/lib/email'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const messages = await db.message.findMany({
    where: {
      isRead: false,
      isDeleted: false,
      reminderSentAt: null,
      createdAt: { lt: sevenDaysAgo },
    },
    select: {
      id: true,
      recipientEmail: true,
      recipientName: true,
    },
  })

  let sentCount = 0

  for (const message of messages) {
    const result = await sendReminderEmail(message.recipientEmail, message.recipientName)

    if (result.success) {
      await db.message.update({
        where: { id: message.id },
        data: { reminderSentAt: new Date() },
      })
      sentCount++
    }
  }

  return NextResponse.json({ sent: sentCount, total: messages.length })
}
