"use client";

import { useState, useCallback, useEffect } from "react";
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
    size: number;
    blob: Blob;
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
      throw new Error(`Speech synthesis failed: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    
    // Verify WAV header
    const dataView = new DataView(buffer);
    const header = {
      riff: String.fromCharCode(dataView.getUint8(0), dataView.getUint8(1), dataView.getUint8(2), dataView.getUint8(3)),
      format: String.fromCharCode(dataView.getUint8(8), dataView.getUint8(9), dataView.getUint8(10), dataView.getUint8(11)),
    };
    
    console.log('WAV header:', header);
    
    if (header.riff !== 'RIFF' || header.format !== 'WAVE') {
      throw new Error('Invalid WAV format');
    }

    return buffer;
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const audioBuffer = await synthesizeSpeech();
      
      // Create blob for size calculation
      const blob = new Blob([audioBuffer], { type: "audio/wav" });
      const size = blob.size / (1024 * 1024);

      // Store audio data in server
      const response = await fetch('/api/voice/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioData: Array.from(new Uint8Array(audioBuffer))
        }),
      });

      const { id } = await response.json();
      const streamUrl = `/api/voice/stream?id=${id}`;

      setAudioData({
        url: streamUrl,
        size,
        blob, // Keep blob for download functionality
      });

      setIsComplete(true);
    } catch (error) {
      console.error("Error synthesizing speech:", error);
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
        blob={audioData.blob}
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