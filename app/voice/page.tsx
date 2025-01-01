'use client'

import { useEffect } from 'react'
import AppsFooter from '@/components/apps-footer';
import TextToVoiceConverter from './components/text-to-voice-converter'
import { AppsHeader } from '@/components/apps-header'

export default function Voice() {
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
            className="flex min-h-[100dvh] flex-col"
        >
            <div className="flex-1 flex flex-col w-full min-w-0 overflow-x-hidden">
                <AppsHeader />
                <div className="flex-1 flex flex-col w-full min-w-0 overflow-x-hidden">
                    <main className="flex-grow flex items-center py-6 sm:py-8 px-3 sm:px-6 overflow-y-auto w-full min-w-0">
                        <TextToVoiceConverter />
                    </main>
                    <AppsFooter />
                </div>
            </div>
        </div>
    )
}