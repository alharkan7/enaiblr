import { Suspense } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import CTA from './components/CTA';
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from '@/components/ui/loading';
import FAQ from './components/FAQ';
import Highlights from './components/Highlights';

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen scroll-smooth">
        <Header />
        <main className="scroll-smooth relative z-[2]">
          <Suspense fallback={<Loading />}>
            <Hero />
            <Highlights />
            <Features />
            <CTA />
            <FAQ />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
