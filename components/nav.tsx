'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
    { href: '/', label: 'Accueil' },
    { href: '/realisations', label: 'Réalisations' },
    { href: '/tendances', label: 'Tendances' },
];

export default function Nav() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed w-full z-50">
            {/* Desktop / Header */}
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4 my-3 rounded-full bg-background/5 backdrop-blur-lg md:rounded-full border-[0.5px] border-neutral-100/20">
                <Link
                    href="/"
                    className="text-xl font-semibold tracking-widest">
                    THE END <span className="text-sm font-light">Page</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:underline">
                            {link.label}
                        </Link>
                    ))}
                    <Button variant="default">Se connecter</Button>
                    <select className="ml-4 text-sm focus:outline-none">
                        <option>FR</option>
                        <option>EN</option>
                    </select>
                </nav>

                <button
                    className={`md:hidden z-50 transition-colors duration-200 ${
                        open ? 'text-black' : 'text-white'
                    }`}
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu">
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden fixed top-0 left-0 h-screen w-full z-40 bg-white/80 backdrop-blur-2xl text-black">
                        <div className="flex items-center justify-between px-4 py-5 border-b border-neutral-200  ">
                            <Link
                                href="/"
                                className="text-xl font-semibold tracking-widest"
                                onClick={() => setOpen(false)}>
                                THE END{' '}
                                <span className="text-sm font-light">Page</span>
                            </Link>
                            <button
                                className="text-black"
                                onClick={() => setOpen(false)}
                                aria-label="Fermer le menu">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Menu content */}
                        <div className="flex flex-col gap-4 px-4 mt-6">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-lg"
                                    onClick={() => setOpen(false)}>
                                    {link.label}
                                </Link>
                            ))}

                            <div className="mt-4">
                                <Button className="w-full">Se connecter</Button>
                            </div>

                            <div className="mt-4 text-sm space-y-2">
                                <a
                                    href="mailto:hello@example.com"
                                    className="block">
                                    E-MAIL
                                </a>
                                <a href="#" className="block">
                                    INSTAGRAM
                                </a>
                                <a href="#" className="block">
                                    LINKEDIN
                                </a>
                            </div>

                            <div className="mt-auto pt-10">
                                <select className="text-sm bg-transparent focus:outline-none">
                                    <option>FR</option>
                                    <option>EN</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
