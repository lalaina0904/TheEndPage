import Link from 'next/link';
import { FaInstagram, FaLinkedin, FaYoutube, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-[#0e0e0e] text-white text-sm">
            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between gap-8">
                {/* Colonne gauche : liens */}
                <div className="space-y-2">
                    <Link href="/" className="block hover:underline">
                        ACCUEIL
                    </Link>
                    <Link
                        href="/realisations"
                        className="block hover:underline">
                        RÉALISATIONS
                    </Link>
                    <Link href="/tendances" className="block hover:underline">
                        TENDANCES
                    </Link>
                </div>

                {/* Colonne droite : logo + icônes */}
                <div className="flex flex-col items-end gap-2">
                    <div className="text-xl font-semibold tracking-widest">
                        THE END <span className="text-sm font-light">Page</span>
                    </div>
                    <div className="flex space-x-4 text-white">
                        <a href="#" aria-label="Instagram">
                            <FaInstagram size={16} />
                        </a>
                        <a href="#" aria-label="LinkedIn">
                            <FaLinkedin size={16} />
                        </a>
                        <a href="#" aria-label="YouTube">
                            <FaYoutube size={16} />
                        </a>
                        <a href="mailto:hello@example.com" aria-label="Email">
                            <FaEnvelope size={16} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Ligne séparatrice */}
            <div className="border-t border-neutral-700 px-4 py-4 text-xs">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-neutral-400">
                    <div className="flex items-center space-x-1">
                        <span className="text-purple-200">♥</span>
                        <span>Design by Bisounours Team</span>
                    </div>

                    <Link
                        href="/mentions-legales"
                        className="hover:underline my-2 md:my-0">
                        Mentions légales
                    </Link>

                    <span className="text-xs">
                        © 2025 THE END. Tous droits réservés.
                    </span>
                </div>
            </div>
        </footer>
    );
}
