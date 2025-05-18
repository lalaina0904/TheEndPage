import { PrismaClient } from "@/generated/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // 1. On récupère les moyennes de votes groupées par postId
    const voteStats = await prisma.vote.groupBy({
      by: ['postId'],
      _avg: {
        value: true,
      },
    });

    // 2. On récupère tous les posts avec leur auteur
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
    });

    // 3. On fusionne les données
    const postsWithAverages = posts.map(post => {
      const voteStat = voteStats.find(v => v.postId === post.id);
      const averageVote = voteStat?._avg.value ?? null;

      return {
        ...post,
        averageVote: averageVote ? parseFloat(averageVote.toFixed(2)) : null,
      };
    });

    res.status(200).json(postsWithAverages);
  } catch (error) {
    console.error("Erreur dans /api/posts-with-avg:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
