import type { parsedMxRecords } from "@/types/parse";

export function parseMxRecords(records: string[]): parsedMxRecords[] {
  const parsedRecords = records.map((record) => {
    const [priorityStr, value] = record.split(" ");
    const priority = parseInt(priorityStr);
    return { priority, value };
  });
  parsedRecords.sort((a, b) => a.priority - b.priority);
  return parsedRecords;
}
