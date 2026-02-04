import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get stats
    const [userCount, messageCount, unreadMessageCount, recentUsers, recentMessages] = await Promise.all([
      db.user.count(),
      db.message.count(),
      db.message.count({ where: { isRead: false } }),
      db.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          email: true,
          credits: true,
          suspended: true,
          createdAt: true,
          _count: {
            select: {
              sentMessages: true,
              receivedMessages: true,
            },
          },
        },
      }),
      db.message.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          recipientEmail: true,
          recipientName: true,
          isRead: true,
          createdAt: true,
          sender: {
            select: { email: true },
          },
        },
      }),
    ])

    return NextResponse.json({
      stats: {
        users: userCount,
        messages: messageCount,
        unreadMessages: unreadMessageCount,
      },
      recentUsers,
      recentMessages,
    })
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { action, userId } = await request.json()

    if (action === 'suspend') {
      await db.user.update({
        where: { id: userId },
        data: { suspended: true },
      })
      return NextResponse.json({ success: true })
    }

    if (action === 'unsuspend') {
      await db.user.update({
        where: { id: userId },
        data: { suspended: false },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
