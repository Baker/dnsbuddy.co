import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const isValidDomain = (url: string): boolean => {
  if (url.startsWith('http://')) {
    return false;
  }
  if (url.startsWith('http//')) {
    return false;
  }
  if (url.startsWith('www.')) {
    return false;
  }
  return true;
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));


export const stringToList = (string: string): string[] => {
  const stringArray = string.split("\n");
  return stringArray;
}

export const bulkLengthCheck = (string: string): boolean => {
  const list = stringToList(string)
  return list.length <= 100
}

export const isValidIpAddress = (ipAddress: string): boolean => {
  const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
  return ipRegex.test(ipAddress);
}

export const timeUnix = (): number => {
  return parseInt((new Date().getTime() / 1000).toFixed(0))
}