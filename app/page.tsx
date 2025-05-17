import ConceptShowcase from '@/components/conceptShowcase';
import Contact from '@/components/contact';
import Hero from '@/components/hero';
import Testimonials from '@/components/testimonials';

export default function Home() {
    return (
        <>
            <Hero />
            <ConceptShowcase />
            <Testimonials />
            <Contact />
        </>
    );
}
