import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extract } from '@extractus/article-extractor';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

async function paraphraseWithContext(messages: any[]) {
  const contextModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const history = messages.slice(0, -1)
    .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content[0].text}`)
    .join('\n');
  const currentQuery = messages[messages.length - 1].content[0].text;

  const prompt = `Given this conversation history:\n${history}\n\nThe user asked: "${currentQuery}"\n\nPlease rephrase the user's question to include necessary context from the conversation history. Return ONLY the rephrased question, nothing else. Use user's language, so do translation when necessary.`;

  const result = await contextModel.generateContent(prompt);
  const paraphrasedQuery = result.response.text().trim();
  return paraphrasedQuery;
}

async function detectLanguage(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const prompt = `Analyze this text and return ONLY the ISO language code (e.g., 'en', 'id', 'es'). Just return the code, nothing else:

"${text}"`;
  
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, chatMode } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid or empty messages array');
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content?.[0]?.text) {
      throw new Error('Invalid message format');
    }

    const userInput = lastMessage.content[0].text;
    
    // Detect language from user input
    const detectedLang = await detectLanguage(userInput);

    // Use Gemini for article processing and follow-up questions
    if (chatMode === 'gemini') {
      try {
        let contents;
        
        // If it's the first message, extract article content
        if (messages.length === 1) {
          const article = await extract(userInput);
          if (!article?.content) {
            return NextResponse.json(
              { error: 'Could not extract content from this URL. The page might be too large or not accessible.' },
              { status: 400 }
            );
          }
          contents = [{
            role: "user",
            parts: [{ text: `Here's the content from ${userInput}:\n\n${article.content}\n\nPlease provide a comprehensive summary of this content.` }]
          }];
        } else {
          // For follow-up questions, include chat history
          contents = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ 
              text: Array.isArray(msg.content) 
                ? msg.content[0].text 
                : msg.content 
            }]
          }));
        }

        // Process with Gemini
        const result = await model.generateContentStream({
          contents,
          generationConfig,
        });

        // Create stream for response
        const stream = new ReadableStream({
          async start(controller) {
            try {
              // Send URL metadata only for the first message
              if (messages.length === 1) {
                const article = await extract(userInput);
                const metaData = {
                  type: 'sources',
                  sources: [{
                    url: userInput,
                    title: article?.title || 'Article',
                    snippet: article?.description || '',
                  }]
                };
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(metaData)}\n\n`));
              }

              // Stream Gemini response
              for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                if (chunkText) {
                  const data = { type: 'content', content: chunkText };
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
                }
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        });

        return new NextResponse(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (error) {
        console.error('Gemini processing error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to process with Gemini';
        return NextResponse.json(
          { error: errorMessage },
          { status: 500 }
        );
      }
    } else {
      // Use Brave Search API for web search
      try {
        // Paraphrase the query if it's a follow-up question
        const searchQuery = messages.length > 1 
          ? await paraphraseWithContext(messages)
          : userInput;

        const searchResponse = await fetch(
          `https://api.search.brave.com/res/v1/web/search?` + 
          new URLSearchParams({
            q: searchQuery,
            // country: 'US',
            // search_lang: 'en',
            // ui_lang: 'en-US',
            count: '20',
            offset: '0',
            safesearch: 'moderate',
            freshness: 'pm',  // Past month
            text_decorations: 'false',
            extra_snippets: 'true',
            result_filter: 'web',
            spellcheck: 'true'
          }).toString(),
          {
            headers: {
              'Accept': 'application/json',
              'Accept-Encoding': 'gzip',
              'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY || ''
            }
          }
        );

        if (!searchResponse.ok) {
          throw new Error('Failed to fetch search results');
        }

        const searchData = await searchResponse.json();
        let searchResults = searchData.web?.results || [];

        // Filter and rank results
        searchResults = searchResults
          // Remove results without descriptions
          .filter((result: any) => result.description?.trim())
          // Take top 10 results
          .slice(0, 5);

        // Format search results for Gemini
        const searchContext = searchResults
          .map((result: any) => `[${result.title}]\n${result.description}\nURL: ${result.url}`)
          .join('\n\n');

        const prompt = `Based on the following search results about "${searchQuery}", provide a brief and informative response. The user is writing in ${detectedLang} language, so please provide your response in ${detectedLang} language. If the language is not English, translate your response. Prioritize accuracy and relevance from your knowledge base. If it's beyond your knowledge cutoff, use the information from the search results to answer the question.

${searchContext}

Please synthesize this information into a clear and helpful response in the user's language (${detectedLang}). Include relevant facts and details from the sources.`;

        // Process with Gemini
        const result = await model.generateContentStream({
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }],
          generationConfig,
        });

        // Create stream for response
        const stream = new ReadableStream({
          async start(controller) {
            try {
              // Send search results metadata first
              const sources = searchResults.slice(0, 10).map((result: any) => ({
                url: result.url,
                title: result.title,
                snippet: result.description
              }));
              
              const metaData = {
                type: 'sources',
                sources
              };
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(metaData)}\n\n`));

              // Stream Gemini response
              for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                if (chunkText) {
                  const data = { type: 'content', content: chunkText };
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
                }
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        });

        return new NextResponse(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (error: any) {
        console.error('Search error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to process search request' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error processing chat request' }, 
      { status: 500 }
    );
  }
}
