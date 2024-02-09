export function whoisStringToJson(whoisString: string): Record<string, string> {
  const lines = whoisString.split("\n");
  const result: Record<string, string> = {};

  for (const line of lines) {
    const index = line.indexOf(":");
    if (index > -1) {
      const key = line.substring(0, index).trim();
      const value = line.substring(index + 1).trim();
      result[key] = value;
    }
  }

  return result;
}
