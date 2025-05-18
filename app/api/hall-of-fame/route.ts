import { prisma } from "@/lib/prismaClient";
import { NextResponse } from "next/server";
import { scorePage } from "@/lib/gemini";

export async function GET() {
  try {
    const posts = await prisma.post.findMany();

    const results: { id: string; title: string; score: number;content:string }[] = [];

    for (const post of posts) {
      if (post.content) {
        try {
          const res = await fetch(post.content);
          const html = await res.text();

          const score = await scorePage(html);

          results.push({
            id: post.id,
            title: post.title,
            score,
            content:post.content,
          });
        } catch (e) {
          console.error(`Erreur lors de l’analyse du post ${post.id}`, e);
        }
      }
    }

    // Trier du plus grand au plus petit score
    results.sort((a, b) => b.score - a.score);
    const top3 = results.slice(0, 3);

    return NextResponse.json(top3);
  } catch (error) {
    console.error("Erreur dans GET /api/hall-of-fame:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
