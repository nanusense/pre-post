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
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const [
      userCount,
      messageCount,
      unreadMessageCount,
      pendingReportCount,
      messagesToday,
      usersToday,
      readMessageCount,
      suspendedUserCount,
      totalCredits,
      deletedMessageCount,
      remindersSentCount,
      pendingRemindersCount,
      recentUsers,
      recentMessages,
      pendingReports
    ] = await Promise.all([
      db.user.count(),
      db.message.count(),
      db.message.count({ where: { isRead: false } }),
      db.report.count({ where: { status: 'pending' } }),
      db.message.count({ where: { createdAt: { gte: today } } }),
      db.user.count({ where: { createdAt: { gte: today } } }),
      db.message.count({ where: { isRead: true } }),
      db.user.count({ where: { suspended: true } }),
      db.user.aggregate({ _sum: { credits: true } }),
      db.message.count({ where: { isDeleted: true } }),
      db.message.count({ where: { reminderSentAt: { not: null } } }),
      db.message.count({
        where: {
          isRead: false,
          isDeleted: false,
          reminderSentAt: null,
          createdAt: { lte: weekAgo },
        },
      }),
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
          reminderSentAt: true,
          createdAt: true,
          sender: {
            select: { email: true },
          },
        },
      }),
      db.report.findMany({
        where: { status: 'pending' },
        orderBy: { createdAt: 'desc' },
        include: {
          message: {
            include: {
              sender: {
                select: { id: true, email: true, suspended: true },
              },
            },
          },
          reporter: {
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
        pendingReports: pendingReportCount,
        messagesToday,
        usersToday,
        readRate: messageCount > 0 ? Math.round((readMessageCount / messageCount) * 100) : 0,
        suspendedUsers: suspendedUserCount,
        totalCredits: totalCredits._sum.credits || 0,
        deletedMessages: deletedMessageCount,
        remindersSent: remindersSentCount,
        pendingReminders: pendingRemindersCount,
      },
      recentUsers,
      recentMessages,
      pendingReports,
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

    const { action, userId, reportId } = await request.json()

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

    if (action === 'dismiss-report') {
      await db.report.update({
        where: { id: reportId },
        data: { status: 'dismissed', reviewedAt: new Date() },
      })
      return NextResponse.json({ success: true })
    }

    if (action === 'suspend-from-report') {
      // Get the report to find the sender
      const report = await db.report.findUnique({
        where: { id: reportId },
        include: { message: true },
      })

      if (!report) {
        return NextResponse.json({ error: 'Report not found' }, { status: 404 })
      }

      // Suspend the sender and mark report as reviewed
      await Promise.all([
        db.user.update({
          where: { id: report.message.senderId },
          data: { suspended: true },
        }),
        db.report.update({
          where: { id: reportId },
          data: { status: 'reviewed', reviewedAt: new Date() },
        }),
      ])

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
