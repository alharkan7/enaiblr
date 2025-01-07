'use client'

import { useState, useEffect } from 'react'
import AppsFooter from '@/components/apps-footer';
import { UploadForm } from './components/UploadForm';
import { TranscriptionResult } from './components/TranscriptionResult';
import { AppsHeader } from '@/components/apps-header'
import type { TranscriptionResult as TranscriptionResultType } from './types';
import { RefreshIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ProGate } from '@/components/pro-gate';

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
        <ProGate>
            <div
                className="flex min-h-screen"
                style={{
                    height: 'calc(var(--vh, 1vh) * 100)',
                    minHeight: '-webkit-fill-available'
                }}
            >
                <div className="flex flex-col w-full relative overflow-hidden">
                    <AppsHeader
                        title={transcriptionResult ? "Transcription Result" : ""}
                        leftButton={transcriptionResult ? (
                            <Button
                                onClick={() => window.location.reload()}
                                className="text-foreground/60 hover:text-primary transition-colors"
                                title="New Transcription"
                                variant="outline"
                            >
                                <RefreshIcon size={20} />
                            </Button>
                        ) : undefined}
                    />
                    <main className={`grow px-4 md:px-4 overflow-y-auto ${transcriptionResult ? 'pt-8 pb-12' : 'flex items-center justify-center pb-24'}`}>
                        <div className="w-full max-w-4xl mx-auto">
                            {transcriptionResult ? (
                                <TranscriptionResult
                                    result={transcriptionResult}
                                />
                            ) : (
                                <>
                                    <UploadForm onTranscriptionComplete={setTranscriptionResult} />
                                    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
                                        <AppsFooter />
                                    </div>
                                </>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </ProGate>
    )
}