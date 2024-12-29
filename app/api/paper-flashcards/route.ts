import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { FlashCardContent } from '@/app/paper-flashcard/types';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Validate if the object has all required fields with non-empty strings
function isValidFlashCardContent(obj: any): obj is FlashCardContent {
  const requiredFields = ['intro', 'question', 'researcher', 'method', 'findings', 'implications', 'closing'];
  return (
    obj &&
    typeof obj === 'object' &&
    requiredFields.every(field => 
      typeof obj[field] === 'string' && 
      obj[field].trim().length > 0
    )
  );
}

// Clean and format the content
function cleanFlashCardContent(content: FlashCardContent): FlashCardContent {
  const cleaned: FlashCardContent = {} as FlashCardContent;
  Object.entries(content).forEach(([key, value]) => {
    cleaned[key as keyof FlashCardContent] = value
      .trim()
      .replace(/^["']|["']$/g, '') // Remove quotes at start/end
      .replace(/\\n/g, ' ') // Replace escaped newlines
      .replace(/\s+/g, ' '); // Replace multiple spaces
  });
  return cleaned;
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty content provided' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze the following scientific paper and create a series of engaging, easy-to-understand text chunks for flashcards. Return the output ONLY as a JSON object with the following structure:

    {
        "intro": "string",
        "researcher": "string",
        "question": "string",
        "method": "string",
        "findings": "string",
        "implications": "string",
        "closing": "string"
    }

    Guidelines:
    - Each field should contain easy-to-read content, so use simple language.
    - Try to be concise, but still informative, use long paragraphs if necessary.
    - Do not use markdown, code blocks, or special characters.
    - Make the summary coherent from "intro to "closing", resembling a well-structured narrative or storytelling format. 
    - Use a third person perspective.
    - "intro": What is the most interesting finding or surprising fact from the paper. 
    - "researcher": Introduce the scientist(s) or their institution. 
    - "question": What question do they researchers ask?
    - "method": Explain the study's method, try to use avoid technical jargon.
    - "findings": What are the key results, and highlight their significance.
    - "implications": Explain the potential impact on people, society, or future research.
    - "closing": End with a question or call to action to encourage engagement from the audience.

    Here is the scientific paper text:

${content}

    Remember: Respond ONLY with the JSON object. No introductory text, no explanations outside the JSON structure.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to generate valid JSON response' },
        { status: 500 }
      );
    }

    let parsedContent: any;
    try {
      parsedContent = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return NextResponse.json(
        { error: 'Failed to parse generated content' },
        { status: 500 }
      );
    }

    // Validate the content structure
    if (!isValidFlashCardContent(parsedContent)) {
      return NextResponse.json(
        { error: 'Generated content does not match required structure' },
        { status: 500 }
      );
    }

    // Clean and format the content
    const cleanedContent = cleanFlashCardContent(parsedContent);

    // Generate hashtags based on the content
    const hashtagPrompt = `Generate 3-5 relevant hashtags for the following content. Return only the hashtags separated by spaces, without the explanation. Each hashtag should start with #:

${content.substring(0, 1000)}`;  // Use first 1000 chars for hashtag generation

    const hashtagResult = await model.generateContent(hashtagPrompt);
    const hashtags = hashtagResult.response.text()
      .split(' ')
      .filter(tag => tag.startsWith('#'));

    return NextResponse.json({
      flashcards: [cleanedContent], // Wrap in array to maintain compatibility
      hashtags,
    });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    );
  }
}
