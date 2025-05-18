'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Handshake, HeartPlus, PencilLine } from 'lucide-react';

export default function ConceptCards() {
    return (
        <section className="container mx-auto px-6 py-16 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 : Exprimer son histoire */}
                <Card className="bg-[#30353c96] text-neutral-100 border-2 border-[#30353c96]">
                    <CardHeader className="space-y-2">
                        <div className="flex items-center gap-2">
                            <PencilLine size={28} className="text-[#A17258]" />
                            <Badge className="text-md bg-[#D0B49F] text-white">
                                Expression libre
                            </Badge>
                            <span className="text-sm uppercase border-2 py-1 px-3 border-[#A17258] rounded-lg text-[#A17258]">
                                Nouveau
                            </span>
                        </div>
                        <CardTitle className="text-lg font-semibold">
                            Racontez votre histoire ou votre ressenti.
                        </CardTitle>
                        <p className="text-sm text-gray-100">
                            Que ce soit une rupture, une démission ou un moment
                            de bascule : exprimez librement vos émotions, votre
                            vécu, ou même un simple mot.
                        </p>
                    </CardHeader>
                    <CardContent className="mt-2">
                        <Image
                            src="/stories.png"
                            alt="Écrire son message"
                            width={600}
                            height={300}
                            className="rounded-xl border"
                        />
                    </CardContent>
                </Card>

                {/* Card 2 : Assistance émotionnelle IA */}
                <Card className="bg-[#E6D3C0] text-neutral-700">
                    <CardHeader className="space-y-2">
                        <div className="flex items-center gap-2">
                            <HeartPlus size={28} className="text-[#B89078]" />
                            <Badge className="text-md bg-[#B89078] text-white">
                                Support IA
                            </Badge>
                            <span className="text-sm uppercase border-2 py-1 px-3 border-[#A17258] rounded-lg text-[#A17258]">
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
                            src="/chat.png"
                            alt="Chat IA empathique"
                            width={600}
                            height={300}
                            className="rounded-xl border"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Card 3 : Découvrir les autres */}
            <Card className="text-neutral-700 bg-[#F2E8DC]/10 border-2 border-[#f2e8dc]/10">
                <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Handshake size={28} className="text-[#e5b093]" />
                        <Badge className="text-md bg-[#e5b093] text-white">
                            Communauté
                        </Badge>
                        <span className="text-sm uppercase border-2 py-1 px-3 border-white rounded-lg text-white">
                            Participatif
                        </span>
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-50">
                        Découvrez les histoires des autres. Soutenez, commentez.
                    </CardTitle>
                    <p className="text-sm text-white/90">
                        Parcourez une collection d’histoires partagées par des
                        personnes comme vous. Lisez, commentez, laissez un coeur
                        ou un message de réconfort.
                    </p>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-white/90">
                            En cours de développement...
                        </span>
                        <span className="text-sm text-white/90">🚧</span>
                    </div>
                </CardHeader>
            </Card>
        </section>
    );
}
