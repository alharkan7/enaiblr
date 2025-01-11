// Define your models here.

import { List } from "lodash";

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
  overview: string[];
  provider: 'openai' | 'anthropic' | 'google' | 'groq' | 'togetherai';
  type: 'pro' | 'free',
  capabilities: {
    images?: boolean;
    files?: boolean;
  };
  tools: boolean,
}

export const models: Array<Model> = [
  {
    id: 'gpt-4o-mini',
    label: 'ChatGPT 4o',
    apiIdentifier: 'gpt-4o-mini',
    description: 'OpenAI',
    overview: ['Ask Questions', 'Attach Images', 'Create Documents', 'Write and Run Codes'],
    provider: 'openai',
    type: 'pro',
    capabilities: {
      images: true,
      files: false,
    },
    tools: true,
  },
  {
    id: 'claude-3-haiku',
    label: 'Claude 3.5',
    apiIdentifier: 'claude-3-haiku-20240307',
    description: 'Anthropic',
    overview: ['Ask Questions', 'Attach Images', 'Create Documents', 'Write and Run Codes'],
    provider: 'anthropic',
    type: 'pro',
    capabilities: {
      images: true,
      files: false,
    },
    tools: true,
  },
  {
    id: 'gemini-1.5-flash',
    label: 'Gemini 1.5',
    apiIdentifier: 'gemini-1.5-flash',
    description: 'Google',
    overview: ['Ask Questions', 'Attach Images', 'Chat with Documents'],
    provider: 'google',
    type: 'free',
    capabilities: {
      images: true,
      files: true,
    },
    tools: false,
  },
  {
    id: 'llama3-70b-8192',
    label: 'Llama 3',
    apiIdentifier: 'llama3-70b-8192',
    description: 'Meta',
    overview: ['Ask Questions', 'Create Documents', 'Write and Run Codes'],
    provider: 'groq',
    type: 'free',
    capabilities: {
      images: false,
      files: false,
    },
    tools: true,
  },
  {
    id: 'mixtral-8x7b-32768',
    label: 'Mixtral 8x',
    apiIdentifier: 'mixtral-8x7b-32768',
    description: 'Mistral',
    overview: ['Ask Questions', 'Create Documents'],
    provider: 'groq',
    type: 'free',
    capabilities: {
        images: false,
        files: false,
      },
    tools: true,
  },
  {
    id: 'gemma2-9b-it',
    label: 'Gemma 2',
    apiIdentifier: 'gemma2-9b-it',
    description: 'Google',
    overview: ['Ask Questions', 'Create Documents'],
    provider: 'groq',
    type: 'free',
    capabilities: {
        images: false,
        files: false,
      },
   tools: true,
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'llama3-70b-8192';

