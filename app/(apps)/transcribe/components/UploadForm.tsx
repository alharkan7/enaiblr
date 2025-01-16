import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, AlertCircle, X } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { Progress } from './ui/Progress';
import { Groq } from 'groq-sdk';
import type { TranscriptionResult, TranscriptionSegment, GroqTranscription, GroqTranscriptionSegment } from '../types';
import { RefreshIcon } from '@/components/icons';
import { useSubscription } from '@/contexts/subscription-context';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { transcribeFree_AudioSizeLimit } from '@/config/freeLimits';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadFormProps {
  onTranscriptionComplete: (result: TranscriptionResult) => void;
}

export function UploadForm({ onTranscriptionComplete }: UploadFormProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { plan } = useSubscription();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    setErrorDetails(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.file.size > (plan === 'free' ? transcribeFree_AudioSizeLimit * 1024 * 1024 : 40 * 1024 * 1024)) {
        if (plan === 'free') {
          setShowUpgradeDialog(true);
        } else {
          setError('File size exceeds 40MB limit');
        }
        return;
      }
      setError('Invalid file format');
      setErrorDetails('Allowed formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm');
      return;
    }

    if (acceptedFiles[0].size > (plan === 'free' ? transcribeFree_AudioSizeLimit * 1024 * 1024 : 40 * 1024 * 1024)) {
      if (plan === 'free') {
        setShowUpgradeDialog(true);
      } else {
        setError('File size exceeds 40MB limit');
      }
      return;
    }

    setFile(acceptedFiles[0]);
  }, [plan]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.flac', '.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.ogg', '.wav', '.webm']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setProcessingProgress(0);

    try {
      // Get Groq API key
      const tokenResponse = await fetch('/api/transcribe/groq-token', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(`Failed to get API token: ${errorData.error || tokenResponse.statusText}`);
      }

      const tokenData = await tokenResponse.json();
      
      if (!tokenData.apiKey) {
        throw new Error('No API key received from server');
      }

      // Initialize Groq client
      const groq = new Groq({
        apiKey: tokenData.apiKey,
        dangerouslyAllowBrowser: true
      });

      // Create a new File object with the required properties
      const audioFile = new File(
        [file], 
        file.name, 
        { 
          type: file.type,
          lastModified: file.lastModified 
        }
      );

      // Simulate upload progress
      let uploadProgress = 0;
      const uploadInterval = setInterval(() => {
        uploadProgress += 10;
        setUploadProgress(Math.min(uploadProgress, 95));
        if (uploadProgress >= 95) clearInterval(uploadInterval);
      }, 200);

      // Create transcription directly using Groq
      const transcription = await groq.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-large-v3",
        temperature: 0.2,
        language: selectedLanguage,
        response_format: "verbose_json",
      }) as GroqTranscription;

      // Clear upload interval and set to 100%
      clearInterval(uploadInterval);
      setUploadProgress(100);

      // Start processing progress simulation
      let progress = 0;
      const processingInterval = setInterval(() => {
        progress += 5;
        setProcessingProgress(Math.min(progress, 95));
        if (progress >= 95) clearInterval(processingInterval);
      }, 500);

      // Transform Groq response to match TranscriptionResult type
      const processedResult: TranscriptionResult = {
        fileName: file.name,
        audioDuration: formatDuration(transcription.duration),
        textLength: transcription.text.length,
        transcriptionDate: new Date(),
        segments: transcription.segments.map((segment: GroqTranscriptionSegment): TranscriptionSegment => ({
          startTime: segment.start,
          endTime: segment.end,
          text: segment.text.trim(),
          id: segment.id,
          seek: segment.seek,
          tokens: segment.tokens,
          temperature: segment.temperature,
          avg_logprob: segment.avg_logprob,
          compression_ratio: segment.compression_ratio,
          no_speech_prob: segment.no_speech_prob
        }))
      };

      // Clear interval and set final progress
      clearInterval(processingInterval);
      setProcessingProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        onTranscriptionComplete(processedResult);
      }, 500);

    } catch (error: any) {
      console.error('Transcription error:', error);
      setError(error.message || 'Transcription failed. Please try again.');
      setErrorDetails(error.stack);
      setIsUploading(false);
      setUploadProgress(0);
      setProcessingProgress(0);
    }
  };

  // Calculate the progress to show
  const displayProgress = processingProgress > 0 ? processingProgress : uploadProgress;

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const clearError = () => {
    setError(null);
    setErrorDetails(null);
    setFile(null);
  };

  const clearAllStates = () => {
    setError(null);
    setErrorDetails(null);
    setFile(null);
    setUploadProgress(0);
    setProcessingProgress(0);
    setIsUploading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl mx-auto text-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Audio Transcriber
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div
          {...getRootProps()}
          className={`
            relative p-8 border-2 border-dashed rounded-xl transition-all duration-200
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/50'}
            ${error ? 'border-destructive/50 bg-destructive/5' : ''}
          `}
        >
          <input {...getInputProps()} />
          <motion.div
            initial={false}
            animate={{ 
              opacity: isDragActive ? 0.8 : 1
            }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {!file && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Drop your audio file here or browse</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports MP3, WAV, M4A, FLAC 
                    {/*(max {plan === 'free' ? `${transcribeFree_AudioSizeLimit}MB` : '40MB'}) */}
                  </p>
                </div>
              </motion.div>
            )}

            {file && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center gap-3"
              >
                <FileAudio className="w-6 h-6 text-primary" />
                <span className="font-medium">{file.name}</span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="p-1 hover:bg-destructive/10 rounded-full"
                >
                  <X className="w-4 h-4 text-destructive" />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-destructive mt-3"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LanguageSelector
          value={selectedLanguage}
          onChange={setSelectedLanguage}
          disabled={isUploading || !file}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!file || isUploading}
          onClick={handleSubmit}
          className={`
            mt-6 px-8 py-3 rounded-lg font-medium transition-all
            ${!file || isUploading 
              ? 'bg-primary/50 text-primary-foreground cursor-not-allowed' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }
          `}
        >
          {isUploading ? (
            <div className="flex items-center gap-2">
              <RefreshIcon size={14} />
              Processing...
            </div>
          ) : (
            'Start Transcription'
          )}
        </motion.button>
      </motion.div>

      {isUploading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-8 space-y-4"
        >
          <AnimatePresence mode="wait">
            {uploadProgress < 100 ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span>Uploading</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </motion.div>
            ) : (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span>Processing</span>
                  <span>{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
            <AlertDialogDescription>
              Free users are limited to {transcribeFree_AudioSizeLimit}MB audio files. Upgrade to Pro to transcribe audio files in larger sizes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>Cancel</Button>
            <Button onClick={() => window.location.href = '/payment'}>Upgrade Now</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}