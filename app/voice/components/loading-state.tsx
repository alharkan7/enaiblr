"use client";

import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <h2 className="text-2xl font-semibold">Generating <span className="text-blue-600">Audio...</span>
        </h2>
      <p className="text-muted-foreground">This may take a few moments</p>
    </div>
  );
}