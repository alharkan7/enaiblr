import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, voice } = await request.json();

    // Initialize speech config with credentials from environment variables
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY!,
      process.env.AZURE_SPEECH_REGION!
    );

    // Set the voice
    speechConfig.speechSynthesisVoiceName = voice;

    // Create the synthesizer
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    const audioData = await new Promise<ArrayBuffer>((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            const audioData = result.audioData;
            synthesizer.close();
            resolve(audioData);
          } else {
            synthesizer.close();
            reject(new Error(`Speech synthesis canceled: ${result.errorDetails}`));
          }
        },
        (error) => {
          synthesizer.close();
          reject(error);
        }
      );
    });

    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/wav',
      },
    });

  } catch (error) {
    console.error('Error in speech synthesis:', error);
    return NextResponse.json({ error: 'Speech synthesis failed' }, { status: 500 });
  }
}