import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, Check, AlertCircle, X } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { Progress } from './ui/Progress';
import { Groq } from 'groq-sdk';
import type { TranscriptionResult, TranscriptionSegment, GroqTranscription, GroqTranscriptionSegment } from '../types';
import { RefreshIcon } from '@/components/icons';

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

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    setErrorDetails(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.file.size > 40 * 1024 * 1024) {
        setError('File size exceeds 40MB limit');
        return;
      }
      setError('Invalid file format');
      setErrorDetails('Allowed formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm');
      return;
    }

    if (acceptedFiles[0].size > 40 * 1024 * 1024) {
      setError('File size exceeds 40MB limit');
      return;
    }

    setFile(acceptedFiles[0]);
  }, []);

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
      const tokenResponse = await fetch('/api/groq-token', {
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

      // Start processing progress simulation
      let progress = 0;
      const processingInterval = setInterval(() => {
        progress += 5;
        setProcessingProgress(Math.min(progress, 95));
        if (progress >= 95) clearInterval(processingInterval);
      }, 500);

      // Create transcription directly using Groq
      const transcription = await groq.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-large-v3",
        temperature: 0.2,
        language: selectedLanguage,
        response_format: "verbose_json",
      }) as GroqTranscription;

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
    <div className="w-full">
      <h1 className="text-4xl font-extrabold text-center mb-8">
        Audio Transcriber
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto">
        <div className="mb-6 w-full">
          <LanguageSelector
            value={selectedLanguage}
            onChange={setSelectedLanguage}
          />
        </div>

        <div className="relative w-full">
          {error && (
            <button
              type="button"
              onClick={clearAllStates}
              className="absolute -top-2 -right-2 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <X className="size-5 text-gray-500" />
            </button>
          )}

          {!file && (
            <div
              {...getRootProps()}
              className={`relative p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }
                ${error ? 'border-destructive' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              <div className="space-y-4">
                <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="size-6 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-base font-medium text-foreground">
                    {isDragActive ? 'Drop your audio file here' : 'Upload your audio file'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm (max 40MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {file && !error && (
            <div className="w-full mt-4 p-4 rounded-lg bg-accent/50 flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FileAudio className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="size-8 rounded-full hover:bg-accent flex items-center justify-center shrink-0"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
          )}

          {error && (
            <div className="w-full mt-4 p-4 rounded-lg bg-destructive/10 flex items-center gap-3">
              <div className="size-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertCircle className="size-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">{error}</p>
                {errorDetails && <p className="text-xs text-destructive/80 mt-1">{errorDetails}</p>}
              </div>
            </div>
          )}
        </div>

        {isUploading && (
          <div className="space-y-2 w-full">
            <Progress value={displayProgress} />
            <p className="text-sm text-center text-muted-foreground">
              {processingProgress > 0
                ? `Processing transcription... ${displayProgress}%`
                : `Uploading... ${displayProgress}%`}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || isUploading}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors
            ${!file || isUploading
              ? 'bg-primary/50 text-primary-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
        >
          {isUploading ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshIcon size={14} />
              <span>Processing...</span>
            </div>
          ) : (
            'Start Transcription'
          )}
        </button>
      </form>
    </div>
  );
}