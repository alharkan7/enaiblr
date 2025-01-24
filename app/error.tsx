'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

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
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Something went wrong!</h2>
        <Button
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
