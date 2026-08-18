'use client';

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 shrink-0 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 text-xs text-muted-foreground">
        <a href="mailto:mail@enaiblr.org" className="hover:text-foreground">
          mail@enaiblr.org
        </a>
        <p>© {year} enaiblr</p>
      </div>
    </footer>
  );
}
