'use client'

import { motion } from 'framer-motion'

export function TypingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="bg-accent text-accent-foreground rounded-2xl px-4 py-2 rounded-bl-none">
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-current rounded-full"
                            initial={{ y: 0 }}
                            animate={{ y: [-3, 0, -3] }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
