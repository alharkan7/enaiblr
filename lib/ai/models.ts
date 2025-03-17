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
    id: 'gpt-4o',
    label: 'ChatGPT-4o',
    apiIdentifier: 'gpt-4o',
    description: 'Text, Image',
    // description: 'OpenAI',
    overview: ['Ask Questions', 'Attach Images'],
    provider: 'openai',
    type: 'pro',
    capabilities: {
      images: true,
      files: true,
    },
    tools: true,
  },
  {
    id: 'claude-3-5-sonnet-latest',
    label: 'Claude 3.5',
    apiIdentifier: 'claude-3-5-sonnet-latest',
    description: 'Text, Image, PDF',
    // description: 'Anthropic',
    overview: ['Ask Questions', 'Attach Images', 'Chat with Documents'],
    provider: 'anthropic',
    type: 'pro',
    capabilities: {
      images: true,
      files: true,
    },
    tools: true,
  },
  {
    id: 'gemini-2.0-flash',
    label: 'Gemini 2.0',
    apiIdentifier: 'gemini-2.0-flash',
    description: 'Text, Image, PDF',
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
    description: 'Text, Artifact',
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
    description: 'Text, Artifact',
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
    description: 'Text, Artifact',
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

export const DEFAULT_MODEL_NAME: string = 'gemini-2.0-flash';

