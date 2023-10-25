export interface BulkResponseList {
  status: boolean;
  ptrRecord?: string;
  aRecord?: string;
}

export interface ResponseList {
  location: string;
  response: string[];
}