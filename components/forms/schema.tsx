import * as z from 'zod';
import {
  bulkLengthCheck,
  isValidDomain,
  isValidUrl,
  stringToList,
} from '@/lib/utils';

import { WhoIsTypes } from '@/lib/constants/api';

export const dnsLookupFormSchema = z.object({
  query: z
    .string()
    .toLowerCase()
    .trim()
    .min(3, { message: 'The URL is not long enough.' })
    .refine(isValidDomain, {
      message: 'The URL contains a protocol, please remove it.',
    }),
  record_type: z.string(),
});

export const bulkFCrDNSFormSchema = z.object({
  query: z.string().toLowerCase().trim().refine(bulkLengthCheck, {
    message: 'The length of the list exceeds the max allowed of 100.',
  }),
  dns_provider: z.string(),
});

export const bulkDnsLookup = z.object({
  query: z
    .string()
    .toLowerCase()
    .trim()
    .refine(bulkLengthCheck, {
      message: 'The length of the list exceeds the max allowed of 100.',
    })
    .superRefine((val, ctx) => {
      const domainList = stringToList(val);
      for (const domainKey in domainList) {
        const domain = domainList[domainKey];
        if (isValidUrl(domain)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `We have found a URL including protocol. domain=${domain}`,
          });
        }
      }
    }),
  dns_provider: z.string(),
  record_type: z.string(),
});

export const whoIsFormSchema = z.object({
  query: z
    .string()
    .toLowerCase()
    .trim()
    .min(3, { message: 'The URL is not long enough.' })
    .refine(isValidDomain, {
      message: 'The URL contains a protocol, please remove it.',
    }),
  type: z
    .string()
    .min(3, { message: 'Please select a valid type.' })
    .refine((val) => Object.keys(WhoIsTypes).includes(val), {
      message: 'The type is not a valid WhoIs type.',
    }),
});
