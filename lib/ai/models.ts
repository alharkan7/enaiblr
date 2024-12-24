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
    description: 'OpenAI',
    provider: 'openai',
    capabilities: {
      images: true,
    },
  },
  {
    id: 'claude-3-haiku',
    label: 'Claude 3',
    apiIdentifier: 'claude-3-haiku-20240307',
    description: 'Anthropic',
    provider: 'anthropic',
    capabilities: {
      images: true,
    },
  },
  {
    id: 'gemini-1.5-flash',
    label: 'Gemini 1.5',
    apiIdentifier: 'gemini-1.5-flash',
    description: 'Google',
    provider: 'google',
    capabilities: {
      images: true,
    },
  },
  {
    id: 'llama-vision',
    label: 'Llama 3.2',
    apiIdentifier: 'meta-llama/Llama-Vision-Free',
    description: 'Meta',
    provider: 'togetherai',
    capabilities: {
      images: true,
    },
  }
] as const;

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini';
