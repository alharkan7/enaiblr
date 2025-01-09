export type MessageContent = string | Array<{
    type: 'text';
    text: string;
} | {
    type: 'image_url';
    image_url: {
        url: string;
    };
}>;

export interface Source {
    title: string;
    url: string;
    content: string;
    score: number;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: MessageContent;
    sources?: Source[];
}