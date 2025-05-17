'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function ConceptCards() {
    return (
        <section className="container mx-auto px-6 py-16 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 : Exprimer son histoire */}
                <Card className="bg-red-50 text-black">
                    <CardHeader className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-red-200 text-red-800">
                                Expression libre
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                Nouveau
                            </span>
                        </div>
                        <CardTitle className="text-lg font-semibold">
                            Racontez votre histoire ou votre ressenti.
                        </CardTitle>
                        <p className="text-sm text-gray-700">
                            Que ce soit une rupture, une démission ou un moment
                            de bascule : exprimez librement vos émotions, votre
                            vécu, ou même un simple mot.
                        </p>
                    </CardHeader>
                    <CardContent className="mt-2">
                        <Image
                            src="/images/write-story.png"
                            alt="Écrire son message"
                            width={600}
                            height={300}
                            className="rounded-xl border"
                        />
                    </CardContent>
                </Card>

                {/* Card 2 : Assistance émotionnelle IA */}
                <Card className="bg-blue-50 text-black">
                    <CardHeader className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-200 text-blue-800">
                                Support IA
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                Beta
                            </span>
                        </div>
                        <CardTitle className="text-lg font-semibold">
                            Un assistant émotionnel, rien que pour vous.
                        </CardTitle>
                        <p className="text-sm text-gray-700">
                            Discutez avec une IA bienveillante formée pour vous
                            écouter, vous conseiller, et vous aider à traverser
                            ce moment difficile.
                        </p>
                    </CardHeader>
                    <CardContent className="mt-2">
                        <Image
                            src="/images/ai-support.png"
                            alt="Chat IA empathique"
                            width={600}
                            height={300}
                            className="rounded-xl border"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Card 3 : Découvrir les autres */}
            <Card className="bg-yellow-50 text-black">
                <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-200 text-yellow-800">
                            Communauté
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            Participatif
                        </span>
                    </div>
                    <CardTitle className="text-lg font-semibold">
                        Découvrez les histoires des autres. Soutenez, commentez.
                    </CardTitle>
                    <p className="text-sm text-gray-700">
                        Parcourez une collection d’histoires partagées par des
                        personnes comme vous. Lisez, commentez, laissez un ❤️ ou
                        un message de réconfort.
                    </p>
                </CardHeader>
                <CardContent className="mt-2">
                    <Image
                        src="/images/community-stories.png"
                        alt="Liste publique"
                        width={1200}
                        height={400}
                        className="rounded-xl border"
                    />
                </CardContent>
            </Card>
        </section>
    );
}
