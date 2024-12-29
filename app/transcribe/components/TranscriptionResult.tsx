import React, { useState } from 'react';
import { Download, Clock, FileText, Calendar, RefreshCw, LetterText } from 'lucide-react';
import { Tabs } from './ui/Tabs';
import type { TranscriptionResult } from '../types';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';

interface TranscriptionResultProps {
  result: TranscriptionResult;
}

export function TranscriptionResult({ result }: TranscriptionResultProps) {
  const [activeTab, setActiveTab] = useState('timestamps');

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
    <>
      <div className="fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-sm border-b z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-center relative">
          <button
            onClick={() => window.location.reload()}
            className="absolute right-4 text-gray-600 hover:text-blue-600 transition-colors"
            title="New Transcription"
          >
            <RefreshCw size={20} />
          </button>
          <h1 className="text-xl font-bold">Transcription <span className='text-blue-600'>Result</span></h1>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {result.fileName.replace(/(\.[^.]+)$/, '')}
            <span className="text-blue-600">
              {result.fileName.match(/\.[^.]+$/)?.[0]}
            </span>
          </h2>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center space-x-2 text-gray-600 justify-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>Duration: {result.audioDuration}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 justify-center">
              <FileText className="h-5 w-5 mr-2" />
              <span>Words: {result.segments.map(segment => segment.text).join(' ').split(' ').length}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 justify-center">
              <LetterText className="h-5 w-5 mr-2" />
              <span>Characters: {result.textLength}</span>
            </div>
            <div className="flex justify-center md:col-start-2 md:col-span-1 lg:col-auto">
              <button
                onClick={handleDownload}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          tabs={[
            { value: 'timestamps', label: 'With Timestamps' },
            { value: 'text', label: 'Text Only' }
          ]}
        />

        <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">

          {activeTab === 'timestamps' ? (
            <div className="space-y-4">
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
                  <div key={index} className="flex space-x-4">
                    <span className="text-gray-500 whitespace-nowrap">
                      [{formatTime(paragraph.startTime)} - {formatTime(paragraph.endTime)}]
                    </span>
                    <p>{paragraph.text}</p>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="prose max-w-none">
              {(() => {
                let paragraphs: string[] = [];
                let currentParagraph = '';

                result.segments.forEach((segment) => {
                  const text = segment.text.trim();

                  // If text ends with period, add to current and start new paragraph
                  if (text.endsWith('.')) {
                    currentParagraph += ' ' + text;
                    if (currentParagraph.trim()) {
                      paragraphs.push(currentParagraph.trim());
                    }
                    currentParagraph = '';
                  } else {
                    // Add to current paragraph
                    currentParagraph += ' ' + text;
                  }
                });

                // Add any remaining text as final paragraph
                if (currentParagraph.trim()) {
                  // Add period if missing
                  if (!currentParagraph.trim().endsWith('.')) {
                    currentParagraph += '.';
                  }
                  paragraphs.push(currentParagraph.trim());
                }

                return paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ));
              })()}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}