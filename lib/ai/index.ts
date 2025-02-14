import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { togetherai } from '@ai-sdk/togetherai';
import { experimental_wrapLanguageModel as wrapLanguageModel, type LanguageModelV1 } from 'ai';

import { customMiddleware } from './custom-middleware';
import { models } from './models';

export const customModel = (apiIdentifier: string) => {
  const model = models.find(m => m.apiIdentifier === apiIdentifier);
  if (!model) throw new Error(`Model ${apiIdentifier} not found`);

  let provider;
  switch (model.provider) {
    case 'openai':
      provider = openai(apiIdentifier);
      break;
    case 'anthropic':
      provider = anthropic(apiIdentifier);
      break;
    case 'groq':
      provider = groq(apiIdentifier);
      break;
    case 'google':
      provider = google(apiIdentifier
        // ,{
        //   safetySettings: [
        //     { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        //     { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        //     { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        //     { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        //   ],
        // }
      );
      break;
    case 'togetherai':
      provider = togetherai(apiIdentifier);
      break;
    default:
      throw new Error(`Unknown provider ${model.provider}`);
  }

  return wrapLanguageModel({
    model: provider as unknown as LanguageModelV1,
    middleware: customMiddleware,
  });
};
