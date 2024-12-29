"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Sparkles, SlidersHorizontal } from 'lucide-react'
import { cn } from "@/lib/utils"
import { style } from './constants';

interface ImageFormProps {
  defaultPrompt?: string
  onGenerate?: (prompt: string, imageData?: string) => void
  onGenerateStart?: () => void
  onAspectRatioChange?: (aspectRatio: 'wide' | 'square' | 'portrait') => void
  imageDisplayed?: boolean
}

export function ImageForm({ defaultPrompt = "", onGenerate, onGenerateStart, onAspectRatioChange, imageDisplayed = false }: ImageFormProps) {
  const [showControls, setShowControls] = useState(imageDisplayed)
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [isGenerating, setIsGenerating] = useState(false)
  const [quality, setQuality] = useState<'standard' | 'hd'>('standard')
  const [aspectRatio, setAspectRatio] = useState<'wide' | 'square' | 'portrait'>('square')
  const [selectedStyle, setSelectedStyle] = useState("")

  useEffect(() => {
    setPrompt(defaultPrompt)
  }, [defaultPrompt])

  useEffect(() => {
    onAspectRatioChange?.(aspectRatio)
  }, [aspectRatio, onAspectRatioChange])

  const getDimensions = (quality: 'standard' | 'hd', aspectRatio: 'wide' | 'square' | 'portrait'): { width: number, height: number } => {
    if (quality === 'standard') {
      switch (aspectRatio) {
        case 'square': return { width: 768, height: 768 }
        case 'wide': return { width: 1024, height: 576 }
        case 'portrait': return { width: 576, height: 1024 }
      }
    } else { // HD
      switch (aspectRatio) {
        case 'square': return { width: 1440, height: 1440 }
        case 'wide': return { width: 1440, height: 816 }
        case 'portrait': return { width: 816, height: 1440 }
      }
    }
  }

  const handleGenerate = async () => {
    if (!prompt) return;

    try {
      onGenerateStart?.();
      const dimensions = getDimensions(quality, aspectRatio);
      const finalPrompt = selectedStyle ? `${prompt}\nStyle: ${selectedStyle}` : prompt;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          ...dimensions
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      onGenerate?.(prompt, data.imageData);
    } catch (error) {
      console.error('Error generating image:', error);
      onGenerate?.(prompt);
    }
  }

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="relative">
        <div className="relative flex items-center w-full">
          <Button
            variant="ghost"
            onClick={() => setShowControls(!showControls)}
            className={cn(
              "absolute left-3 z-10 h-10 w-10",
              showControls && "text-blue-500"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>

          <textarea
            placeholder="Imagine something..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="pl-16 pr-12 min-h-[3.5rem] py-4 text-base sm:text-lg rounded-2xl w-full resize-none overflow-y-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.1)] focus:shadow-[0_0_0_2px_rgba(0,0,0,0.2)] transition-shadow"
            rows={1}
            style={{
              height: 'auto',
              minHeight: '3.5rem'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = '0';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
          <Button
            variant="ghost"
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            className="absolute right-2 z-10 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            showControls ? "max-h-[500px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
          )}
        >
          <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-4 mt-4 bg-gray-100 p-4 rounded-lg w-full">
            <div className="w-full">
              <Select
                value={selectedStyle}
                onValueChange={setSelectedStyle}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent>
                  {style.map((styleItem) => (
                    <SelectItem key={styleItem} value={styleItem.toLowerCase()}>{styleItem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 bg-white rounded-md p-2 w-full">
              <Button
                variant={aspectRatio === 'wide' ? 'secondary' : 'ghost'}
                onClick={() => setAspectRatio('wide')}
                className={`flex-1 h-auto py-2 px-3 whitespace-normal text-sm ${aspectRatio === 'wide' ? 'text-blue-500 font-bold' : ''}`}
              >
                Wide
              </Button>
              <Button
                variant={aspectRatio === 'square' ? 'secondary' : 'ghost'}
                onClick={() => setAspectRatio('square')}
                className={`flex-1 h-auto py-2 px-3 whitespace-normal text-sm ${aspectRatio === 'square' ? 'text-blue-500 font-bold' : ''}`}
              >
                Square
              </Button>
              <Button
                variant={aspectRatio === 'portrait' ? 'secondary' : 'ghost'}
                onClick={() => setAspectRatio('portrait')}
                className={`flex-1 h-auto py-2 px-3 whitespace-normal text-sm ${aspectRatio === 'portrait' ? 'text-blue-500 font-bold' : ''}`}
              >
                Portrait
              </Button>
            </div>

            <div className="flex items-center gap-2 min-w-[150px] justify-center">
              <span className={`text-sm font-medium ${quality === 'standard' ? 'text-blue-500 font-bold' : ''}`}>Standard</span>
              <Switch
                checked={quality === 'hd'}
                onCheckedChange={(checked) => setQuality(checked ? 'hd' : 'standard')}
              />
              <span className={`text-sm font-medium ${quality === 'hd' ? 'text-blue-500 font-bold' : ''}`}>HD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
