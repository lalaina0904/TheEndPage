import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'
export async function GET() {
  const data = { message: 'Hello from the API!' }
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}
