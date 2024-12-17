// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
  provider: string;
}

export const models: Array<Model> = [
  {
    id: 'gpt-4o-mini',
    label: 'ChatGPT',
    apiIdentifier: 'gpt-4o-mini',
    description: 'OpenAI',
    provider: 'openai'
  },
  // {
  //   id: 'gpt-4o',
  //   label: 'GPT 4o',
  //   apiIdentifier: 'gpt-4o',
  //   description: 'For complex, multi-step tasks',
  // },
  {
    id: 'gemini-1.5-flash',
    label: 'Gemini',
    apiIdentifier: 'gemini-1.5-flash-002',
    description: 'Google',
    provider: 'google'
  },
  {
    id: 'claude-3-5-haiku-20241022',
    label: 'Claude',
    apiIdentifier: 'claude-3-5-haiku-20241022',
    description: 'Anthropic',
    provider: 'anthropic'
  },
  {
    id: 'llama-3.2-11b-vision-preview',
    label: 'Llama',
    apiIdentifier: 'llama-3.2-11b-vision-preview',
    description: 'Meta',
    provider: 'groq'
  }
] as const;

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini';
