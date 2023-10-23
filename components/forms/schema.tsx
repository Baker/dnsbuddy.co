import * as z from 'zod';
import { isIpListLengthCheck, isValidDomain, isValidIpAddress } from '@/lib/utils';


export const dnsLookupFormSchema = z.object({
    query: z
        .string()
        .toLowerCase()
        .trim()
        .refine(isValidDomain, {
            message: 'The URL contains a protocol, please remove it.',
        })
    ,
    record_type: z.string(),
});


export const bulkFCrDNSFormSchema = z.object({
    query: z
        .string()
        .toLowerCase()
        .trim()
        .refine(isIpListLengthCheck, {
            message: 'The length of the list exceeds the max allowed of 100.',
        }),
    dns_provider: z.string()
});