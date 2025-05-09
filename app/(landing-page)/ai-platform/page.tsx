import { Suspense } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from '@/components/ui/loading';
import AnimatedBackground from './components/AnimatedBackground';
import FAQ from './components/FAQ';
import Statistics from './components/Statistics';
import Highlights from './components/Highlights';

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen scroll-smooth">
        <AnimatedBackground />
        <Header />
        <main className="scroll-smooth relative z-[2]">
          <Suspense fallback={<Loading />}>
            <Hero />
            <Highlights />
            <Features />
            <Statistics />
            <Testimonials />
            <Pricing />
            <CTA />
            <FAQ />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
