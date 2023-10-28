export interface BulkFCrDNSResponseList {
  status: boolean;
  ptrRecord?: string;
  aRecord?: string;
}

export interface BulkResponseList {
  status: boolean;
  provider: string;
  query: string;
  response: string[];
}

export interface ResponseList {
  status: boolean;
  provider: string;
  response: string[];
}