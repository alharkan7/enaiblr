// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
  provider: 'openai' | 'anthropic' | 'google' | 'groq' | 'togetherai';
  type: 'pro' | 'free',
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
    description: 'Text, Images, Editor, Code',
    provider: 'openai',
    type: 'pro',
    capabilities: {
      images: true,
      files: false,
    },
  },
  {
    id: 'claude-3-haiku',
    label: 'Claude 3',
    apiIdentifier: 'claude-3-haiku-20240307',
    description: 'Text, Images, Editor, Code',
    provider: 'anthropic',
    type: 'pro',
    capabilities: {
      images: true,
      files: false,
    },
  },
  {
    id: 'gemini-1.5-flash',
    label: 'Gemini 1.5',
    apiIdentifier: 'gemini-1.5-flash',
    description: 'Text, Image, Documents',
    provider: 'google',
    type: 'pro',
    capabilities: {
      images: true,
      files: true,
    },
  },
  {
    id: 'llama3-70b-8192',
    label: 'Llama 3',
    apiIdentifier: 'llama3-70b-8192',
    description: 'Text, Editor, Code',
    provider: 'groq',
    type: 'free',
    capabilities: {
      images: false,
      files: false,
    },
  },
  // {
  //   id: 'mixtral-8x7b-32768',
  //   label: 'Mixtral 8x',
  //   apiIdentifier: 'mixtral-8x7b-32768',
  //   description: 'Text, Editor, Code',
  //   provider: 'groq',
  //   type: 'free',
  //   capabilities: {
  //       images: false,
  //       files: false,
  //     },
  // },
  // {
  //   id: 'gemma2-9b-it',
  //   label: 'Gemma 2',
  //   apiIdentifier: 'gemma2-9b-it',
  //   description: 'Text, Editor, Code',
  //   provider: 'groq',
  //   type: 'free',
  //   capabilities: {
  //       images: false,
  //       files: false,
  //     },
  // },
] as const;

export const DEFAULT_MODEL_NAME: string = 'llama3-70b-8192';

