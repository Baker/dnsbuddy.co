"use client";

import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import {
  bulkDnsLookup,
  bulkFCrDNSFormSchema,
  dnsLookupFormSchema,
  dnsSchema,
  domainSchema,
  whoIsFormSchema,
} from "@/components/forms/schema";
import {
  BulkDnsLookupColumnDef,
  BulkFCrDNSColumnDef,
  DnsLookupColumnDef,
} from "@/components/tables/columns";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProviderToLabelMapping, ProviderToUrlMapping } from "@/constants/api";
import type {
  BulkFCrDNSResponseList,
  BulkResponseList,
  ResponseList,
} from "@/types/data";
import type { DomainDnsResponse, ResponseItem } from "@/types/dns";
import { CommonRecordTypes } from "@/types/record-types";
import { WhoIsTypes } from "@/types/whois";
import { Link2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
  redirect,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function DnsLookUpForm({
  recordType,
  query,
}: { recordType?: string; query?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<ResponseList[]>([]);
  const recordTypes = Object.keys(CommonRecordTypes);
  const [lastSubmitted, setLastSubmitted] = useState<{
    query: string | undefined;
    record_type: string | undefined;
  } | null>(null);

  const recordValue =
    recordType &&
    // biome-ignore lint: This isn't an issue.
    CommonRecordTypes.hasOwnProperty(
      recordType.toUpperCase() as keyof typeof CommonRecordTypes,
    )
      ? recordType.toUpperCase()
      : undefined;

  useEffect(() => {
    if (
      query &&
      recordValue &&
      (!lastSubmitted ||
        lastSubmitted.query !== query ||
        lastSubmitted.record_type !== recordValue)
    ) {
      // Checks if the form is valid and if not redirects to the dns-lookup homepage.
      const result = dnsLookupFormSchema.safeParse({
        query: query,
        record_type: recordValue,
      });

      if (!result.success) {
        redirect("/tools/dns-lookup");
      }
      onSubmit(result.data);
      setLastSubmitted(result.data);
    }
  }, [query, recordValue, lastSubmitted]);

  const form = useForm<z.infer<typeof dnsLookupFormSchema>>({
    resolver: zodResolver(dnsLookupFormSchema),
    defaultValues: {
      query: query || "",
      record_type: recordValue,
    },
    mode: "onChange",
  });

  async function fetchProviderData(
    provider: string,
    values: z.infer<typeof dnsLookupFormSchema>,
  ) {
    const query = await fetch(`/api/${provider}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!query.ok) {
      throw new Error(
        `Error: DnsLookupForm status=${query.status} provider=${provider}`,
      );
    }

    const queryData: ResponseItem = await query.json();
    const answers =
      // biome-ignore lint: This is handled later
      queryData.data?.Answer?.map((resp: any) => {
        if (resp.type === 16 && !resp.data.startsWith('"')) {
          return `"${resp.data}"`;
        }
        if (resp.type !== 46) {
          return resp.data;
        }
      }) || [];

    return {
      status: answers.length > 0 ? queryData.success : false,
      provider:
        ProviderToLabelMapping[provider as keyof typeof ProviderToLabelMapping],
      response: answers,
    };
  }

  async function onSubmit(values: z.infer<typeof dnsLookupFormSchema>) {
    if (response.length > 0) {
      setResponse([]);
    }

    startTransition(async () => {
      if (
        values.query.toLowerCase() !== query?.toLowerCase() ||
        values.record_type.toLowerCase() !== recordValue?.toLowerCase()
      ) {
        router.push(`/tools/dns-lookup/${values.record_type}/${values.query}`);
        return;
      }

      for (const provider of Object.keys(ProviderToUrlMapping)) {
        const providerData = await fetchProviderData(provider, values);
        setResponse((prevResponse) => [...prevResponse, providerData]);
      }
    });
  }
  return (
    <>
      <div className="mx-auto flex max-w-2xl items-center justify-center">
        <div className="w-full md:w-1/2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Query</FormLabel>
                    <FormControl>
                      <Input
                        className="min-w-0 flex-auto bg-black/5 px-3.5 text-gray-600 shadow-sm dark:bg-white/5 dark:text-gray-200 sm:text-sm sm:leading-6"
                        {...field}
                        disabled={isPending}
                        placeholder={"example.com"}
                      />
                    </FormControl>
                    <FormDescription className="sr-only">
                      This is where you input your domain or IP Address that you
                      want to look up the DNS results for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="inline-flex w-full pt-3">
                <FormField
                  control={form.control}
                  name="record_type"
                  render={({ field }) => (
                    <FormItem className="mr-6 w-3/4 text-gray-600 dark:text-gray-200 ">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                        name="record_type"
                      >
                        <FormControl>
                          <SelectTrigger className="bg-black/5 dark:bg-white/5">
                            <SelectValue placeholder="Select record type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {recordTypes.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="sr-only">
                        This is where you select the record type you want to
                        look up the DNS records for.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-full w-1/2 text-black"
                >
                  <MagnifyingGlassIcon className="" />{" "}
                  {isPending ? "Digging.." : "Dig"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="mx-auto max-w-full pb-20 pt-8 md:max-w-4xl">
        {response.length > 0 ? (
          <DataTable
            data={response}
            columns={DnsLookupColumnDef}
            pagination={false}
            download={true}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export function BulkFCrDNSForm() {
  const [response, setResponse] = useState<BulkFCrDNSResponseList[]>([]);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof bulkFCrDNSFormSchema>>({
    resolver: zodResolver(bulkFCrDNSFormSchema),
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof bulkFCrDNSFormSchema>) {
    if (response.length > 0) {
      // Handle Multiple queries easier, by resetting state.
      setResponse([]);
    }

    startTransition(async () => {
      const IpAddressString = values.query;
      const IpAddressList = IpAddressString.split("\n");
      const deduplicatedList = Array.from(new Set(IpAddressList));

      for (const ip of deduplicatedList) {
        const ptr_record = await fetch(`/api/${values.dns_provider}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: ip, record_type: "PTR" }),
        });
        const ptrRecord: ResponseItem = await ptr_record.json();
        if (ptrRecord?.data?.Answer?.[0].data) {
          const a_record = await fetch(`/api/${values.dns_provider}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: ptrRecord?.data?.Answer?.[0].data,
              record_type: "A",
            }),
          });
          const aRecord: ResponseItem = await a_record.json();
          setResponse((prevResponse) => [
            ...prevResponse,
            {
              status: aRecord?.data?.Answer?.[0].data === ip,
              aRecord: ip,
              ptrRecord: ptrRecord?.data?.Answer?.[0].data,
            },
          ]);
        } else {
          setResponse((prevResponse) => [
            ...prevResponse,
            {
              status: false,
              aRecord: ip,
              ptrRecord: ptrRecord?.data?.Answer?.[0].data,
            },
          ]);
        }
      }
    });
  }
  return (
    <>
      <div className="mx-auto flex max-w-2xl items-center justify-center">
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">IP Address List</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter up to 100 IP Addresses, separated by a new line"
                        rows={10}
                        {...field}
                        disabled={isPending}
                        className="bg-black/5 px-3.5 leading-6 text-gray-600 shadow-sm dark:bg-white/5 dark:text-gray-200"
                      />
                    </FormControl>
                    <FormDescription className="sr-only">
                      Input the list of IP Addresses that you want to look up
                      the and verify the FCrDNS is valid. Please know each IP
                      Address is separated by a new line.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="inline-flex w-full pb-2 pt-3">
                <FormField
                  control={form.control}
                  name="dns_provider"
                  render={({ field }) => (
                    <FormItem className="mr-3 w-3/4 text-gray-600 dark:text-gray-200">
                      <Select
                        onValueChange={field.onChange}
                        disabled={isPending}
                        name="dns_provider"
                      >
                        <FormControl>
                          <SelectTrigger className="bg-black/5 px-3.5 text-gray-600 dark:bg-white/5 dark:text-gray-200">
                            <SelectValue placeholder="Select DNS Provider/location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(ProviderToLabelMapping).map(
                            (value: string) => (
                              <SelectItem key={value} value={value}>
                                {
                                  ProviderToLabelMapping[
                                    value as keyof typeof ProviderToLabelMapping
                                  ]
                                }
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription className="sr-only">
                        This is where you select the DNS Provider you want us to
                        use.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-full w-1/2 text-black"
                >
                  {isPending ? "Checking.." : "Check"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="mx-auto max-w-full pb-20 pt-8 md:max-w-4xl">
        {response.length > 0 ? (
          <DataTable
            data={response}
            columns={BulkFCrDNSColumnDef}
            pagination={true}
            download={true}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export function BulkDnsLookupForm() {
  const [response, setResponse] = useState<BulkResponseList[]>([]);
  const [isPending, startTransition] = useTransition();

  const recordTypes = Object.keys(CommonRecordTypes);

  const form = useForm<z.infer<typeof bulkDnsLookup>>({
    resolver: zodResolver(bulkDnsLookup),
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof bulkDnsLookup>) {
    if (response.length > 0) {
      // Handle Multiple queries easier, by resetting state.
      setResponse([]);
    }

    startTransition(async () => {
      const domainList = values.query.split("\n");

      for (const domain in domainList) {
        const query = await fetch(`/api/${values.dns_provider}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: domainList[domain],
            record_type: values.record_type,
          }),
        });

        if (!query.ok) {
          throw new Error(
            `Error: DnsLookupForm status=${query.status} provider=${values.dns_provider}`,
          );
        }
        const responseData: ResponseItem = await query.json();
        const answers: string[] = [];
        for (const item in responseData.data.Answer) {
          const resp = responseData.data.Answer[item];
          if (resp.type === 16 && !resp.data.startsWith('"')) {
            answers.push(`"${resp.data}"`);
          } else if (resp.type !== 46) {
            answers.push(resp.data);
          }
        }
        setResponse((prevResponse) => [
          ...prevResponse,
          {
            status: responseData.success,
            provider:
              ProviderToLabelMapping[
                values.dns_provider as keyof typeof ProviderToLabelMapping
              ],
            query: domainList[domain],
            record_type: values.record_type,
            response: answers,
          },
        ]);
      }
    });
  }
  return (
    <>
      <div className="mx-auto flex max-w-2xl items-center justify-center">
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">IP Address List</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter up to 100 IP Addresses/Domains, separated by a new line"
                        rows={10}
                        {...field}
                        disabled={isPending}
                        className="bg-black/5 px-3.5 leading-6 text-gray-600 shadow-sm dark:bg-white/5 dark:text-gray-200"
                      />
                    </FormControl>
                    <FormDescription className="sr-only">
                      Input the list of IP Addresses/Domains that you want to
                      look up any DNS Record for. Please know each IP
                      Address/Domain is separated by a new line.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="float-right w-full text-right">
                <div className="inline-flex w-full pb-2 pt-3">
                  <FormField
                    control={form.control}
                    name="dns_provider"
                    render={({ field }) => (
                      <FormItem className="mr-4 w-1/2 text-gray-600 dark:text-gray-200">
                        <Select
                          onValueChange={field.onChange}
                          disabled={isPending}
                          name="dns_provider"
                        >
                          <FormControl>
                            <SelectTrigger className="bg-black/5 px-3.5 text-gray-600 dark:bg-white/5 dark:text-gray-200">
                              <SelectValue placeholder="Select DNS Provider/location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(ProviderToLabelMapping).map(
                              (value: string) => (
                                <SelectItem key={value} value={value}>
                                  {
                                    ProviderToLabelMapping[
                                      value as keyof typeof ProviderToLabelMapping
                                    ]
                                  }
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription className="sr-only">
                          This is where you select the DNS Provider you want us
                          to use.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="record_type"
                    render={({ field }) => (
                      <FormItem className=" w-1/2 text-gray-600 dark:text-gray-200 ">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isPending}
                          name="record_type"
                        >
                          <FormControl>
                            <SelectTrigger className="bg-black/5 dark:bg-white/5">
                              <SelectValue placeholder="Select record type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {recordTypes.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="sr-only">
                          This is where you select the record type you want to
                          look up the DNS records for.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-full w-32 text-black"
                >
                  {isPending ? "Checking.." : "Check"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="mx-auto max-w-full pb-20 pt-8 md:max-w-4xl">
        {response.length > 0 ? (
          <DataTable
            data={response}
            columns={BulkDnsLookupColumnDef}
            pagination={true}
            download={true}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export function WhoisForm({
  whoisType,
  query,
}: { whoisType?: string; query?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<[]>();
  const [lastSubmitted, setLastSubmitted] = useState<{
    query: string | undefined;
    type: string | undefined;
  } | null>(null);

  const whoisValue =
    whoisType && (whoisType.toUpperCase() as keyof typeof WhoIsTypes)
      ? whoisType.toUpperCase()
      : undefined;
  query = query ? decodeURIComponent(query.toLowerCase()) : undefined;

  useEffect(() => {
    if (
      query &&
      whoisValue &&
      (!lastSubmitted ||
        lastSubmitted.query !== query ||
        lastSubmitted.type !== whoisValue)
    ) {
      // Checks if the form is valid and if not redirects to the whois homepage.
      const result = whoIsFormSchema.safeParse({
        query: query,
        type: whoisValue,
      });

      if (!result.success) {
        redirect("/tools/whois");
      }
      onSubmit(result.data);
      setLastSubmitted(result.data);
    }
  }, [query, whoisValue, lastSubmitted]);

  const form = useForm<z.infer<typeof whoIsFormSchema>>({
    resolver: zodResolver(whoIsFormSchema),
    defaultValues: {
      query: query || "",
      type: whoisValue || "",
    },
    mode: "onChange",
  });

  async function fetchWhoIsData(values: z.infer<typeof whoIsFormSchema>) {
    const query = await fetch("/api/whois", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    setResponse(await query.json());
  }

  async function onSubmit(values: z.infer<typeof whoIsFormSchema>) {
    if (response !== undefined) {
      // Handle Multiple queries easier, by resetting state.
      setResponse(undefined);
    }

    startTransition(async () => {
      if (
        values.type.toLowerCase() !== whoisValue?.toLowerCase() ||
        values.query.toLowerCase() !== query?.toLowerCase()
      ) {
        router.push(`/tools/whois/${values.type}/${values.query}`);
        return;
      }
      await fetchWhoIsData(values);
    });
  }
  return (
    <>
      <div className="mx-auto flex max-w-2xl items-center justify-center px-4">
        <div className="w-full md:w-1/2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Query</FormLabel>
                    <FormControl>
                      <Input
                        className="min-w-0 flex-auto bg-black/5 px-3.5 text-gray-600 shadow-sm dark:bg-white/5 dark:text-gray-200 sm:text-sm sm:leading-6"
                        {...field}
                        disabled={isPending}
                        placeholder={"example.com"}
                      />
                    </FormControl>
                    <FormDescription className="sr-only">
                      This is where you input your domain or IP Address that you
                      want to look up the WhoIS results for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mb-1 inline-flex w-full pt-3">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="mr-6 w-3/4 text-gray-600 dark:text-gray-200 ">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                        name="type"
                      >
                        <FormControl>
                          <SelectTrigger className="bg-black/5 dark:bg-white/5">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(WhoIsTypes).map((value: string) => (
                            <SelectItem key={value} value={value}>
                              {WhoIsTypes[value as keyof typeof WhoIsTypes]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="sr-only">
                        This is where you select the type you want to look up
                        the WHOIS data for.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-full w-1/2 text-black"
                >
                  <MagnifyingGlassIcon className="" />{" "}
                  {isPending ? "Digging.." : "Dig"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      {response !== undefined ? (
        <div className="mx-auto flex max-w-2xl items-center justify-center pt-4">
          <code className="text-left">
            {Object.keys(response).map((resp: string) => (
              <div key={resp}>
                {resp}: {String(response[resp as keyof typeof response])}
                <br />
              </div>
            ))}
          </code>
        </div>
      ) : null}
    </>
  );
}

export function DomainForm({ domain }: { domain?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain: domain || "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof domainSchema>) {
    startTransition(async () => {
      if (values.domain.toLowerCase() !== domain?.toLowerCase()) {
        router.push(
          `/tools/domain/${values.domain}?dns_provider=${ProviderToLabelMapping.cloudflare}`,
        );
        return;
      }
    });
  }

  return (
    <>
      <div className="flex">
        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="inline-flex w-full pt-3"
            >
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem className="mr-4 w-full space-y-0 bg-black/5 dark:bg-white/5">
                    <FormLabel className="sr-only">Domain</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder={"example.com"}
                      />
                    </FormControl>
                    <FormDescription className="sr-only">
                      This is where you input your domain that you want to look
                      up run the DNS Any against.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending}
                className="h-10 w-1/2 text-black"
              >
                <MagnifyingGlassIcon className="" />{" "}
                {isPending ? "Digging.." : "Dig"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export function DnsForm({ domain }: { domain: string }) {
  const router = useRouter();
  const params = useParams();
  const queryParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<DomainDnsResponse>();
  const paramsDnsProvider = queryParams.get("dns_provider");
  const [logoError, setLogoError] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<{
    domain: string | undefined;
    dns_provider: string | undefined;
  } | null>(null);
  const dns_provider =
    paramsDnsProvider &&
    Object.keys(ProviderToLabelMapping).includes(paramsDnsProvider)
      ? paramsDnsProvider
      : ProviderToLabelMapping.cloudflare.toLowerCase();

  const form = useForm<z.infer<typeof dnsSchema>>({
    resolver: zodResolver(dnsSchema),
    defaultValues: {
      domain: domain,
      dns_provider: dns_provider,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (
      domain &&
      dns_provider &&
      (!lastSubmitted ||
        lastSubmitted.domain !== domain ||
        lastSubmitted.dns_provider !== dns_provider)
    ) {
      // Checks if the form is valid and if not redirects to the dns-lookup homepage.
      const result = dnsSchema.safeParse({
        domain: domain,
        dns_provider: dns_provider,
      });

      if (!result.success) {
        redirect("/");
      }
      onSubmit(result.data);
      setLastSubmitted(result.data);
    }
  }, [domain, dns_provider, lastSubmitted]);

  async function onSubmit(values: z.infer<typeof dnsSchema>) {
    if (response !== undefined) {
      // Handle Multiple queries easier, by resetting state.
      setResponse(undefined);
    }

    startTransition(async () => {
      if (
        values.dns_provider.toLowerCase() !== paramsDnsProvider ||
        values.domain !== domain
      ) {
        router.push(
          `/tools/domain/${values.domain}?dns_provider=${values.dns_provider}`,
        );
        return;
      }

      setResponse({ domain: domain });

      for (const recordType of Object.keys(CommonRecordTypes)) {
        const response = await fetch(`/api/${values.dns_provider}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: params.domain,
            record_type: recordType,
          }),
        });
        const records = await response.json();
        const answers: string[] = [];
        for (const item in records.data.Answer) {
          const resp = records.data.Answer[item];
          if (resp.type === 16 && !resp.data.startsWith('"')) {
            answers.push(`"${resp.data}"`);
          } else if (resp.type !== 46) {
            answers.push(resp.data);
          }
        }
        setResponse((prevResponse: DomainDnsResponse | undefined) => ({
          ...prevResponse,
          domain: prevResponse?.domain || "",
          [`${recordType.toLowerCase()}Records`]: answers,
        }));
      }
    });
    console.log(response);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-lg justify-center items-center mx-auto"
        >
          <div className="inline-flex w-full">
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem className="mr-4 w-full space-y-0 bg-black/5 dark:bg-white/5">
                  <FormLabel className="sr-only">Domain</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder={"example.com"}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is where you input your domain that you want to look up
                    the WHOIS results for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 w-1/2 text-black"
            >
              <MagnifyingGlassIcon className="" />{" "}
              {isPending ? "Digging.." : "Dig"}
            </Button>
          </div>
          <div className="inline-flex w-full justify-between pb-2">
            <h1 className="text-xl md:text-xl font-bold tracking-tight text-center pt-4 text-black dark:text-white justify-start">
              Results:{" "}
              <Link
                href={domain}
                className="underline decoration-dotted inline-flex items-center pl-2"
              >
                {!logoError ? (
                  <Image
                    alt={`${domain} icon`}
                    width={12}
                    height={12}
                    src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
                    className="w-4 h-4 mr-1"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <Link2Icon className="w-4 h-4 mr-1" />
                )}
                {domain}
              </Link>
            </h1>
            <div className="justify-end pt-3 inline-flex">
              <FormField
                control={form.control}
                name="dns_provider"
                render={({ field }) => (
                  <FormItem className="w-full space-y-0 bg-black/5 text-gray-600 dark:bg-white/5 dark:text-gray-200">
                    <FormLabel className="sr-only">Domain</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          onSubmit(form.getValues());
                        }}
                        disabled={isPending}
                        name="dns_provider"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                ProviderToLabelMapping[
                                  paramsDnsProvider as keyof typeof ProviderToLabelMapping
                                ]
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(ProviderToLabelMapping).map(
                            (value: string) => (
                              <SelectItem key={value} value={value}>
                                {
                                  ProviderToLabelMapping[
                                    value as keyof typeof ProviderToLabelMapping
                                  ]
                                }
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="sr-only">
                      This is where you input your domain that you want to look
                      up the WHOIS results for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
      <div className="mx-auto max-w-full pb-20 pt-8">
        {response !== undefined ? (
          <>
            <div className="">
              <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
                NS Records
              </h2>
              <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
              {response.nsRecords
                ? response.nsRecords?.map((record: string) => (
                    <Link
                      key={record}
                      className="text-left inline-flex w-full leading-6"
                      href={`/tools/domain/${record}?dns_provider=cloudflare`}
                    >
                      <Image
                        alt={`${record} icon`}
                        width={24}
                        height={24}
                        src={`https://icons.duckduckgo.com/ip3/${record}.ico`}
                        className="mr-1"
                      />{" "}
                      <span className="underline decoration-dotted">
                        {record}
                      </span>
                    </Link>
                  ))
                : "No records available."}
              <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
                A Records
              </h2>
              <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
              {response.aRecords
                ? response.aRecords.map((record: string) => (
                    <Link
                      key={record}
                      className="text-left inline-flex w-full leading-6"
                      href={`/tools/whois/IP/${record}`}
                    >
                      <span className="underline decoration-dotted">
                        {record}
                      </span>
                    </Link>
                  ))
                : "No records available."}
              <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
                AAAA Records
              </h2>
              <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
              {response.aaaaRecords
                ? response.aaaaRecords.map((record: string) => (
                    <Link
                      key={record}
                      className="text-left inline-flex w-full leading-6"
                      href={`/tools/whois/IP/${record}`}
                    >
                      <span className="underline decoration-dotted">
                        {record}
                      </span>
                    </Link>
                  ))
                : "No records available."}
              <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
                TXT Records
              </h2>
              <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
              {response.txtRecords
                ? response.txtRecords.map((record: string) => (
                    <div key={record} className="text-left">
                      {record}
                    </div>
                  ))
                : "No records available."}
              <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
                MX Records
              </h2>
              <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
              {response.mxRecords
                ? response.mxRecords.map((record: string) => (
                    <div key={record} className="text-left">
                      {record}
                    </div>
                  ))
                : "No records available."}
              <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
                CNAME Records
              </h2>
              <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
              {response.cnameRecords
                ? response.cnameRecords.map((record: string) => (
                    <div key={record} className="text-left">
                      {record}
                    </div>
                  ))
                : "No records available."}
              <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
                SOA Records
              </h2>
              <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
              {response.soaRecords
                ? response.soaRecords.map((record: string) => (
                    <div key={record} className="text-left">
                      {record}
                    </div>
                  ))
                : "No records available."}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
