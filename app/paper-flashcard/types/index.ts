export interface FlashCard {
  content: string;
  hashtags: string[];
}

export interface StyleOptions {
  gradients: string[];
}

export interface FlashCardContent {
  intro: string;
  researcher: string;
  question: string;
  method: string;
  findings: string;
  implications: string;
  closing: string;
}
