'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);

    // If it's a chunk load error, automatically reload the page
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-950">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-semibold text-gray-200">Something went wrong!</h2>
        <p className="mb-8 text-gray-500">
          {error.message || "We're having trouble loading this page"}
        </p>
        <button
          onClick={() => reset()}
          className="btn group mb-4 w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
        >
          <span className="relative inline-flex items-center">
            Try again
            <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
              -&gt;
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
