import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from '@/lib/prismaClient';

export async function POST(req: Request) {
  const { userId } : any = auth();
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { postId } = await req.json();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== userId)
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const shareId = uuidv4();

  const shared = await prisma.comment.create({  
    data: {
      id: shareId,
      postId: post.id,
      content: "Lien partagé",
      authorId: userId,
    },
  });

  return NextResponse.json({ id: shared.id });
}
