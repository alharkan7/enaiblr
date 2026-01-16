import { auth } from '@/app/(auth)/auth';

/**
 * Get the Gemini API key for the current request.
 * Priority:
 * 1. User's own API key (from session, if they have set one)
 * 2. Fallback to environment variable GOOGLE_GENERATIVE_AI_API_KEY
 * 
 * @returns The API key to use for Gemini requests
 * @throws Error if no API key is available
 */
export async function getGeminiApiKey(): Promise<string> {
    const session = await auth();

    // Check if user has their own API key in session
    const userApiKey = (session as any)?.user?.geminiApiKey;

    if (userApiKey && typeof userApiKey === 'string' && userApiKey.trim() !== '') {
        return userApiKey;
    }

    // Fallback to environment variable
    const envApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!envApiKey) {
        throw new Error('No Gemini API key available. Please set your API key in your profile or contact the administrator.');
    }

    return envApiKey;
}

/**
 * Check if the user is using their own API key
 * @returns boolean indicating if user has their own API key
 */
export async function isUsingUserApiKey(): Promise<boolean> {
    const session = await auth();
    const userApiKey = (session as any)?.user?.geminiApiKey;
    return !!(userApiKey && typeof userApiKey === 'string' && userApiKey.trim() !== '');
}
