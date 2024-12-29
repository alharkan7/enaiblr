"use client";

import { useState, useCallback } from "react";
import { LoadingState } from "./loading-state";
import { ResultView } from "./result-view";
import { InputForm } from "./input-form";

export default function TextToVoiceConverter() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [language, setLanguage] = useState("");
  const [voice, setVoice] = useState("");
  const [audioData, setAudioData] = useState<{
    url: string;
    duration: number;
    size: number;
  } | null>(null);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const synthesizeSpeech = async () => {
    const response = await fetch('/api/voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice,
      }),
    });

    if (!response.ok) {
      throw new Error('Speech synthesis failed');
    }

    return response.arrayBuffer();
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const audioBuffer = await synthesizeSpeech();

      // Create blob and URL
      const blob = new Blob([audioBuffer], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);

      // Calculate size in MB
      const size = blob.size / (1024 * 1024);

      // Set audio data (duration would need to be calculated from the actual audio)
      setAudioData({
        url,
        duration: 0, // This would need to be calculated from the actual audio
        size,
      });

      setIsComplete(true);
    } catch (error) {
      console.error("Error synthesizing speech:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isComplete && audioData) {
    return (
      <ResultView
        text={text}
        audioUrl={audioData.url}
        size={audioData.size}
        onReset={() => {
          setIsComplete(false);
          setAudioData(null);
          setText("");
          setLanguage("");
          setVoice("");
        }}
      />
    );
  }

  return (
    <InputForm
      text={text}
      language={language}
      voice={voice}
      onTextChange={handleTextChange}
      onLanguageChange={setLanguage}
      onVoiceChange={setVoice}
      onSubmit={handleSubmit}
    />
  );
}