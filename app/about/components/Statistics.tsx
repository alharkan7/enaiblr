"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface StatData {
  messages: number;
  chats: number;
  documents: number;
  files: number;
}

const formatNumber = (num: number | undefined) => {
  if (num === undefined) return '0';
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(0)}M+`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K+`;
  }
  return num.toString();
};

const Statistics = () => {
  const stats: StatData = {
    chats: 9300,
    messages: 43900,
    documents: 15900,
    files: 4200 
  };

  return (
    <section id="stats" className="max-w-6xl mx-auto w-full py-12 md:py-20 lg:py-20">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container px-4 md:px-6 mx-auto"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div variants={item} className="space-y-2 mb-8">
            <h2 className="text-3xl font-bold !text-black tracking-tighter sm:text-3xl md:text-4xl">
              Asisten {' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Kreatif dan Produktif
              </span>
            </h2>
          </motion.div>
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-4xl md:text-5xl font-bold !text-black">
                {formatNumber(stats.chats)}
              </span>
              <span className="text-sm text-black/90">Chats<br></br>Dibuat</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-4xl md:text-5xl font-bold !text-black">
                {formatNumber(stats.messages)}
              </span>
              <span className="text-sm text-black/90">Pesan<br></br>Terjawab</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-4xl md:text-5xl font-bold !text-black">
                {formatNumber(stats.documents)}
              </span>
              <span className="text-sm text-black/90">Dikumen<br></br>Dianalisis</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-4xl md:text-5xl font-bold !text-black">
                {formatNumber(stats.files)}
              </span>
              <span className="text-sm text-black/90">File<br></br>Diproses</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Statistics;
