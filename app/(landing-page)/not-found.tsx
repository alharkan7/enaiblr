'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-950">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-200">404</h1>
        <h2 className="mb-4 text-2xl font-medium text-gray-400">Page Not Found</h2>
        <p className="mb-8 text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn group mb-4 w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
        >
          <span className="relative inline-flex items-center">
            Go back home
            <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
              -&gt;
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
