// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
  provider: 'openai' | 'anthropic' | 'google';
}

export const models: Array<Model> = [
  {
    id: 'gpt-4o-mini',
    label: 'GPT-4o',
    apiIdentifier: 'gpt-4o-mini',
    description: 'OpenAI',
    provider: 'openai',
  },
  {
    id: 'claude-3-5-haiku',
    label: 'Claude 3.5',
    apiIdentifier: 'claude-3-5-haiku-20241022',
    description: 'Anthropic',
    provider: 'anthropic',
  },
  {
    id: 'gemini-1.5-flash',
    label: 'Gemini 1.5',
    apiIdentifier: 'gemini-1.5-flash',
    description: 'Google',
    provider: 'google',
  }
] as const;

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini';
