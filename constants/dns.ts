export interface ResponseItem {
    provider: string;
    response: {
        data: {
            AD: boolean,
            CD: boolean,
            RA: boolean,
            RD: boolean,
            TC: boolean,
            status: number,
            Question: QuestionItem[],
            Answer: AnswerItem[];
        },
        success: boolean
    }
}

interface QuestionItem {
    name: string,
    type: number
}

interface AnswerItem {
    name: string,
    ttl: number,
    data: string
    answer: number
}