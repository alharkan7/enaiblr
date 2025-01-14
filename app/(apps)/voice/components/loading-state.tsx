"use client";

import { motion } from "framer-motion";

export function LoadingState() {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-8 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="w-16 h-16 relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <motion.span 
          className="absolute w-full h-full border-4 border-primary rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span 
          className="absolute w-full h-full border-4 border-primary rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        />
      </motion.div>
      
      <motion.p 
        className="text-lg font-medium text-center text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Creating Your Natural AI Voice...
      </motion.p>
    </motion.div>
  );
}