'use client'

import { useState, useEffect } from 'react'
import AppsFooter from '@/components/apps-footer';
import { UploadForm } from './components/UploadForm';
import { TranscriptionResult } from './components/TranscriptionResult';
import { AppsHeader } from '@/components/apps-header'
import { RefreshCw } from 'react-feather';
import type { TranscriptionResult as TranscriptionResultType } from './types';

export default function Transcriber() {
    const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResultType | null>(null);

    useEffect(() => {
        const adjustViewportHeight = () => {
            const visualViewport = window.visualViewport;
            const height = visualViewport ? visualViewport.height : window.innerHeight;
            document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
        };

        adjustViewportHeight();
        window.visualViewport?.addEventListener('resize', adjustViewportHeight);
        window.addEventListener('resize', adjustViewportHeight);

        return () => {
            window.visualViewport?.removeEventListener('resize', adjustViewportHeight);
            window.removeEventListener('resize', adjustViewportHeight);
        };
    }, []);

    return (
        <div
            className="flex min-h-screen"
            style={{
                height: 'calc(var(--vh, 1vh) * 100)',
                minHeight: '-webkit-fill-available'
            }}
        >
            <div className="flex flex-col w-full relative">
                <AppsHeader
                    title={transcriptionResult ? "Transcription Result" : ""}
                    leftButton={transcriptionResult ? (
                        <button
                            onClick={() => window.location.reload()}
                            className="text-foreground/60 hover:text-primary transition-colors"
                            title="New Transcription"
                        >
                            <RefreshCw size={20} />
                        </button>
                    ) : undefined}
                />
                <main className={`flex-grow px-4 md:px-4 ${transcriptionResult ? 'pt-8 pb-12' : 'flex items-center justify-center py-12'}`}>
                    <div className="w-full max-w-4xl mx-auto">
                        {transcriptionResult ? (
                            <TranscriptionResult
                                result={transcriptionResult}
                            />
                        ) : (
                            <UploadForm onTranscriptionComplete={setTranscriptionResult} />
                        )}
                    </div>
                </main>
                <AppsFooter />
            </div>
        </div>
    )
}