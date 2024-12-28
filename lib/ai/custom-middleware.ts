import type { Experimental_LanguageModelV1Middleware, } from 'ai';

export const customMiddleware: Experimental_LanguageModelV1Middleware = {
  wrapStream: async ({ doStream, params, model }) => {
    try {
      return await doStream();
    } catch (err) {
      const error = err as Error;
      console.error('AI Provider Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  },
};
