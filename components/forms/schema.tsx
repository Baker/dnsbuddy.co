import * as z from 'zod';
import {
  bulkLengthCheck,
  isValidDomain,
  isValidUrl,
  stringToList,
} from '@/lib/utils';

export const dnsLookupFormSchema = z.object({
  query: z.string().toLowerCase().trim().refine(isValidDomain, {
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
