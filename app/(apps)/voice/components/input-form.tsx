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
import { voiceFree_CharactersLimit } from "@/config/freeLimits";
import { motion } from "framer-motion";

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
  'es-ES': 'Spanish',
  'fr-FR': 'French',
  'de-DE': 'German',
  'ru-RU': 'Russian',
  'ja-JP': 'Japanese',
  'mn-CN': 'Chinese',
  'ko-KR': 'Korean',
  // 'jv-ID': 'Javanese',
  'ar-AE': 'Arabic',
  'hi-IN': 'Hindi',
} as const;

// Corrected voice names without language code duplication
const VOICES = {
  'AvaMultilingualNeural': 'Ava (Female)',
  'AndrewMultilingualNeural': 'Andrew (Male)',
} as const;

type VoiceId = keyof typeof VOICES;

export function InputForm({
  text,
  language,
  voice,
  onTextChange,
  onLanguageChange,
  onVoiceChange,
  onSubmit,
}: InputFormProps) {
  const availableVoices = Object.keys(VOICES) as VoiceId[];
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { plan } = useSubscription();

  // Set default values on component mount
  useEffect(() => {
    if (!language) {
      onLanguageChange('en-US');
    }
    if (!voice) {
      onVoiceChange('en-US-AvaMultilingualNeural');
    }
  }, []);

  // Debounced text change handler
  const debouncedTextChange = useCallback(
    debounce((value: string) => {
      onTextChange(value);
    }, 300),
    [onTextChange]
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (plan === 'free' && value.length > voiceFree_CharactersLimit) {
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
  };

  const handleVoiceChange = (selectedVoice: VoiceId) => {
    const fullVoiceId = `${language}-${selectedVoice}`;
    onVoiceChange(fullVoiceId);
  };

  // Extract base voice ID from full voice ID for display
  const displayVoice = voice ? voice.split('-').slice(-1)[0] as VoiceId : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Text to Natural Voice
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Textarea
          value={text}
          onChange={(e) => handleTextChange(e)}
          placeholder="Enter your text here..."
          className="min-h-[200px] resize-none"
        />
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-full rounded-full">
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
          value={displayVoice}
          onValueChange={handleVoiceChange}
        >
          <SelectTrigger className="w-full rounded-full">
            <SelectValue placeholder="Voice" />
          </SelectTrigger>
          <SelectContent>
            {availableVoices.map((voiceId) => (
              <SelectItem key={voiceId} value={voiceId}>
                {VOICES[voiceId]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={onSubmit}
          disabled={!text.trim() || !language || !voice}
          className="w-full rounded-full"
        >
          Create Voice
        </Button>
      </motion.div>

      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
            <AlertDialogDescription>
              Free users are limited to {voiceFree_CharactersLimit} characters per message. Upgrade to Pro to convert longer texts.
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
    </motion.div>
  );
}
