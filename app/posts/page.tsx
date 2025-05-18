'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FolderOpen } from 'lucide-react';

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

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center text-muted-foreground">
                Chargement...
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="min-h-[calc(100vh-10rem)] px-6 flex flex-col items-center justify-center text-center text-muted-foreground">
                <FolderOpen size={30} className="mb-6" />
                <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white">
                    Aucun document trouvé
                </h2>
                <p className="text-sm text-gray-400 mb-6 max-w-md">
                    Vous n’avez encore rien créé. Commencez par créer votre
                    première page de départ.
                </p>
                <Link href="/editor">
                    <Button
                        variant="outline"
                        className="uppercase text-lg border-[#f1caad] text-[#f1caad] hover:bg-[#f1caad]/10 px-10 py-4">
                        Créer une page
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4 text-white">
                Mes documents
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white/5 text-white border border-white/10 rounded-2xl p-4 hover:border-white/20 transition">
                        <h2 className="text-lg font-medium truncate">
                            {post.title}
                        </h2>

                        {post.content && post.content.startsWith('http') ? (
                            <iframe
                                src={post.content}
                                title={post.title}
                                className="w-full h-40 rounded mt-3 border border-white/10"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        ) : (
                            <p className="text-sm text-white/60 mt-2 truncate">
                                {post.content || 'Aucun contenu'}
                            </p>
                        )}

                        <p className="text-xs text-white/40 mt-2">
                            Créé le{' '}
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>

                        <Link
                            href={`/posts/${post.id}`}
                            className="inline-block mt-3 text-sm text-[#f1caad] hover:underline">
                            Ouvrir
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
