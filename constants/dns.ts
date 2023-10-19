export interface BulkResponseList {
  id: number
  status: boolean
  ptrRecord: string | null
  aRecord: string | null
}

export interface ResponseItem {
  data: {
    AD: boolean;
    CD: boolean;
    RA: boolean;
    RD: boolean;
    TC: boolean;
    status: number;
    Question: QuestionItem;
    Answer: AnswerItem[];
  };
  success: boolean;
};

export interface ProviderResponse {
  provider: string;
  response: ResponseItem
}


interface QuestionItem {
  name: string;
  type: number;
}

interface AnswerItem {
  name: string;
  ttl: number;
  data: string;
  type: number;
  Expires: string | null;
  answer: number;
}
