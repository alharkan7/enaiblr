'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-4 text-2xl font-medium text-gray-600">Page Not Found</h2>
        <p className="mb-8 text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/apps"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
