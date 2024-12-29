'use client'

import { useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { AnimatedBackground } from "../../components/animated-background"
import RenderFooter from '@/components/RenderFooter'
import TextToVoiceConverter from './components/text-to-voice-converter'

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
            className="flex min-h-screen"
            style={{
                height: 'calc(var(--vh, 1vh) * 100)',
                minHeight: '-webkit-fill-available'
            }}
        >
            <Sidebar />
            <div className="flex flex-col w-full relative">
                <AnimatedBackground />
                <main className="flex-grow py-12 mt-8 px-4 sm:px-6 overflow-y-auto">
                    <TextToVoiceConverter />
                </main>
                <footer className="w-full sticky bottom-0 z-10">
                    <RenderFooter />
                </footer>
            </div>
        </div>
    )
}