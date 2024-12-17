import { openai, createOpenAI } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google, createGoogleGenerativeAI } from '@ai-sdk/google';

import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: 'https://api.groq.com/openai/v1'
});

// Initialize Google client
const googleClient = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});


export const getModelForProvider = (provider: string, apiIdentifier: string) => {
  switch (provider) {
    case 'openai':
      return openai(apiIdentifier);
    case 'anthropic':
      return anthropic(apiIdentifier);
    case 'google':
      return googleClient(apiIdentifier);
    case 'groq':
      return groq(apiIdentifier);
    default:
      return openai(apiIdentifier);
  }
};

export const customModel = (apiIdentifier: string, provider: string) => {
  return wrapLanguageModel({
    model: getModelForProvider(provider, apiIdentifier),
    middleware: customMiddleware,
  });
};