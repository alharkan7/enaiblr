'use client';

import { motion } from 'framer-motion';
import { InfinityIcon } from 'lucide-react';
import { CheckCircleFillIcon } from './icons';
import type { Model } from '@/lib/ai/models';

interface OverviewProps {
  selectedModel: Model;
}

export function Overview({ selectedModel }: OverviewProps) {
  if (!selectedModel) return null;

  return (
    <motion.div
      key="overview"
      className="flex-1 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      {/* <div className="flex-1 flex items-center justify-center"> */}
        <div className="rounded-xl p-2 flex flex-col gap-0 leading-relaxed text-center max-w-xl">
          <p className="flex flex-row justify-center gap-2 items-center">
            <InfinityIcon className="size-16 mb-4" />
          </p>
          <div className="space-y-2">
            {selectedModel.overview.map((capability: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 text-muted-foreground">
                <CheckCircleFillIcon size={16} />
                <span>{capability}</span>
              </div>
            ))}
          </div>
        </div>
      {/* </div> */}
    </motion.div>
  );
}
