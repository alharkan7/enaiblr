import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, Check, AlertCircle, X } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { Progress } from './ui/Progress';
import { Groq } from 'groq-sdk';
import type { TranscriptionApiResponse, TranscriptionResult, TranscriptionSegment } from '../types';

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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', selectedLanguage);

      // Create XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      const promise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error occurred'));
        });

        xhr.open('POST', '/api/transcribe');
        xhr.send(formData);
      });

      // Simulate processing progress
      const startProcessing = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setProcessingProgress(Math.min(progress, 95)); // Cap at 95% until complete

          if (progress >= 95) {
            clearInterval(interval);
          }
        }, 500);

        return interval;
      };

      const processingInterval = startProcessing();

      const result = (await promise) as TranscriptionApiResponse;

      const processedResult: TranscriptionResult = {
        fileName: file.name,
        audioDuration: formatDuration(result.duration),
        textLength: result.text.length,
        transcriptionDate: new Date(),
        segments: result.segments.map((segment): TranscriptionSegment => ({
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

      // Clear the processing interval and set final progress
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
    <div className="w-11/12 md:w-4/5 lg:w-1/2 mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Audio <span className="text-blue-600">Transcriber</span>
      </h1>
      {/* <p className="text-gray-600 text-sm mb-2 text-center">
        Upload your audio file and we'll convert it to text using advanced speech recognition
      </p> */}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-6">
          <LanguageSelector
            value={selectedLanguage}
            onChange={setSelectedLanguage}
          />
        </div>

        <div className="relative">
          {error && (
            <button
              type="button"
              onClick={clearAllStates}
              className="absolute -top-2 -right-2 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}

          <div className="relative">  {/* Wrapper for dropzone */}
            {file && (
              <button
                type="button"
                onClick={clearAllStates}
                className="absolute -top-2 -right-2 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                ${error ? 'border-red-500 bg-red-50' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                {error ? (
                  <>
                    <AlertCircle className="h-12 w-12 text-red-500" />
                    <div className="space-y-1">
                      <p className="text-red-600 font-medium">{error}</p>
                      {errorDetails && (
                        <p className="text-sm text-red-500">
                          {errorDetails}
                        </p>
                      )}
                    </div>
                  </>
                ) : file ? (
                  <>
                    <Check className="h-12 w-12 text-green-500" />
                    <span className="text-green-600 font-medium">{file.name}</span>
                  </>
                ) : (
                  <>
                    <FileAudio className="h-12 w-12 text-gray-400" />
                    <div className="space-y-1">
                      <p className="text-gray-700 font-medium">
                        Drop your audio file here
                      </p>
                      <p className="text-sm text-gray-500">
                        or click to select a file.
                      </p>
                      {/* <p className="text-xs text-gray-500">
                    Max size: 40MB. Formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm
                  </p> */}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={displayProgress} />
            <p className="text-sm text-center text-gray-600">
              {processingProgress > 0
                ? `Processing transcription... ${displayProgress}%`
                : `Uploading... ${displayProgress}%`}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || isUploading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white
            ${!file || isUploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <Upload className="-ml-1 mr-2 h-5 w-5" />
              Processing...
            </span>
          ) : (
            'Start Transcription'
          )}
        </button>
      </form>
    </div>
  );
}