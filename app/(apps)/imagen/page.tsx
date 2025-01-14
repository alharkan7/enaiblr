'use client'

import { ImageForm } from "./components/image-form"
import { EXAMPLE_PROMPTS } from "./components/constants"
import AppsFooter from '@/components/apps-footer';
import { useState } from 'react'
import { Download } from 'lucide-react';
import { ImageModal } from "./components/image-modal"
import { AppsHeader } from '@/components/apps-header'
import { motion } from "framer-motion"

export default function Home() {
  const [defaultPrompt, setDefaultPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<'wide' | 'square' | 'portrait'>('square')
  const [imageAspectRatio, setImageAspectRatio] = useState<'wide' | 'square' | 'portrait'>('square')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleGenerateStart = () => {
    setIsGenerating(true)
    setGeneratedImage(null)
    setHasInteracted(true)
  }

  const handleGenerate = (prompt: string, imageData?: string) => {
    setIsGenerating(false)
    if (imageData) {
      setGeneratedImage(`data:image/png;base64,${imageData}`)
      setImageAspectRatio(selectedAspectRatio) // Set the image aspect ratio when new image is generated
    }
  }

  const getAspectRatioClass = (aspectRatio: 'wide' | 'square' | 'portrait') => {
    switch (aspectRatio) {
      case 'wide': return 'aspect-video'
      case 'portrait': return 'aspect-[9/16]'
      default: return 'aspect-square'
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-dvh imagen-layout pt-0"> 
        <AppsHeader 
          title={(isGenerating || generatedImage) ? (
            <>
              Image Creator AI
            </>
          ) : undefined} 
        />
        <div className={`grow flex flex-col items-center justify-center w-full px-4 overflow-y-auto ${hasInteracted ? 'pt-4' : ''}`}>
          {isGenerating ? (
            <div className="relative w-full max-w-screen-sm flex items-center justify-center h-[50vh] mx-auto mb-8">
              <div className={getAspectRatioClass(imageAspectRatio)} style={{ maxWidth: '100%', maxHeight: '100%' }}>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 size-full object-contain rounded-lg flex flex-col items-center justify-center bg-background/40 backdrop-blur"
                >
                  <div className="relative size-12 mb-4">
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-foreground/20"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      className="absolute inset-0 rounded-full border-t-2 border-foreground"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground font-medium"
                  >
                    Creating Visual
                  </motion.p>
                </motion.div>
              </div>
            </div>
          ) : !generatedImage ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-8 mt-8 sm:mt-0"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative"
              >
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 leading-relaxed pb-2">
                  Image Creator
                </h1>
                <motion.div 
                  className="absolute -z-10 inset-0 blur-3xl opacity-20 bg-gradient-to-r from-blue-600 to-pink-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  transition={{ delay: 0.4 }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <div className="relative w-full max-w-screen-sm flex items-center justify-center h-[50vh] mx-auto mb-8">
              <div className={`relative ${getAspectRatioClass(imageAspectRatio)}`} style={{ maxWidth: '100%', maxHeight: '100%' }}>
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={generatedImage}
                  alt="Generated image"
                  className="size-full object-contain rounded-lg cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                />
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = 'generated-image.png';
                    link.click();
                  }}
                  className="absolute bottom-2 right-2 p-2 bg-background/40 backdrop-blur-sm hover:bg-background/60 rounded-full transition-colors"
                >
                  <Download className="size-5 text-foreground" />
                </button>
              </div>
            </div>
          )}

          <div className="w-full max-w-3xl space-y-8">
            <ImageForm
              defaultPrompt={defaultPrompt}
              onGenerateStart={handleGenerateStart}
              onGenerate={handleGenerate}
              onAspectRatioChange={setSelectedAspectRatio}
              imageDisplayed={!!generatedImage}
            />

            {!generatedImage && !hasInteracted && (
              <div className="flex flex-wrap justify-center gap-2">
                {EXAMPLE_PROMPTS.map((examplePrompt, index) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    key={examplePrompt}
                    onClick={() => {
                      setDefaultPrompt(examplePrompt);
                      handleGenerateStart();
                      const dimensions = { width: 768, height: 768 }; // default to standard square
                      fetch('/api/generate', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          prompt: examplePrompt,
                          ...dimensions
                        }),
                      })
                        .then(response => {
                          if (!response.ok) throw new Error('Failed to generate image');
                          return response.json();
                        })
                        .then(data => handleGenerate(examplePrompt, data.imageData))
                        .catch(error => {
                          console.error('Error generating image:', error);
                          handleGenerate(examplePrompt);
                        });
                    }}
                    className="px-4 py-2 text-sm bg-background/80 hover:bg-background/90 backdrop-blur-sm rounded-full border border-input transition-all shadow-sm hover:shadow-md"
                  >
                    <span className="text-xs text-foreground/80">{examplePrompt} →</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8">
          <AppsFooter />
        </div>
      </div>
      {generatedImage && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={generatedImage}
        />
      )}
    </>
  )
}