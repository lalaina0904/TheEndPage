import { auth,currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prismaClient';

export async function POST(req: Request) {
  try {
    const authResult = auth();
    console.log("auth() result:", authResult);
    const user= await currentUser();
    const id= user?.id;
    //if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

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
        authorId: id,
      },
    });

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error("Erreur dans POST /api/posts:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user= await currentUser();
    const id= user?.id;

    if (!id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: { authorId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Erreur dans GET /api/posts:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
