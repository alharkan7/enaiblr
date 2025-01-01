"use client";

import { Clock, FileAudio, TextQuote, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioPlayer from "./audio-player";
import { useState, useRef } from "react";

interface ResultViewProps {
  text: string;
  audioUrl: string;
  size: number;
  blob?: Blob;
  onReset: () => void;
}

export function ResultView({ text, audioUrl, size, blob, onReset }: ResultViewProps) {
  const [duration, setDuration] = useState(0);
  const wordCount = text.trim().split(/\s+/).length;
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleDownload = () => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'synthesized-speech.wav';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'synthesized-speech.wav';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Your Audio is <span className="text-primary">Ready</span></h1>

      <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-4 mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-muted-foreground justify-center">
          <Clock className="size-4 sm:size-5 mr-1 sm:mr-2 shrink-0" />
          <span className="truncate text-sm sm:text-base">Duration: {formatDuration(duration)}</span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 text-muted-foreground justify-center">
          <TextQuote className="size-4 sm:size-5 mr-1 sm:mr-2 shrink-0" />
          <span className="truncate text-sm sm:text-base">Words: {wordCount}</span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 text-muted-foreground justify-center">
          <FileAudio className="size-4 sm:size-5 mr-1 sm:mr-2 shrink-0" />
          <span className="truncate text-sm sm:text-base">Size: {size.toFixed(2)} MB</span>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleDownload}
            aria-label="Download audio file"
            className="space-x-1 sm:space-x-2 h-8 sm:h-9 text-sm sm:text-base px-2 sm:px-4"
          >
            <Download className="size-4 sm:size-5" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      <AudioPlayer audioUrl={audioUrl} onDurationChange={setDuration} />

      <Button
        variant="outline"
        className="w-full rounded-full"
        onClick={onReset}
      >
        Convert Another Text
      </Button>
    </div>
  );
}