// Define your models here.

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
    id: 'gemini-1.5-flash-gpt',
    label: 'ChatGPT-4o',
    apiIdentifier: 'gemini-1.5-flash',
    description: 'Text, Image, Document',
    // description: 'OpenAI',
    overview: ['Ask Questions', 'Attach Images', 'Chat with Documents'],
    provider: 'google',
    type: 'pro',
    capabilities: {
      images: true,
      files: true,
    },
    tools: false,
  },
  {
    id: 'gemini-1.5-flash-claude',
    label: 'Claude 3.5',
    apiIdentifier: 'gemini-1.5-flash',
    description: 'Text, Image, Document',
    // description: 'Anthropic',
    overview: ['Ask Questions', 'Attach Images', 'Chat with Documents'],
    provider: 'google',
    type: 'pro',
    capabilities: {
      images: true,
      files: true,
    },
    tools: false,
  },
  {
    id: 'gemini-1.5-flash',
    label: 'Gemini 1.5',
    apiIdentifier: 'gemini-1.5-flash',
    description: 'Text, Image, Document',
    // description: 'Google',
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
    description: 'Text, Canvas/Artifact',
    // description: 'Meta',
    overview: ['Ask Questions', 'Create Documents', 'Document Editor'],
    provider: 'groq',
    type: 'free',
    capabilities: {
      images: false,
      files: false,
    },
    tools: true,
  },
  {
    id: 'deepseek-ai/DeepSeek-V3',
    label: 'DeepSeek V3',
    apiIdentifier: 'deepseek-ai/DeepSeek-V3',
    description: 'Text',
    // description: 'High-Flyer',
    overview: ['Ask Questions'],
    provider: 'togetherai',
    type: 'free',
    capabilities: {
      images: false,
      files: false,
    },
    tools: false,
  },
  {
    id: 'Qwen/Qwen2.5-72B-Instruct-Turbo',
    label: 'Qwen 2.5',
    apiIdentifier: 'Qwen/Qwen2.5-72B-Instruct-Turbo',
    description: 'Text',
    // description: 'Alibaba',
    overview: ['Ask Questions'],
    provider: 'togetherai',
    type: 'free',
    capabilities: {
      images: false,
      files: false,
    },
    tools: false,
  },
  {
    id: 'mixtral-8x7b-32768',
    label: 'Mixtral 8x',
    apiIdentifier: 'mixtral-8x7b-32768',
    description: 'Text, Canvas/Artifact',
    // description: 'Mistral',
    overview: ['Ask Questions', 'Create Documents', 'Document Editor'],
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
    description: 'Text, Canvas/Artifact',
    // description: 'Google',
    overview: ['Ask Questions', 'Create Documents', 'Document Editor'],
    provider: 'groq',
    type: 'free',
    capabilities: {
      images: false,
      files: false,
    },
    tools: true,
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'gemini-1.5-flash';

