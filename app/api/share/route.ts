// /api/share/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from '@/lib/prismaClient';
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: "postId manquant" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.authorId !== user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const shareId = uuidv4();

    const shared = await prisma.comment.create({
      data: {
        id: shareId,
        postId: post.id,
        content: "Lien partagé",
        authorId: user.id,
      },
    });

    return NextResponse.json({ id: shared.id });
  } catch (error) {
    console.error("Erreur dans POST /api/share:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
