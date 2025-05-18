import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { FiTrendingUp } from 'react-icons/fi';

import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';
import { Span } from 'next/dist/trace';

const Hero = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden text-white">
            {/* Background image */}
            <div className="absolute inset-0 z-0 bg_aestetic bg-fixed">
                {/* <img
                        src="/bg.png"
                        alt="Background"
                        className="object-cover w-full h-full"
                    /> */}
                <div className="absolute inset-0 bg-black/65" />
            </div>

            {/* Overlay content */}
            <div className="relative z-10 lg:flex gap-6 h-full container mx-auto">
                <section className="flex flex-col w-full space-y-4 justify-center items-baseline mt-[10rem] space-x-4">
                    <div>
                        <p className="italic text-2xl mb-14">
                            La fin n’est que le début… d’un chef-d'œuvre.
                        </p>
                        <br />
                        <div className="text-xl">
                            <h1 className="text-5xl md:text-6xl tracking-wider mb-8">
                                THE END.
                                <span className="text-4xl font-light">
                                    Page
                                </span>
                            </h1>

                            <p className="uppercase  mb-8">
                                L'endroit rêver pour créer une page de départ
                                unique : dramatique, drôle, sincère ou
                                totalement WTF.
                            </p>

                            <p className="uppercase mb-8">
                                Un dernier mot avant de tourner la page ? Ou la
                                claquer bruyamment.?
                            </p>
                        </div>

                        <div className="mb-8 text-xl">
                            <Link
                                href="/create"
                                className=" font-semibold text-[#f1caad] border-b-2 border-[#f1caad] ">
                                Crée
                            </Link>
                            <span className="mx-4">, </span>
                            <Link
                                href="/customize"
                                className=" font-semibold text-[#f1caad] border-b-2 border-[#f1caad] ">
                                Personnalise
                            </Link>
                            <span className="mx-4">et</span>
                            <Link
                                href="/share"
                                className=" font-semibold text-[#f1caad] border-b-2 border-[#f1caad] ">
                                Partage
                            </Link>
                            <span className="mx-4 ">ton histoire !</span>
                        </div>
                    </div>

                    {/* Button */}

                    <div className="mt-8">
                        <div>
                            <SignedOut>
                                <div className="w-xl bg-background/2 backdrop-blur-lg uppercase text-2xl p-8 rounded-2xl font-semibold border-[0.5px] border-[#f1caad]/40 text-[#f1caad] ">
                                    <SignInButton
                                        forceRedirectUrl={'/editor'}
                                        children={<span>Créer une page</span>}
                                    />
                                </div>
                            </SignedOut>
                            <SignedIn>
                                <div className="bg-background/2 backdrop-blur-lg uppercase text-2xl p-8 rounded-2xl font-semibold border-[0.5px] border-[#f1caad]/40 text-[#f1caad] text-center">
                                    <Link href="/editor">Créer une page</Link>
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col justify-center w-max-[6rem] space-y-6 mt-10 lg:mt-[14rem]">
                    <div className="bg-[#111111ee] shadow-lg rounded-2xl p-6 space-y-4">
                        <h3 className="font-semibold mb-2">Extrait de page</h3>
                        {/* -- exemple -- */}
                        <div className="text-gray-300">
                            <p>
                                “Je pars sans rancune, mais avec un certain
                                soulagement.”
                            </p>
                            <div className="mt-2">
                                — Morgan, ancienne partenaire de projet
                            </div>
                            <div className="flex justify-between mt-4">
                                <button className="text-xs underline">
                                    Voir la page
                                </button>
                                <button className="text-xs underline">
                                    Partager
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111111ee] shadow-lg rounded-2xl p-6 text-lg">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <FiTrendingUp className="text-green-400" />{' '}
                            Statistiques de style
                        </h3>
                        <div className="space-y-2 text-gray-300">
                            <div className="flex justify-between">
                                <span>Ironique</span>
                                <span>35%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Touchant</span>
                                <span>30%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Classe</span>
                                <span>22%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Dramatique</span>
                                <span>13%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111111ee] shadow-lg rounded-2xl p-6">
                        <h3 className="font-semibold mb-2">Activité récente</h3>
                        <div className="text-xs text-gray-400">
                            Pages créées cette semaine :{' '}
                            <span className="text-white font-bold">+1,124</span>
                            <br />
                            Partages réseaux :
                            <span className="text-white font-bold">+2,980</span>
                            <br />
                            Pages supprimées :
                            <span className="text-white font-bold">8</span>
                        </div>
                    </div>
                </section>
                {/* <div className="text-white">hehe</div> */}
            </div>
        </div>
    );
};

export default Hero;
