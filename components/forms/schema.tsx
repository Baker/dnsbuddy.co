import {
  bulkLengthCheck,
  isValidASN,
  isValidDomain,
  isValidIpAddressV4,
  isValidIpAddressV6,
  isValidUrl,
  stringToList,
} from "@/lib/utils";
import * as z from "zod";

import { WhoIsTypes } from "@/types/whois";

export const dnsLookupFormSchema = z.object({
  query: z
    .string()
    .toLowerCase()
    .trim()
    .min(3, { message: "The URL is not long enough." })
    .refine(isValidDomain, {
      message: "The URL contains a protocol, please remove it.",
    }),
  record_type: z.string(),
});

export const bulkFCrDNSFormSchema = z.object({
  query: z.string().toLowerCase().trim().refine(bulkLengthCheck, {
    message: "The length of the list exceeds the max allowed of 100.",
  }),
  dns_provider: z.string(),
});

export const bulkDnsLookup = z.object({
  query: z
    .string()
    .toLowerCase()
    .trim()
    .refine(bulkLengthCheck, {
      message: "The length of the list exceeds the max allowed of 100.",
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

export const whoIsFormSchema = z
  .object({
    query: z
      .string()
      .toLowerCase()
      .trim()
      .min(3, { message: "The query is not long enough." })
      .refine(isValidDomain, {
        message: "The URL contains a protocol, please remove it.",
      }),
    type: z
      .string()
      .min(2, { message: "Please select a valid type." })
      .refine((val) => Object.keys(WhoIsTypes).includes(val), {
        message: "The type is not a valid WhoIs type.",
      }),
  })
  .refine(
    // Content this is checking if the IP is a valid IPv4 or IPv6 based on the type selected.
    (schema) => {
      if (
        WhoIsTypes[schema.type as keyof typeof WhoIsTypes] === WhoIsTypes.IP
      ) {
        return (
          isValidIpAddressV4(schema.query) || isValidIpAddressV6(schema.query)
        );
      }
      return true;
    },
    {
      message:
        "This input is not the expected IP Address format. Example of a valid submission: 127.0.0.1 OR 2001:0000:130F:0000:0000:09C0:876A:130B.",
      path: ["query"],
    },
  )
  .refine(
    // Content this is checking if the Domain is a valid IPv4 or IPv6 based on the type selected and if so directs them to select IP Address.
    (schema) => {
      if (
        WhoIsTypes[schema.type as keyof typeof WhoIsTypes] === WhoIsTypes.DOMAIN
      ) {
        return !(
          isValidIpAddressV4(schema.query) || isValidIpAddressV6(schema.query)
        );
      }
      return true;
    },
    {
      message:
        "This input is not the expected Domain format. Example of a valid submission: google.com.",
      path: ["query"],
    },
  );

export const domainSchema = z.object({
  domain: z
    .string()
    .toLowerCase()
    .trim()
    .min(3, { message: "The domain is not long enough." })
    .refine(isValidDomain, {
      message: "The URL contains a protocol, please remove it.",
    }),
});
