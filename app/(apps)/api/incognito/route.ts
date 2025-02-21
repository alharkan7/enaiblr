import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { NextRequest } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
    },
});

// Helper function to get file extension from mime type
function getFileExtension(mimeType: string): string {
    const mimeToExt: { [key: string]: string } = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'text/plain': 'txt',
        'text/markdown': 'md',
    };
    return mimeToExt[mimeType] || 'bin';
}

// Helper function to convert base64 to buffer and upload to Gemini
async function uploadBase64ToGemini(base64String: string, mimeType: string, fileName: string) {
    try {
        // Remove data URL prefix if present
        const base64Data = base64String.replace(/^data:.*;base64,/, '');
        
        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, 'base64');

        // Create temporary file
        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gemini-'));
        const extension = getFileExtension(mimeType);
        const tempFilePath = path.join(tempDir, `${crypto.randomUUID()}.${extension}`);
        
        // Write buffer to temporary file
        await fs.writeFile(tempFilePath, buffer);

        // Upload to Gemini with metadata
        const uploadResult = await fileManager.uploadFile(tempFilePath, {
            mimeType: mimeType,
            displayName: fileName
        });

        // Clean up temporary file
        await fs.unlink(tempFilePath);
        await fs.rmdir(tempDir);

        return uploadResult.file;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Messages array is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const chat = model.startChat();
        
        // Process each message in the history
        for (const msg of messages) {
            if (msg.role === 'user') {
                const parts: any[] = [];
                
                // Handle file content if present
                if (Array.isArray(msg.content)) {
                    for (const part of msg.content) {
                        if (part.type === 'image_url' && part.image_url?.url) {
                            // Upload image to Gemini
                            const file = await uploadBase64ToGemini(
                                part.image_url.url,
                                'image/jpeg',
                                'uploaded_image.jpg'
                            );
                            parts.push({
                                inlineData: {
                                    mimeType: file.mimeType,
                                    data: part.image_url.url.split(',')[1] // Get base64 data without prefix
                                }
                            });
                        } else if (part.type === 'file_url' && part.file_url?.url) {
                            // Upload file to Gemini
                            const file = await uploadBase64ToGemini(
                                part.file_url.url,
                                part.file_url.type,
                                part.file_url.name
                            );
                            parts.push({
                                fileData: {
                                    mimeType: file.mimeType,
                                    fileUri: file.uri,
                                }
                            });
                        } else if (part.type === 'text') {
                            parts.push({ text: part.text });
                        }
                    }
                } else {
                    parts.push({ text: msg.content });
                }
                
                await chat.sendMessage(parts);
            }
        }

        // Get response from the model
        const result = await chat.sendMessage("Please analyze the content and provide a helpful response.");

        // Create a readable stream for the response
        const stream = new ReadableStream({
            async start(controller) {
                const response = result.response;
                const text = await response.text();
                
                // Send the text in chunks
                const chunks = text.split(' ');
                for (const chunk of chunks) {
                    const data = {
                        content: chunk + ' '
                    };
                    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
                    // Add a small delay between chunks for a more natural feel
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}