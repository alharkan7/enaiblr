import React, { useState } from 'react';
import { Download, Clock, FileText, LetterText } from 'lucide-react';
import { Tabs } from './ui/Tabs';
import type { TranscriptionResult } from '../types';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { motion } from 'framer-motion';

interface TranscriptionResultProps {
  result: TranscriptionResult;
}

export function TranscriptionResult({ result }: TranscriptionResultProps) {
  const [activeTab, setActiveTab] = useState('timestamps');

  const durationToSeconds = (duration: string): number => {
    const parts = duration.split(':');
    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return parseInt(minutes) * 60 + parseInt(seconds);
    }
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    }
    return 0;
  };

  const handleDownload = async () => {
    // Define default paragraph style
    const defaultStyle = {
      font: {
        name: "Arial",
        size: 24, // 12pt = 24 half-points
      },
      spacing: {
        line: 360, // 1.2 spacing = 360 (240 * 1.2)
      },
    };

    let doc;

    // ... existing code ...

    if (activeTab === 'timestamps') {
      // First combine segments into paragraphs
      let paragraphs: Array<{ text: string, startTime: number, endTime: number }> = [];
      let currentParagraph = '';
      let startTime = 0;
      let endTime = 0;
      let isFirstSegment = true;

      result.segments.forEach((segment) => {
        const text = segment.text.trim();

        if (isFirstSegment) {
          startTime = segment.startTime;
          isFirstSegment = false;
        }

        if (text.endsWith('.')) {
          currentParagraph += ' ' + text;
          endTime = segment.endTime;

          if (currentParagraph.trim()) {
            paragraphs.push({
              text: currentParagraph.trim(),
              startTime,
              endTime
            });
          }

          currentParagraph = '';
          isFirstSegment = true;
        } else {
          currentParagraph += ' ' + text;
          endTime = segment.endTime;
        }
      });

      // Add any remaining text as final paragraph
      if (currentParagraph.trim()) {
        if (!currentParagraph.trim().endsWith('.')) {
          currentParagraph += '.';
        }
        paragraphs.push({
          text: currentParagraph.trim(),
          startTime,
          endTime
        });
      }

      // Create table with combined paragraphs
      const table = new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        margins: {
          top: 100,
          bottom: 100,
          left: 100,
          right: 100,
        },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
          insideVertical: { style: BorderStyle.SINGLE, size: 1 },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: {
                  size: 25,
                  type: WidthType.PERCENTAGE,
                },
                children: [new Paragraph({
                  text: "Timestamp",
                  style: "defaultParagraph"
                })],
              }),
              new TableCell({
                width: {
                  size: 75,
                  type: WidthType.PERCENTAGE,
                },
                children: [new Paragraph({
                  text: "Text",
                  style: "defaultParagraph"
                })],
              }),
            ],
          }),
          ...paragraphs.map(
            paragraph =>
              new TableRow({
                children: [
                  new TableCell({
                    width: {
                      size: 25,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      text: `[${formatTime(paragraph.startTime)} - ${formatTime(paragraph.endTime)}]`,
                      style: "defaultParagraph"
                    })],
                  }),
                  new TableCell({
                    width: {
                      size: 75,
                      type: WidthType.PERCENTAGE,
                    },
                    children: [new Paragraph({
                      text: paragraph.text,
                      style: "defaultParagraph"
                    })],
                  }),
                ],
              })
          ),
        ],
      });

      doc = new Document({
        sections: [{
          properties: {},
          children: [table]
        }],
        styles: {
          paragraphStyles: [{
            id: "defaultParagraph",
            name: "Default Paragraph",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: {
                name: "Arial",
              },
              size: 24 // 12pt = 24 half-points
            },
            paragraph: {
              spacing: {
                line: 360, // 1.5 spacing = 360
                before: 120,
                after: 120
              }
            }
          }]
        }
      });
    } else {
      // Create paragraphs for text-only view
      let paragraphs: string[] = [];
      let currentParagraph = '';

      result.segments.forEach((segment) => {
        const text = segment.text.trim();

        if (text.endsWith('.')) {
          currentParagraph += ' ' + text;
          if (currentParagraph.trim()) {
            paragraphs.push(currentParagraph.trim());
          }
          currentParagraph = '';
        } else {
          currentParagraph += ' ' + text;
        }
      });

      // Add any remaining text as final paragraph
      if (currentParagraph.trim()) {
        if (!currentParagraph.trim().endsWith('.')) {
          currentParagraph += '.';
        }
        paragraphs.push(currentParagraph.trim());
      }

      doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs.map(paragraph =>
            new Paragraph({
              text: paragraph,
              spacing: {
                after: 200,
                line: 360
              },
              style: "defaultParagraph"
            })
          )
        }],
        styles: {
          paragraphStyles: [{
            id: "defaultParagraph",
            name: "Default Paragraph",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: {
                name: "Arial",
              },
              size: 24
            },
            paragraph: {
              spacing: {
                line: 360
              }
            }
          }]
        }
      });
    }

    // Generate the .docx file
    const blob = await Packer.toBlob(doc);

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName}-transcription.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-border"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center gap-2"
        >
          <FileText className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {result.segments.map(segment => segment.text).join(' ').split(' ').length} words
          </span>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center gap-2"
        >
          <LetterText className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {result.textLength} characters
          </span>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center gap-2"
        >
          <Clock className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {formatTime(durationToSeconds(result.audioDuration))}
          </span>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors ml-auto"
        >
          <Download className="size-4" />
          <span className="text-sm font-medium">Download</span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs
          tabs={[
            { value: 'timestamps', label: 'With Timestamps' },
            { value: 'text', label: 'Text Only' }
          ]}
          value={activeTab}
          onValueChange={setActiveTab}
        />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 overflow-y-auto p-4"
        >
          {activeTab === 'timestamps' ? (
            <div className="space-y-6">
              {(() => {
                let paragraphs: Array<{ text: string, startTime: number, endTime: number }> = [];
                let currentParagraph = '';
                let startTime = 0;
                let endTime = 0;
                let isFirstSegment = true;

                result.segments.forEach((segment) => {
                  const text = segment.text.trim();

                  if (isFirstSegment) {
                    startTime = segment.startTime;
                    isFirstSegment = false;
                  }

                  if (text.endsWith('.')) {
                    currentParagraph += ' ' + text;
                    endTime = segment.endTime;

                    if (currentParagraph.trim()) {
                      paragraphs.push({
                        text: currentParagraph.trim(),
                        startTime,
                        endTime
                      });
                    }

                    currentParagraph = '';
                    isFirstSegment = true;
                  } else {
                    currentParagraph += ' ' + text;
                    endTime = segment.endTime;
                  }
                });

                // Add any remaining text as final paragraph
                if (currentParagraph.trim()) {
                  if (!currentParagraph.trim().endsWith('.')) {
                    currentParagraph += '.';
                  }
                  paragraphs.push({
                    text: currentParagraph.trim(),
                    startTime,
                    endTime
                  });
                }

                return paragraphs.map((paragraph, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-xs text-muted-foreground pt-1 select-none">
                        [{formatTime(paragraph.startTime)} - {formatTime(paragraph.endTime)}]
                      </span>
                      <p className="flex-1 text-foreground">
                        {paragraph.text}
                      </p>
                    </div>
                  </motion.div>
                ));
              })()}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-sm max-w-none dark:prose-invert"
            >
              {(() => {
                let paragraphs: string[] = [];
                let currentParagraph = '';
                let sentenceCount = 0;

                result.segments.forEach((segment) => {
                  const text = segment.text.trim();
                  
                  if (text.endsWith('.')) {
                    currentParagraph += ' ' + text;
                    sentenceCount++;
                    
                    // Create a new paragraph after 2-3 sentences
                    if (sentenceCount >= 2 && Math.random() > 0.5 || sentenceCount >= 3) {
                      if (currentParagraph.trim()) {
                        paragraphs.push(currentParagraph.trim());
                      }
                      currentParagraph = '';
                      sentenceCount = 0;
                    }
                  } else {
                    currentParagraph += ' ' + text;
                  }
                });

                // Add any remaining text as final paragraph
                if (currentParagraph.trim()) {
                  paragraphs.push(currentParagraph.trim());
                }

                return paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-4"
                  >
                    {paragraph}
                  </motion.p>
                ));
              })()}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}