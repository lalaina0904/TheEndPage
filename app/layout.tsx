import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import ClerkThemeWrapper from '@/components/ClerkThemeWrapper';
import LayoutClientWrapper from './layout-client-wrapper';

const outfit = Outfit({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'TheEnd.Page',
    description:
        'TheEnd.Page is a platform that allows you to create a beautiful and personalized end page for your website.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html
                lang="en"
                className={`${outfit.className} antialiased`}
                suppressHydrationWarning>
                <body className="bg-[#000008] text-white min-h-screen overflow-auto">
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}>
                        <ClerkThemeWrapper>
                            <LayoutClientWrapper>
                                {children}
                            </LayoutClientWrapper>
                        </ClerkThemeWrapper>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
