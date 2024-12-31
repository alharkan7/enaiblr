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
            className="flex min-h-screen w-full overflow-x-hidden"
            style={{
                height: 'calc(var(--vh, 1vh) * 100)',
            }}
        >
            <div className="flex-1 flex flex-col w-full">
                <AppsHeader />
                <div className="flex-1 flex flex-col w-full">
                    <main className="flex-grow py-12 mt-8 px-4 sm:px-6 overflow-y-auto w-full">
                        <TextToVoiceConverter />
                    </main>
                    <footer className="w-full sticky bottom-0 z-10">
                        <AppsFooter />
                    </footer>
                </div>
            </div>
        </div>
    )
}