import { cn, generateUUID } from '@/lib/utils';
import { ClockRewind, CopyIcon, PlayIcon, RedoIcon, UndoIcon, DownloadIcon } from './icons';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useCopyToClipboard } from 'usehooks-ts';
import { toast } from 'sonner';
import { ConsoleOutput, UIBlock } from './block';
import type { Document } from '@/lib/db/schema';
import { defaultMarkdownParser } from 'prosemirror-markdown';
import { DOMSerializer } from 'prosemirror-model';
import {
  Dispatch,
  memo,
  SetStateAction,
  startTransition,
  useCallback,
  useState,
} from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

declare function loadPyodide(config: { indexURL: string }): Promise<any>;

interface BlockActionsProps {
  block: UIBlock;
  handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void;
  currentVersionIndex: number;
  isCurrentVersion: boolean;
  mode: 'read-only' | 'edit' | 'diff';
  setConsoleOutputs: Dispatch<SetStateAction<Array<ConsoleOutput>>>;
  document: Document | null;
}

export function RunCodeButton({
  block,
  setConsoleOutputs,
}: {
  block: UIBlock;
  setConsoleOutputs: Dispatch<SetStateAction<Array<ConsoleOutput>>>;
}) {
  const [pyodide, setPyodide] = useState<any>(null);
  const isPython = true;
  const codeContent = block.content;

  const updateConsoleOutput = useCallback(
    (runId: string, content: string | null, status: 'completed' | 'failed') => {
      setConsoleOutputs((consoleOutputs) => {
        const index = consoleOutputs.findIndex((output) => output.id === runId);

        if (index === -1) return consoleOutputs;

        const updatedOutputs = [...consoleOutputs];
        updatedOutputs[index] = {
          id: runId,
          content,
          status,
        };

        return updatedOutputs;
      });
    },
    [setConsoleOutputs],
  );

  const loadAndRunPython = useCallback(async () => {
    console.log('Environment:', typeof window !== 'undefined' ? 'Browser' : 'Server');
    const runId = generateUUID();

    setConsoleOutputs((consoleOutputs) => [
      ...consoleOutputs,
      {
        id: runId,
        content: null,
        status: 'in_progress',
      },
    ]);

    let currentPyodideInstance = pyodide;

    if (isPython) {
      if (!currentPyodideInstance) {
        try {
          console.log('Loading Pyodide...');
          const newPyodideInstance = await loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
          });
          console.log('Pyodide loaded successfully');
          setPyodide(newPyodideInstance);
          currentPyodideInstance = newPyodideInstance;
        } catch (error) {
          console.error('Failed to load Pyodide:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          updateConsoleOutput(runId, 'Failed to load Python environment: ' + errorMessage, 'failed');
          return;
        }
      }

      try {
        await currentPyodideInstance.runPythonAsync(`
            import sys
            import io
            sys.stdout = io.StringIO()
          `);

        await currentPyodideInstance.runPythonAsync(codeContent);

        const output: string = await currentPyodideInstance.runPythonAsync(
          `sys.stdout.getvalue()`,
        );

        updateConsoleOutput(runId, output, 'completed');
      } catch (error: any) {
        updateConsoleOutput(runId, error.message, 'failed');
      }
    }
  }, [pyodide, codeContent, isPython, setConsoleOutputs, updateConsoleOutput]);

  return (
    <Button
      variant="outline"
      className="py-1.5 px-2 h-fit dark:hover:bg-zinc-700"
      onClick={() => {
        startTransition(() => {
          loadAndRunPython();
        });
      }}
      disabled={block.status === 'streaming'}
    >
      <PlayIcon size={18} /> Run
    </Button>
  );
}

function PureBlockActions({
  block,
  handleVersionChange,
  currentVersionIndex,
  isCurrentVersion,
  mode,
  setConsoleOutputs,
  document: currentDocument,
}: BlockActionsProps) {
  const [_, copyToClipboard] = useCopyToClipboard();

  return (
    <div className="flex flex-row gap-1">
      {block.kind === 'code' && (
        <RunCodeButton block={block} setConsoleOutputs={setConsoleOutputs} />
      )}

      {block.kind === 'text' && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'p-2 h-fit !pointer-events-auto dark:hover:bg-zinc-700',
                {
                  'bg-muted': mode === 'diff',
                },
              )}
              onClick={() => {
                handleVersionChange('toggle');
              }}
              disabled={
                block.status === 'streaming' || currentVersionIndex === 0
              }
            >
              <ClockRewind size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View changes</TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="p-2 h-fit dark:hover:bg-zinc-700 !pointer-events-auto"
            onClick={() => {
              handleVersionChange('prev');
            }}
            disabled={currentVersionIndex === 0 || block.status === 'streaming'}
          >
            <UndoIcon size={18} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View Previous version</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="p-2 h-fit dark:hover:bg-zinc-700 !pointer-events-auto"
            onClick={() => {
              handleVersionChange('next');
            }}
            disabled={isCurrentVersion || block.status === 'streaming'}
          >
            <RedoIcon size={18} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View Next version</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          {block.kind === 'text' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="p-2 h-fit !pointer-events-auto dark:hover:bg-zinc-700"
                >
                  <DownloadIcon size={18} />
                  <span className="sr-only">Download</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    const fileName = currentDocument?.title ?? block.title;
                    const blob = new Blob([block.content], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = window.document.createElement('a');
                    a.href = url;
                    a.download = `${fileName}.md`;
                    window.document.body.appendChild(a);
                    a.click();
                    window.document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  Markdown (.md)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const fileName = currentDocument?.title ?? block.title;
                    // Convert markdown to HTML
                    const state = defaultMarkdownParser.parse(block.content);
                    const div = window.document.createElement('div');
                    const fragment = DOMSerializer.fromSchema(state.type.schema).serializeFragment(state.content);
                    div.appendChild(fragment);
                    
                    // Create Word-compatible HTML
                    const htmlContent = `
                      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                      <head><meta charset='utf-8'></head>
                      <body>
                        ${div.innerHTML}
                      </body>
                      </html>
                    `;

                    const blob = new Blob([htmlContent], { type: 'application/msword' });
                    const url = URL.createObjectURL(blob);
                    const a = window.document.createElement('a');
                    a.href = url;
                    a.download = `${fileName}.doc`;
                    window.document.body.appendChild(a);
                    a.click();
                    window.document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  Word (.doc)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="p-2 h-fit !pointer-events-auto dark:hover:bg-zinc-700"
              onClick={() => {
                const fileName = currentDocument?.title ?? block.title;
                const blob = new Blob([block.content], { type: 'text/x-python' });
                const url = URL.createObjectURL(blob);
                const a = window.document.createElement('a');
                a.href = url;
                a.download = `${fileName}.py`;
                window.document.body.appendChild(a);
                a.click();
                window.document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              <DownloadIcon size={18} />
              <span className="sr-only">Download</span>
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent>Download</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="p-2 h-fit dark:hover:bg-zinc-700"
            onClick={() => {
              copyToClipboard(block.content);
              toast.success('Copied to clipboard!');
            }}
            disabled={block.status === 'streaming'}
          >
            <CopyIcon size={18} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy to clipboard</TooltipContent>
      </Tooltip>
    </div>
  );
}

export const BlockActions = memo(PureBlockActions, (prevProps, nextProps) => {
  if (prevProps.block.status !== nextProps.block.status) return false;
  if (prevProps.currentVersionIndex !== nextProps.currentVersionIndex)
    return false;
  if (prevProps.isCurrentVersion !== nextProps.isCurrentVersion) return false;

  return true;
});
