'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes';
import { useEffect, useState } from 'react';

export default function ClerkThemeWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { resolvedTheme } = useTheme();
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        if (resolvedTheme === 'light' || resolvedTheme === 'dark') {
            setTheme(resolvedTheme);
        }
    }, [resolvedTheme]);

    return (
        <ClerkProvider
            appearance={{
                baseTheme: theme === 'dark' ? dark : undefined,
                elements: {
                    card: theme === 'dark' ? 'bg-[#29304d]' : 'bg-[#fafafa]',
                    formButtonPrimary:
                        theme === 'dark'
                            ? 'bg-purple-600 hover:bg-purple-500 text-white'
                            : 'bg-black border border-black hover:bg-white hover:text-black',
                    formFieldInput:
                        theme === 'dark'
                            ? 'bg-[#222] text-white border border-gray-700'
                            : 'bg-white text-black border border-gray-300',
                },
            }}>
            {children}
        </ClerkProvider>
    );
}
