import ClientTestimonialsCarousel from '@/components/clientTestimonialCaroussel';
import ConceptShowcase from '@/components/conceptShowcase';
import Contact from '@/components/contact';
import Hero from '@/components/hero';
import Testimonials from '@/components/testimonials';
import { Assistant } from '@/components/assistant';

export default function Home() {
    return (
        <>
            <Hero />
            <ConceptShowcase />
            <ClientTestimonialsCarousel />
            <Contact />
            <Assistant />
        </>
    );
}
