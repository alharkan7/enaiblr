export type MessageContent = string | Array<{
    type: 'text';
    text: string;
} | {
    type: 'image_url';
    image_url: {
        url: string;
    };
}>;

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: MessageContent;
}