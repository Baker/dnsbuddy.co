import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const isValidDomain = (url: string) => {
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
