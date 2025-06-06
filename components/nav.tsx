'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
    { href: '/', label: 'Accueil' },
    { href: '/realisations', label: 'Réalisations' },
    { href: '/Hall of Fame', label: 'Hall of Fame' },
];

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';

export default function Nav() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed w-full z-50">
            {/* Desktop / Header */}
            <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4 my-3 rounded-full bg-background/5 backdrop-blur-lg md:rounded-full border-[0.5px] border-[#f1caad]/40">
                <Link
                    href="/"
                    className="text-xl font-semibold tracking-widest">
                    THE END.<span className="text-lg font-light">Page</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:underline uppercase">
                            {link.label}
                        </Link>
                    ))}
                    {/* <Button variant="default" className="uppercase">
                        Se connecter
                    </Button> */}

                    <div>
                        <SignedOut>
                            <div className="bg-[#f1caad] rounded-md px-4 py-2 text-[0.9rem] shadow-none cursor-pointer focus:ring-offset-0 focus:ring-0">
                                <SignInButton
                                    forceRedirectUrl={'/'}
                                    children={
                                        <span className="text-neutral-500 uppercase font-semibold">
                                            Se connecter
                                        </span>
                                    }
                                />
                            </div>
                        </SignedOut>

                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                    <Select>
                        <SelectTrigger className="border-none focus-within:border-none">
                            <SelectValue placeholder="FR" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">FR</SelectItem>
                            <SelectItem value="dark">EN</SelectItem>
                        </SelectContent>
                    </Select>
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
                        className="md:hidden fixed top-0 left-0 h-screen w-full z-40 bg-white text-black">
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

                            <div className="flex mt-4">
                                <div>
                                    <SignedOut>
                                        <div className="bg-[#f1caad] rounded-md px-4 py-2 text-[0.9rem] shadow-none cursor-pointer focus:ring-offset-0 focus:ring-0">
                                            <SignInButton
                                                forceRedirectUrl={'/'}
                                                children={
                                                    <span className="text-neutral-500 uppercase font-semibold">
                                                        Se connecter
                                                    </span>
                                                }
                                            />
                                        </div>
                                    </SignedOut>

                                    <SignedIn>
                                        <UserButton />
                                    </SignedIn>
                                </div>
                            </div>

                            <hr className="border-neutral-600" />

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
                                <Select>
                                    <SelectTrigger className="border-none focus-within:border-none">
                                        <SelectValue placeholder="FR" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">
                                            FR
                                        </SelectItem>
                                        <SelectItem value="dark">EN</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
