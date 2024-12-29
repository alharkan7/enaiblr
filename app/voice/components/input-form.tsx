"use client";

import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import debounce from "lodash/debounce";

interface InputFormProps {
  text: string;
  language: string;
  voice: string;
  onTextChange: (text: string) => void;
  onLanguageChange: (language: string) => void;
  onVoiceChange: (voice: string) => void;
  onSubmit: () => void;
}

const LANGUAGES = {
  'id-ID': 'Bahasa Indonesia',
  'en-US': 'English',
} as const;

type VoicesType = {
  [K in 'id-ID' | 'en-US']: {
    [key: string]: string;
  };
};

// Corrected voice names without language code duplication
const VOICES: VoicesType = {
  'id-ID': {
    'id-ID-GadisNeural': 'Gadis (Perempuan)',
    'id-ID-ArdiNeural': 'Ardi (Laki-laki)',
  },
  'en-US': {
    'en-US-AvaMultilingualNeural': 'Ava (Female)',
    'en-US-AndrewMultilingualNeural': 'Andrew (Male)',
  },
};

export function InputForm({
  text,
  language,
  voice,
  onTextChange,
  onLanguageChange,
  onVoiceChange,
  onSubmit,
}: InputFormProps) {
  const availableVoices = language ? VOICES[language as keyof typeof VOICES] : {};

  // Debounced text change handler
  const debouncedTextChange = useCallback(
    debounce((value: string) => {
      onTextChange(value);
    }, 300),
    [onTextChange]
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Immediately update parent's state
    onTextChange(value);
    // Debounce other operations
    debouncedTextChange(value);
  };

  // Add useEffect here, after hooks and before return
  useEffect(() => {
    return () => {
      debouncedTextChange.cancel();
    };
  }, [debouncedTextChange]);

  // Reset voice when language changes
  const handleLanguageChange = (newLanguage: string) => {
    onLanguageChange(newLanguage);
    onVoiceChange(''); // Reset voice selection when language changes
  };

  return (
    <div className="w-full px-4 md:px-12 lg:px-36 xl:px-48 space-y-4">
       <h1 className="text-3xl font-bold text-center mb-8">
        Text to <span className="text-blue-600">Voice</span>
      </h1>
      <Textarea
        placeholder="Enter your text here..."
        className="min-h-[200px] text-lg rounded-2xl"
        value={text}
        onChange={handleTextChange}
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-full sm:w-[200px] rounded-full">
            <SelectValue placeholder="Pilih Bahasa" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LANGUAGES).map(([code, label]) => (
              <SelectItem key={code} value={code}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={voice}
          onValueChange={onVoiceChange}
          disabled={!language}
        >
          <SelectTrigger className="w-full sm:w-[200px] rounded-full">
            <SelectValue placeholder="Pilih Suara" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(availableVoices).map(([voiceId, label]: [string, string]) => (
              <SelectItem key={voiceId} value={voiceId}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="w-full sm:w-[200px] rounded-full"
          onClick={onSubmit}
          disabled={!text.trim() || !language || !voice}
        >
          Convert to Audio
        </Button>
      </div>
    </div>
  );
}
