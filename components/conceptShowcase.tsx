'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function ConceptShowcase() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            {/* Logos (optionnel) */}
            <div className="text-sm text-muted-foreground mb-4">
                Utilisé par des personnes qui savent partir avec classe.
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CARD 1 - Note d’adieu */}
                <Card className="bg-red-50 text-black">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="secondary"
                                className="bg-red-200 text-red-800">
                                Page d’adieu
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                Nouveau
                            </span>
                        </div>
                        <CardTitle className="text-lg">
                            Un mot, une dernière fois.
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                        Exprimez ce que vous avez sur le cœur avant de tourner
                        la page : un merci, une pique, ou juste une citation
                        stylée. Tout est possible.
                        <div className="mt-4 text-xs text-gray-500">
                            Exemple : <br />
                            <q>
                                Merci pour les fous rires, les cafés, et les
                                bugs jamais résolus.
                            </q>
                        </div>
                    </CardContent>
                </Card>

                {/* CARD 2 - Galerie publique */}
                <Card className="bg-blue-50 text-black">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="secondary"
                                className="bg-blue-200 text-blue-800">
                                Galerie
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                Découvrir
                            </span>
                        </div>
                        <CardTitle className="text-lg">
                            Les meilleures sorties.
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                        Parcourez les pages les plus drôles, touchantes ou
                        absurdes de la communauté. À liker, partager, ou s’en
                        inspirer.
                        <div className="mt-4 flex justify-end">
                            <ArrowRight className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                {/* CARD 3 - Mode auto-destruction */}
                <Card className="bg-yellow-50 text-black">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="secondary"
                                className="bg-yellow-200 text-yellow-800">
                                Option
                            </Badge>
                        </div>
                        <CardTitle className="text-lg">
                            Auto-destruction 👀
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                        Programmez votre page pour disparaître après lecture.
                        Une dernière trace, éphémère mais marquante.
                    </CardContent>
                </Card>

                {/* CARD 4 - Ton personnalisé */}
                <Card className="bg-green-50 text-black">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="secondary"
                                className="bg-green-200 text-green-800">
                                IA
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                En beta
                            </span>
                        </div>
                        <CardTitle className="text-lg">
                            Un ton qui vous ressemble.
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                        Choisissez un ton ou laissez l’IA rédiger votre message
                        de départ : dramatique, ironique, classe ou absurde.
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
