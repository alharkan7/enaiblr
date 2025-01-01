"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SliderVertical } from "@/components/ui/slider-vertical";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface AudioPlayerProps {
  audioUrl: string;
  onDurationChange?: (duration: number) => void;
}

export default function AudioPlayer({ audioUrl, onDurationChange }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleCanPlayThrough = () => {
        console.log('Audio can play through');
        setError(null);
      };

      const handleError = (e: Event) => {
        const audioElement = e.target as HTMLAudioElement;
        console.error('Audio error:', {
          error: audioElement.error,
          networkState: audioElement.networkState,
          readyState: audioElement.readyState,
          src: audioElement.src
        });
        setError(`Failed to load audio: ${audioElement.error?.message || 'Unknown error'}`);
        setIsPlaying(false);
      };

      const handleEnded = () => {
        console.log('Audio playback ended');
        setIsPlaying(false);
        audio.currentTime = 0;
      };

      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('error', handleError);
      audio.addEventListener('ended', handleEnded);

      // Reset audio state
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      
      // Set source and load
      audio.src = audioUrl;
      
      // Set initial volume
      audio.volume = isMuted ? 0 : volume;
      
      // Load the audio
      audio.load();

      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
        setIsPlaying(false);
        // Only clear the source if we're changing to a new URL
        if (audio.src !== audioUrl) {
          audio.src = '';
        }
      };
    }
  }, [audioUrl, volume, isMuted]);

  const handlePlayPause = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          setError(null);
          console.log('Attempting to play audio:', audioRef.current.src);
          await audioRef.current.play();
          console.log('Audio playing successfully');
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setError(`Failed to play audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const newDuration = audioRef.current.duration;
      setDuration(newDuration);
      onDurationChange?.(newDuration);
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0];
      setVolume(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-4 p-2 sm:p-4 border rounded-xl bg-background shadow-sm overflow-hidden">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {error ? (
          <div className="text-destructive text-sm overflow-hidden text-ellipsis">{error}</div>
        ) : (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePlayPause}
              className="size-8 flex-shrink-0"
            >
              {isPlaying ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </Button>

            <span className="text-sm text-muted-foreground w-16 flex-shrink-0 text-center">
              {formatTime(currentTime)}
            </span>

            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSliderChange}
              className="flex-1 min-w-0"
            />

            <span className="text-sm text-muted-foreground w-16 text-right flex-shrink-0 text-center">
              {formatTime(duration)}
            </span>

            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 flex-shrink-0"
                  >
                    {isMuted ? (
                      <VolumeX className="size-4" />
                    ) : (
                      <Volume2 className="size-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-10 p-2" side="top" align="end">
                  <div className="h-24 flex items-center justify-center">
                    <SliderVertical
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.01}
                      onValueChange={(value) => {
                        const newVolume = value[0];
                        if (newVolume === 0) {
                          setIsMuted(true);
                        } else {
                          setIsMuted(false);
                          setVolume(newVolume);
                          if (audioRef.current) {
                            audioRef.current.volume = newVolume;
                          }
                        }
                      }}
                      className="h-full relative flex items-center select-none touch-none"
                    />
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                size="icon"
                variant="ghost"
                onClick={toggleMute}
                className="size-8 flex-shrink-0 sm:hidden"
              >
                <span className="sr-only">Toggle mute</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}