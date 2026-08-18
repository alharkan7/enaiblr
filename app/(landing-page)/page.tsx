import fs from 'fs';
import path from 'path';

import './landing.css';

import { LandingFooter } from './components/footer';
import { LandingHeader } from './components/header';
import { LandingView } from './components/landing-view';

export default function LandingPage() {
  const backstoryPath = path.join(process.cwd(), 'app', '(landing-page)', 'backstory.mdx');
  let backstoryContent = '';
  
  try {
    backstoryContent = fs.readFileSync(backstoryPath, 'utf8');
  } catch (error) {
    console.error('Failed to read backstory.mdx:', error);
    backstoryContent = 'Backstory content not found.';
  }

  return (
    <div className="landing-page flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <LandingHeader backstoryContent={backstoryContent} />
      <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col justify-center px-5 py-4 sm:px-8 md:py-8">
        <LandingView />
      </main>
      <LandingFooter />
    </div>
  );
}
