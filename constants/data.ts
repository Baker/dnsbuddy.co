export interface BulkResponseList {
  id: number;
  status: boolean;
  ptrRecord?: string;
  aRecord?: string;
}

export interface ResponseList {
  id: number;
  location: string;
  response: string[];
}