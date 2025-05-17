import { PrismaClient } from "@/generated/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const postId = req.query.id as string;
  const { userId, value } = req.body;

  if (!postId || !userId || typeof value !== "number") {
    return res.status(400).json({ error: "postId, userId, and numeric value are required" });
  }

  
  if (value < 1 || value > 5) {
    return res.status(400).json({ error: "Vote value must be between 1 and 5" });
  }

  try {
    const vote = await prisma.vote.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      update: {
        value,
      },
      create: {
        value,
        userId,
        postId,
      },
    });

    return res.status(200).json({ success: true, vote });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to submit vote" });
  }
}
