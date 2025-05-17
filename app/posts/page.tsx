'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Erreur lors du chargement des posts', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <div className="p-4">Chargement...</div>;

  if (posts.length === 0) return <div className="p-4 text-gray-500">Aucun document trouvé</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Mes documents</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white shadow-md rounded-2xl p-4 border hover:shadow-lg transition">
            <h2 className="text-lg font-medium truncate">{post.title}</h2>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {post.content || "Aucun contenu"}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Créé le {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <Link
              href={`/posts/${post.id}`}
              className="inline-block mt-3 text-blue-600 text-sm hover:underline"
            >
              Ouvrir
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
