import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { NextResponse } from "next/server";
import { getBucket } from '@/lib/gcs';
import { db } from '@/lib/db';
import { appVoice } from '@/lib/db/schema';
import { auth } from '@/app/(auth)/auth';

// Configure route segment for Vercel deployment
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const { text, voice } = await request.json();

    // Initialize speech config with credentials from environment variables
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY!,
      process.env.AZURE_SPEECH_REGION!
    );

    // Set the voice
    speechConfig.speechSynthesisVoiceName = voice;

    // Set output format to WAV
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;

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

    // Log audio data size for debugging
    // console.log('Audio data size:', audioData.byteLength);

    // Upload to GCS
    try {
      const bucket = getBucket();
      const fileName = `voice-${Date.now()}.wav`;
      const filepath = `enaiblr/voice/${fileName}`;
      await bucket.file(filepath).save(Buffer.from(audioData), {
        contentType: 'audio/wav',
      });
      
      if (userId) {
        try {
          await db.insert(appVoice).values({
            userId,
            inputText: text,
            voiceId: voice,
            gcsFilename: fileName,
            gcsPath: filepath,
          });
        } catch (dbError) {
          console.error("DB Insert Error (Voice):", dbError);
        }
      }
    } catch (gcsError) {
      console.error('Failed to upload to GCS:', gcsError);
    }

    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': audioData.byteLength.toString(),
        'Accept-Ranges': 'bytes'
      },
    });

  } catch (error) {
    console.error('Error in speech synthesis:', error);
    return NextResponse.json({ error: 'Speech synthesis failed' }, { status: 500 });
  }
}