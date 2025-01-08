"use client";

import { useCallback, useEffect, useState } from "react";
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
import { useSubscription } from '@/contexts/subscription-context'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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

const CHARACTER_LIMIT = 200;

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
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { plan } = useSubscription();

  // Debounced text change handler
  const debouncedTextChange = useCallback(
    debounce((value: string) => {
      onTextChange(value);
    }, 300),
    [onTextChange]
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (plan === 'free' && value.length > CHARACTER_LIMIT) {
      setShowUpgradeDialog(true);
      return;
    }
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
       <h1 className="text-4xl font-extrabold text-center mb-8">
        Text to Natural Voice
      </h1>
      <Textarea
        placeholder="Enter your text here..."
        className="min-h-[200px] text-lg rounded-2xl w-full max-w-3xl mx-auto"
        value={text}
        onChange={handleTextChange}
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-full sm:w-[200px] rounded-full">
            <SelectValue placeholder="Language" />
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
            <SelectValue placeholder="Voice" />
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

      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
            <AlertDialogDescription>
              Free users are limited to {CHARACTER_LIMIT} characters per message. Upgrade to Pro to convert longer texts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => window.location.href = '/pricing'}>
              Upgrade to Pro
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
