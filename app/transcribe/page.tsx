'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { AnimatedBackground } from "../../components/animated-background"
import RenderFooter from '@/components/RenderFooter'
import { UploadForm } from './components/UploadForm';
import { TranscriptionResult } from './components/TranscriptionResult';
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
            <Sidebar />
            <div className="flex flex-col w-full relative">
                <AnimatedBackground />
                <main className={`flex-grow ${transcriptionResult ? 'pt-28 pb-12' : 'flex items-center justify-center py-12'}`}>
                    {transcriptionResult ? (
                        <TranscriptionResult result={transcriptionResult} />
                    ) : (
                        <UploadForm onTranscriptionComplete={setTranscriptionResult} />
                    )}
                </main>
                <footer className="w-full sticky bottom-0 z-10">
                    <RenderFooter />
                </footer>
            </div>
        </div>
    )
}