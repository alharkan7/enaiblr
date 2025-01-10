'use client';

import { motion } from 'framer-motion';
import { InfinityIcon } from 'lucide-react';
import { CheckCircleFillIcon } from './icons';
import type { Model } from '@/lib/ai/models';

interface OverviewProps {
  selectedModel: Model;
}

export function Overview({ selectedModel }: OverviewProps) {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <InfinityIcon className='size-20'/>
        </p>
        <div className="space-y-4">
          {selectedModel?.overview.map((capability: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircleFillIcon size={16} />
              <span>{capability}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
