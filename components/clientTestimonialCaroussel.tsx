'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useMemo } from 'react';
import clsx from 'clsx';

const testimonials = [
    {
        name: 'Camille Lefèvre',
        brand: 'Ex-collègue RH',
        text: "TheEnd.page m'a permis de tourner la page en beauté après une démission difficile. J’ai pu exprimer tout ce que je n’avais jamais osé dire. Thérapie numérique validée !",
    },
    {
        name: 'Yanis B.',
        brand: 'Étudiant',
        text: 'J’ai utilisé TheEnd.page pour clôturer un projet étudiant. Résultat : fou rire général. Même le prof a partagé ma page en cours. Concept génial et super simple à utiliser.',
    },
    {
        name: 'Nadia K.',
        brand: 'Ex-copine (😅)',
        text: 'J’ai créé une page après ma rupture, avec de l’humour et quelques gif très bien placés. Ça m’a fait un bien fou. Et j’ai même eu des messages de soutien inattendus.',
    },
    {
        name: 'Kevin R.',
        brand: 'Freelance',
        text: 'TheEnd.page m’a permis de faire mes adieux à un client toxique… avec élégance. C’est libérateur et les options de personnalisation sont top.',
    },
    {
        name: 'Théa M.',
        brand: 'Chargée de comm',
        text: 'La galerie publique est touchante. On se rend compte qu’on n’est pas seul à vivre ces situations. J’ai même commenté des pages anonymes. Super initiative !',
    },
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
    const list = useMemo(() => [...testimonials, ...testimonials], []);
    return (
        <div className="overflow-hidden">
            <div
                className={clsx(
                    'flex gap-6 w-max animate-marquee',
                    reverse && 'animate-marquee-reverse'
                )}>
                {list.map((t, i) => (
                    <Card
                        key={i}
                        className="min-w-[280px] max-w-xs h-[14rem] border p-4 flex-shrink-0 bg-[#E6D3C0] text-neutral-400">
                        <CardContent className="space-y-2">
                            <p className="text-sm text-gray-800 leading-snug">
                                “{t.text}”
                            </p>
                            <div className="text-sm font-semibold text-gray-600">
                                {t.name}{' '}
                                <span className="text-gray-400">
                                    – {t.brand}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function ClientTestimonialsCarousel() {
    return (
        <section className="relative py-16 space-y-8 text-center bg_exploration bg-fixed">
            <h1 className="text-white text-2xl uppercase">
                Témoignages clients
            </h1>
            <h2 className="text-center text-3xl font-bold text-white">
                Ils ont testé, ils ont adoré !
            </h2>

            <MarqueeRow />
            <MarqueeRow reverse />
        </section>
    );
}
