export const price = 39000
export const originalPrice = 99000
export const discountValue = Math.round(((originalPrice - price) / originalPrice) * 100);

export const PRO_FEATURES = [
  'Unlimited Access to All AI Models:',
  'GPT-4o, Claude, Gemini, Llama, etc.',
  'Unlimited Document Uploads',
  'Unlimited Image Attachments',
  'Unlimited Saved History',
  'Chat Organizer, Foldering, & Pins',
  'AI Document Creator & Editor',
  'AI Python Programmer',
  'AI Tools Search Engine',
  'Private AI Web Chat',
  'Unlimited AI Transcription',
  'Unlimited AI Natural Voice Creator',
  'Direct WhatsApp Support',
  'Unlimited Free Apps',
] as const

export const FREE_FEATURES = [
  'Chatbot AI tanpa History',
  'Image Generator Non-HD',
  'Document Chat tanpa History',
  'Science Paper Flashcards',
  'Tanpa Support WhatsApp',
] as const
