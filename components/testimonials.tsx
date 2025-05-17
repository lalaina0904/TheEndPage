'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
    {
        quote: '“J’ai pu dire ce que je n’ai jamais osé exprimer. TheEnd.page m’a libéré.”',
        author: '— Lina B., Étudiante en rupture',
    },
    {
        quote: '“J’ai reçu du soutien de parfaits inconnus. C’était exactement ce dont j’avais besoin.”',
        author: '— Jules T., Freelance en burn-out',
    },
    {
        quote: '“Créer cette page a été un vrai soulagement après mon départ d’équipe.”',
        author: '— Karim D., Ancien chef de projet',
    },
    {
        quote: '“Une page, un clic, et j’ai tourné la page. Merci.”',
        author: '— Zoé M., Créatrice de contenu',
    },
];

export default function Testimonials() {
    const [index, setIndex] = useState(0);

    const prev = () =>
        setIndex((index - 1 + testimonials.length) % testimonials.length);
    const next = () => setIndex((index + 1) % testimonials.length);

    return (
        <section className="bg-transparent dark:bg-black py-20">
            <div className="max-w-3xl mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold mb-4">
                    Ils en parlent mieux que nous
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-10">
                    Voici ce que nos utilisateurs ont ressenti après avoir
                    tourné la page.
                </p>

                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-8">
                    <blockquote className="text-xl font-medium italic mb-4 text-black dark:text-white">
                        {testimonials[index].quote}
                    </blockquote>
                    <p className="text-neutral-700 dark:text-neutral-300 font-semibold">
                        {testimonials[index].author}
                    </p>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-6">
                    {testimonials.map((_, i) => (
                        <span
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                                index === i
                                    ? 'bg-black dark:bg-white'
                                    : 'bg-neutral-300 dark:bg-neutral-600'
                            }`}
                        />
                    ))}
                </div>

                {/* Arrows */}
                <div className="flex justify-between items-center gap-6 mt-4">
                    <button
                        onClick={prev}
                        aria-label="Précédent"
                        className="text-2xl">
                        <ArrowLeft />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Suivant"
                        className="text-2xl">
                        <ArrowRight />
                    </button>
                </div>
            </div>
        </section>
    );
}
