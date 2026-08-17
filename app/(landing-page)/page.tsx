import './landing.css';

import { LandingFooter } from './components/footer';
import { LandingView } from './components/landing-view';

export default function LandingPage() {
  return (
    <div className="landing-page flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col justify-center px-5 py-4 sm:px-8 md:py-8">
        <LandingView />
      </main>
      <LandingFooter />
    </div>
  );
}
