import { Suspense } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import CTA from './components/CTA';
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from '@/components/ui/loading';
import FAQ from './components/FAQ';
import Highlights from './components/Highlights';
import Benefits from './components/Benefits';
import Product from './components/Product';

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen scroll-smooth">
        <Header />
        <main className="scroll-smooth relative z-[2]">
          <Suspense fallback={<Loading />}>
            <Hero />
            <Benefits />
            <Product />
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
