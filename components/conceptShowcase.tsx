'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Handshake, HeartPlus, PencilLine } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay },
    }),
};

export default function ConceptCards() {
    return (
        <section className="container mx-auto px-6 py-16 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Card 1 */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={0}>
                    <Card className="bg-[#30353c96] text-neutral-100 border-2 border-[#30353c96]">
                        <CardHeader className="space-y-2">
                            <div className="flex items-center gap-2">
                                <PencilLine
                                    size={28}
                                    className="text-[#A17258]"
                                />
                                <Badge className="text-md bg-[#D0B49F] text-white uppercase">
                                    Expression libre
                                </Badge>
                                <span className="text-sm uppercase border-2 py-1 px-3 border-[#A17258] rounded-lg text-[#A17258]">
                                    Nouveau
                                </span>
                            </div>
                            <CardTitle className="text-xl font-semibold">
                                Racontez votre histoire ou votre ressenti.
                            </CardTitle>
                            <p className="text-lg text-gray-100">
                                Que ce soit une rupture, une démission ou un
                                moment de bascule : exprimez librement vos
                                émotions, votre vécu, ou même un simple mot.
                            </p>
                        </CardHeader>
                        <CardContent className="mt-2 flex flex-col items-center">
                            <Image
                                src="/stories.png"
                                alt="Écrire son message"
                                width={600}
                                height={300}
                                className="rounded-xl border"
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 2 */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={0.2}>
                    <Card className="bg-[#E6D3C0] text-neutral-700">
                        <CardHeader className="space-y-2">
                            <div className="flex items-center gap-2">
                                <HeartPlus
                                    size={28}
                                    className="text-[#B89078]"
                                />
                                <Badge className="text-md bg-[#B89078] text-white uppercase">
                                    Support IA
                                </Badge>
                                <span className="text-sm uppercase border-2 py-1 px-3 border-[#A17258] rounded-lg text-[#A17258]">
                                    Beta
                                </span>
                            </div>
                            <CardTitle className="text-xl font-semibold">
                                Un assistant émotionnel, rien que pour vous.
                            </CardTitle>
                            <p className="text-lg text-gray-600">
                                Discutez avec une IA bienveillante formée pour
                                vous écouter, vous conseiller, et vous aider à
                                traverser ce moment difficile.
                            </p>
                        </CardHeader>
                        <CardContent className="mt-2 flex flex-col items-center">
                            <Image
                                src="/chat.png"
                                alt="Chat IA empathique"
                                width={600}
                                height={300}
                                className="rounded-xl border"
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Card 3 */}
            <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.4}>
                <Card className="text-neutral-700 bg-[#30353c96] border-2 border-[#f2e8dc]/10">
                    <CardHeader className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Handshake size={28} className="text-[#e5b093]" />
                            <Badge className="text-sm bg-[#e5b093] text-white uppercase">
                                Communauté
                            </Badge>
                            <span className="text-sm uppercase border-2 py-1 px-3 border-white rounded-lg text-white">
                                Participatif
                            </span>
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-50">
                            Découvrez les histoires des autres. Soutenez,
                            commentez.
                        </CardTitle>
                        <p className="text-lg text-white/90">
                            Parcourez une collection d’histoires partagées par
                            des personnes comme vous. Lisez, commentez, laissez
                            un cœur ou un message de réconfort.
                        </p>
                        <p className="text-lg text-white/90">
                            Partagez votre propre histoire et laissez une
                            empreinte positive dans la vie des autres.
                        </p>

                        <div className="mt-4 flex items-center justify-end">
                            <a
                                href="#"
                                className="inline-flex items-center px-4 py-2 text-lg font-medium uppercase text-[#e5b093] border-[#e5b093] border bg-transparent rounded-md shadow-sm hover:bg-[#e5b093]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e5b093]/50">
                                Découvrir les histoires
                            </a>
                        </div>
                    </CardHeader>
                </Card>
            </motion.div>
        </section>
    );
}
