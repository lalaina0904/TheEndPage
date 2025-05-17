import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GhostIcon } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">
            <GhostIcon size={64} className="text-neutral-400 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Page introuvable</h1>
            <p className="text-md text-neutral-400 max-w-xl mb-6">
                Cette page semble avoir été abandonnée… comme une vieille
                relation ou un projet inachevé.
            </p>
            <Link href="/">
                <Button className="bg-white text-black hover:bg-neutral-200">
                    Retour à l’accueil
                </Button>
            </Link>
        </main>
    );
}
