export const price = 39000
export const originalPrice = 99000
export const discountValue = Math.round(((originalPrice - price) / originalPrice) * 100);

export const priceUS = 4.99
export const originalPriceUS = 19.99
export const discountValueUS = Math.round(((originalPriceUS - priceUS) / originalPriceUS) * 100);

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
  'Direct Email Support',
  'Unlimited Free Apps',
] as const

export const FREE_FEATURES = [
  'AI Chat Assistant without History',
  'Non-HD Image Generator',
  'Document Chat without History',
  'Science Paper Flashcards',
  'No Direct Support',
] as const
