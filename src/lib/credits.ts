import { db } from './db'

export async function awardCredit(userId: string) {
  return db.user.update({
    where: { id: userId },
    data: { credits: { increment: 1 } },
  })
}

export async function spendCredit(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  })

  if (!user || user.credits < 1) {
    throw new Error('Insufficient credits')
  }

  return db.user.update({
    where: { id: userId },
    data: { credits: { decrement: 1 } },
  })
}

export async function getCredits(userId: string): Promise<number> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  })

  return user?.credits ?? 0
}
