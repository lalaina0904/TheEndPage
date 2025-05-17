import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prismaClient';

export async function POST(req: Request) {
  try {
    const authResult = auth();
    console.log("auth() result:", authResult);
    const { userId } : any = authResult;
    if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await req.json();
    const { title, content, tone } = body;

    if (!title || !tone) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        tone,
        authorId: userId,
      },
    });

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error("Erreur dans POST /api/posts:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
