// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
  provider: 'openai' | 'anthropic' | 'google' | 'togetherai';
  capabilities: {
    images?: boolean;
    files?: boolean;
  };
}

export const models: Array<Model> = [
  {
    id: 'gpt-4o-mini',
    label: 'ChatGPT 4o',
    apiIdentifier: 'gpt-4o-mini',
    description: 'OpenAI | Text and Images',
    provider: 'openai',
    capabilities: {
      images: true,
      files: false,
    },
  },
  {
    id: 'claude-3-haiku',
    label: 'Claude 3',
    apiIdentifier: 'claude-3-haiku-20240307',
    description: 'Anthropic | Text and Images',
    provider: 'anthropic',
    capabilities: {
      images: true,
      files: false,
    },
  },
  {
    id: 'gemini-1.5-flash',
    label: 'Gemini 1.5',
    apiIdentifier: 'gemini-1.5-flash',
    description: 'Google | Text, Image, Documents',
    provider: 'google',
    capabilities: {
      images: true,
      files: true,
    },
  },
  {
    id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    label: 'Llama 3.3',
    apiIdentifier: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    description: 'Meta | Text Only',
    provider: 'togetherai',
    capabilities: {
      images: false,
      files: false,
    },
  }
] as const;

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini';
