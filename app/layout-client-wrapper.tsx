'use client';

import { usePathname } from 'next/navigation';
import Nav from '@/components/nav';
import Footer from '@/components/footer';

export default function LayoutClientWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const hideLayout = pathname.startsWith('/editor');

    return (
        <>
            {!hideLayout && <Nav />}
            <main>{children}</main>
            {!hideLayout && <Footer />}
        </>
    );
}
