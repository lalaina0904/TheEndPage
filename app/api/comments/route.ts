import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function POST(req: Request) {
  try {
    const { userId } : any = auth();
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const { postId, content } = await req.json();

    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        authorId: userId,
      },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
