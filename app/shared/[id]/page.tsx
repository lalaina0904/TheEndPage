import { prisma } from "@/lib/prismaClient";
import { notFound } from "next/navigation";

export default async function SharedPage({ params }: { params: { id: string } }) {
  // params est disponible directement ici
  const shared = await prisma.comment.findUnique({
    where: { id: params.id },
    include: { post: true },
  });

  if (!shared || !shared.post) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{shared.post.title}</h1>
      <p className="text-sm text-gray-500 mb-2">Ton : {shared.post.tone}</p>
      <div className="border p-4 rounded bg-white whitespace-pre-wrap">{shared.post.content}</div>
    </div>
  );
}
