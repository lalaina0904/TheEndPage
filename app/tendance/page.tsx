"use client"
import { useEffect, useState } from 'react';
import { Trophy, Star, Loader2 } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  score: number;
  content: string;
};

const HallOfFame = () => {
  const [topPosts, setTopPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const res = await fetch('/api/hall-of-fame');
        const data = await res.json();
        setTopPosts(data);
      } catch (error) {
        console.error('Erreur lors du chargement des tendances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-16 relative overflow-hidden ">
      {/* Subtle gradient backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-black opacity-70 z-0"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-900/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-[95vw]">
        {/* Header */}
        <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="text-yellow-400 w-10 h-10 mr-3" />
            <h1 className="text-5xl font-extrabold tracking-tight">
              Hall of Fame
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-lg text-center">
            Les 3 meilleures fins sélectionnées par l'IA
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-white/50 animate-spin mb-4" />
            <p className="text-xl text-white/70">Chargement des chefs-d'œuvre...</p>
          </div>
        ) : topPosts.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center backdrop-blur-sm">
            <p className="text-xl text-white/80">Aucune tendance pour le moment.</p>
            <p className="mt-2 text-white/60">Revenez bientôt pour découvrir les contenus en vedette.</p>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-6 justify-center">
            {topPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex-none w-[600px] snap-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold mr-3">
                        {index + 1}
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight truncate">
                        {post.title}
                      </h2>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">
                          {post.score.toFixed(1)}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  {post.content ? (
                    <div className="rounded-lg overflow-hidden border border-white/10 aspect-video bg-black/50">
                      <iframe
                        src={post.content}
                        title={post.title}
                        className="w-full h-full"
                        sandbox=""
                      />
                    </div>
                  ) : (
                    <div className="rounded-lg border border-white/10 aspect-video bg-black/50 flex items-center justify-center">
                      <p className="text-white/50 italic">Aucune preview disponible</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HallOfFame