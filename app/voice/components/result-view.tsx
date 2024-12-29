"use client";

import { Clock, FileAudio, TextQuote, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioPlayer from "./audio-player";
import { useEffect, useState, useRef } from "react";

interface ResultViewProps {
  text: string;
  audioUrl: string;
  size: number;
  onReset: () => void;
}

export function ResultView({ text, audioUrl, size, onReset }: ResultViewProps) {
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wordCount = text.trim().split(/\s+/).length;
  
  useEffect(() => {
    // Create an audio element to get duration
    const audio = new Audio(audioUrl);
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    return () => {
      audio.remove();
    };
  }, [audioUrl]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'synthesized-speech.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Audio is <span className="text-blue-600">Ready</span></h1>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center space-x-2 text-gray-600 justify-center">
          <Clock className="h-5 w-5 mr-2" />
          <span>Duration: {formatDuration(duration)}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600 justify-center">
          <TextQuote className="h-5 w-5 mr-2" />
          <span>Words: {wordCount}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600 justify-center">
          <FileAudio className="h-5 w-5 mr-2" />
          <span>Size: {size.toFixed(2)} MB</span>
        </div>

        <div className="flex justify-center md:col-start-2 md:col-span-1 lg:col-auto">
          <button
            onClick={handleDownload}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Download audio file"
          >
            <Download className="h-5 w-5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <AudioPlayer audioUrl={audioUrl} />

      <Button
        variant="outline"
        className="w-full rounded-full bg-gray-200 text-gray-700"
        onClick={onReset}
      >
        Convert Another Text
      </Button>
    </div>
  );
}