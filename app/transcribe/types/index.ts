export interface TranscriptionSegment {
  startTime: number;
  endTime: number;
  text: string;
  id?: number;
  seek?: number;
  tokens?: number[];
  temperature?: number;
  avg_logprob?: number;
  compression_ratio?: number;
  no_speech_prob?: number;
}

export interface TranscriptionResult {
  fileName: string;
  audioDuration: string;
  textLength: number;
  transcriptionDate: Date;
  segments: TranscriptionSegment[];
}

export interface TranscriptionApiResponse {
  duration: number;
  text: string;
  segments: Array<{
    start: number;
    end: number;
    text: string;
    id?: number;
    seek?: number;
    tokens?: number[];
    temperature?: number;
    avg_logprob?: number;
    compression_ratio?: number;
    no_speech_prob?: number;
  }>;
}

export interface Language {
  code: string;
  name: string;
}