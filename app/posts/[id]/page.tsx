import { prisma } from '@/lib/prismaClient';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { id: true },
  });

  return posts.map((post) => ({ id: post.id }));
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { author: true },
  });

  if (!post) return notFound();

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <Link href="/" className="text-sm text-blue-600 hover:underline">← Retour</Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{post.title}</h1>
      <div className="text-gray-600 text-sm mb-6">
        Créé le {format(new Date(post.createdAt), 'dd/MM/yyyy')} par {post.author?.name || 'Utilisateur'}
      </div>
      <div className="prose prose-neutral max-w-none">
        {post.content && post.content.startsWith("http") ? (
          <iframe
            src={post.content}
            title={post.title}
            className="w-full h-[500px] rounded border"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          post.content || <em>Aucun contenu</em>
        )}
      </div>
    </main>
  );
}
