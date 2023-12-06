export interface ResponseItem {
  data: {
    AD: boolean;
    CD: boolean;
    RA: boolean;
    RD: boolean;
    TC: boolean;
    Status: number;
    Question: QuestionItem[];
    Answer: AnswerItem[];
  };
  success: boolean;
}

export interface ProviderResponse {
  provider: string;
  response: ResponseItem;
}

interface QuestionItem {
  name: string;
  type: number;
}

export interface AnswerItem {
  name: string;
  TTL: number;
  data: string;
  type: number;
  Expires?: string;
}
