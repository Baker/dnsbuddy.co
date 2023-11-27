'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { CommonRecordTypes } from '@/lib/types/record-types';
import { useTransition, useState, useEffect } from 'react';
import {
  ProviderToLabelMapping,
  ProviderToUrlMapping,
  WhoIsTypes,
} from '@/lib/constants/api';
import {
  BulkResponseList,
  ResponseList,
  BulkFCrDNSResponseList,
} from '@/lib/types/data';
import { ResponseItem } from '@/lib/types/dns';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  bulkDnsLookup,
  bulkFCrDNSFormSchema,
  dnsLookupFormSchema,
  whoIsFormSchema,
} from '@/components/forms/schema';
import { DataTable } from '@/components/tables/data-table';
import {
  BulkDnsLookupColumnDef,
  BulkFCrDNSColumnDef,
  DnsLookupColumnDef,
} from '@/components/tables/columns';
import { DomainWhoisData, IPWhoisData } from '@/lib/types/whois';
import {
  DomainWhoisResponse,
  IpAddressWhoisReponse,
} from '@/components/forms/responses';

export function DnsLookUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<ResponseList[]>([]);
  const searchParams = useSearchParams();
  const recordType = searchParams.get('record_type');

  useEffect(() => {
    if (
      !CommonRecordTypes.hasOwnProperty(
        recordType as keyof typeof CommonRecordTypes
      ) &&
      recordType != null
    ) {
      router.push(
        `/${
          searchParams.get('query') != null
            ? `?query=${searchParams.get('query')}`
            : ''
        }`,
        { scroll: false }
      );
    }
  }, []);

  let recordValue;
  if (recordType != null) {
    if (
      CommonRecordTypes.hasOwnProperty(
        recordType as keyof typeof CommonRecordTypes
      )
    ) {
      recordValue = recordType;
    } else {
      recordValue = undefined;
    }
  } else {
    recordValue = undefined;
  }
  const recordTypes = Object.keys(CommonRecordTypes);

  const form = useForm<z.infer<typeof dnsLookupFormSchema>>({
    resolver: zodResolver(dnsLookupFormSchema),
    defaultValues: {
      query: searchParams.get('query') || '',
      record_type: recordValue,
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof dnsLookupFormSchema>) {
    if (response.length > 0) {
      // Handle Multiple queries easier, by resetting state.
      setResponse([]);
    }

    startTransition(async () => {
      for (const provider of Object.keys(ProviderToUrlMapping)) {
        const query = await fetch(`/api/${provider}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!query.ok) {
          throw new Error(
            `Error: DnsLookupForm status=${query.status} provider=${provider}`
          );
        } else {
          const queryData: ResponseItem = await query.json();
          const answers: string[] = [];
          for (const item in queryData.data.Answer) {
            const resp = queryData.data.Answer[item];
            if (resp.type == 16 && !resp.data.startsWith('"')) {
              answers.push(`"${resp.data}"`);
            } else if (resp.type != 46) {
              answers.push(resp.data);
            }
          }
          setResponse((prevResponse) => [
            ...prevResponse,
            {
              status: queryData.success,
              provider:
                ProviderToLabelMapping[
                  provider as keyof typeof ProviderToLabelMapping
                ],
              response: answers,
            },
          ]);
        }
      }
    });
    router.push(`/?query=${values.query}&record_type=${values.record_type}`, {
      scroll: false,
    });
  }
  return (
    <>
      <div className='mx-auto flex max-w-2xl items-center justify-center'>
        <div className='w-full md:w-1/2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=''>
              <FormField
                control={form.control}
                name='query'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='sr-only'>Query</FormLabel>
                    <FormControl>
                      <Input
                        className='min-w-0 flex-auto rounded-md bg-black/5 px-3.5 text-gray-600 shadow-sm dark:bg-white/5 dark:text-gray-200 sm:text-sm sm:leading-6'
                        {...field}
                        disabled={isPending}
                        placeholder={'example.com'}
                      />
                    </FormControl>
                    <FormDescription className='sr-only'>
                      This is where you input your domain or IP Address that you
                      want to look up the DNS results for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='inline-flex w-full pt-3'>
                <FormField
                  control={form.control}
                  name='record_type'
                  render={({ field }) => (
                    <FormItem className='mr-6 w-3/4 text-gray-600 dark:text-gray-200 '>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                        name='record_type'
                      >
                        <FormControl>
                          <SelectTrigger className='bg-black/5 dark:bg-white/5'>
                            <SelectValue placeholder='Select record type' />
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
                      <FormDescription className='sr-only'>
                        This is where you select the record type you want to
                        look up the DNS records for.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  disabled={isPending}
                  className='h-full w-1/2 text-black'
                >
                  <MagnifyingGlassIcon className='' />{' '}
                  {isPending ? 'Digging..' : 'Dig'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className='mx-auto max-w-full pb-20 pt-8 md:max-w-4xl'>
        {response.length > 0 ? (
          <DataTable
            data={response}
            columns={DnsLookupColumnDef}
            pagination={false}
            download={true}
          />
        ) : (
          ''
        )}
      </div>
    </>
  );
}

export function BulkFCrDNSForm() {
  const dnsProviders = Object.keys(ProviderToLabelMapping);
  const [response, setResponse] = useState<BulkFCrDNSResponseList[]>([]);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof bulkFCrDNSFormSchema>>({
    resolver: zodResolver(bulkFCrDNSFormSchema),
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof bulkFCrDNSFormSchema>) {
    if (response.length > 0) {
      // Handle Multiple queries easier, by resetting state.
      setResponse([]);
    }

    startTransition(async () => {
      const IpAddressString = values.query;
      const IpAddressList = IpAddressString.split('\n');
      const deduplicatedList = Array.from(new Set(IpAddressList));

      for (const ip of deduplicatedList) {
        const ptr_record = await fetch(`/api/${values.dns_provider}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: ip, record_type: 'PTR' }),
        });
        const ptrRecord: ResponseItem = await ptr_record.json();
        if (ptrRecord?.data?.Answer?.[0].data) {
          const a_record = await fetch(`/api/${values.dns_provider}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: ptrRecord?.data?.Answer?.[0].data,
              record_type: 'A',
            }),
          });
          const aRecord: ResponseItem = await a_record.json();
          setResponse((prevResponse) => [
            ...prevResponse,
            {
              status: aRecord?.data?.Answer?.[0].data == ip,
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
      <div className='mx-auto flex max-w-2xl items-center justify-center'>
        <div className='w-full'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-8'>
              <FormField
                control={form.control}
                name='query'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='sr-only'>IP Address List</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter up to 100 IP Addresses, separated by a new line'
                        rows={10}
                        {...field}
                        disabled={isPending}
                        className='bg-black/5 px-3.5 leading-6 text-gray-600 shadow-sm dark:bg-white/5 dark:text-gray-200'
                      />
                    </FormControl>
                    <FormDescription className='sr-only'>
                      Input the list of IP Addresses that you want to look up
                      the and verify the FCrDNS is valid. Please know each IP
                      Address is separated by a new line.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='inline-flex w-full pb-2 pt-3'>
                <FormField
                  control={form.control}
                  name='dns_provider'
                  render={({ field }) => (
                    <FormItem className='mr-3 w-3/4 text-gray-600 dark:text-gray-200'>
                      <Select
                        onValueChange={field.onChange}
                        disabled={isPending}
                        name='dns_provider'
                      >
                        <FormControl>
                          <SelectTrigger className='bg-black/5 px-3.5 text-gray-600 dark:bg-white/5 dark:text-gray-200'>
                            <SelectValue placeholder='Select DNS Provider/location' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dnsProviders.map((value) => (
                            <SelectItem key={value} value={value}>
                              {
                                ProviderToLabelMapping[
                                  value as keyof typeof ProviderToLabelMapping
                                ]
                              }
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className='sr-only'>
                        This is where you select the DNS Provider you want us to
                        use.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  disabled={isPending}
                  className='h-full w-1/2 text-black'
                >
                  {isPending ? 'Checking..' : 'Check'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className='mx-auto max-w-full pb-20 pt-8 md:max-w-4xl'>
        {response.length > 0 ? (
          <DataTable
            data={response}
            columns={BulkFCrDNSColumnDef}
            pagination={true}
            download={true}
          />
        ) : (
          ''
        )}
      </div>
    </>
  );
}

export function BulkDnsLookupForm() {
  const dnsProviders = Object.keys(ProviderToLabelMapping);
  const [response, setResponse] = useState<BulkResponseList[]>([]);
  const [isPending, startTransition] = useTransition();

  const recordTypes = Object.keys(CommonRecordTypes);

  const form = useForm<z.infer<typeof bulkDnsLookup>>({
    resolver: zodResolver(bulkDnsLookup),
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof bulkDnsLookup>) {
    if (response.length > 0) {
      // Handle Multiple queries easier, by resetting state.
      setResponse([]);
    }

    startTransition(async () => {
      const domainList = values.query.split('\n');

      for (const domain in domainList) {
        const query = await fetch(`/api/${values.dns_provider}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: domainList[domain],
            record_type: values.record_type,
          }),
        });

        if (!query.ok) {
          throw new Error(
            `Error: DnsLookupForm status=${query.status} provider=${values.dns_provider}`
          );
        } else {
          const responseData: ResponseItem = await query.json();
          const answers: string[] = [];
          for (const item in responseData.data.Answer) {
            const resp = responseData.data.Answer[item];
            if (resp.type == 16 && !resp.data.startsWith('"')) {
              answers.push(`"${resp.data}"`);
            } else if (resp.type != 46) {
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
      }
    });
  }
  return (
    <>
      <div className='mx-auto flex max-w-2xl items-center justify-center'>
        <div className='w-full'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-8'>
              <FormField
                control={form.control}
                name='query'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='sr-only'>IP Address List</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter up to 100 IP Addresses/Domains, separated by a new line'
                        rows={10}
                        {...field}
                        disabled={isPending}
                        className='bg-black/5 px-3.5 leading-6 text-gray-600 shadow-sm dark:bg-white/5 dark:text-gray-200'
                      />
                    </FormControl>
                    <FormDescription className='sr-only'>
                      Input the list of IP Addresses/Domains that you want to
                      look up any DNS Record for. Please know each IP
                      Address/Domain is separated by a new line.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='float-right w-full text-right'>
                <div className='inline-flex w-full pb-2 pt-3'>
                  <FormField
                    control={form.control}
                    name='dns_provider'
                    render={({ field }) => (
                      <FormItem className='mr-4 w-1/2 text-gray-600 dark:text-gray-200'>
                        <Select
                          onValueChange={field.onChange}
                          disabled={isPending}
                          name='dns_provider'
                        >
                          <FormControl>
                            <SelectTrigger className='bg-black/5 px-3.5 text-gray-600 dark:bg-white/5 dark:text-gray-200'>
                              <SelectValue placeholder='Select DNS Provider/location' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dnsProviders.map((value) => (
                              <SelectItem key={value} value={value}>
                                {
                                  ProviderToLabelMapping[
                                    value as keyof typeof ProviderToLabelMapping
                                  ]
                                }
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className='sr-only'>
                          This is where you select the DNS Provider you want us
                          to use.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='record_type'
                    render={({ field }) => (
                      <FormItem className=' w-1/2 text-gray-600 dark:text-gray-200 '>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isPending}
                          name='record_type'
                        >
                          <FormControl>
                            <SelectTrigger className='bg-black/5 dark:bg-white/5'>
                              <SelectValue placeholder='Select record type' />
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
                        <FormDescription className='sr-only'>
                          This is where you select the record type you want to
                          look up the DNS records for.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type='submit'
                  disabled={isPending}
                  className='h-full w-32 text-black'
                >
                  {isPending ? 'Checking..' : 'Check'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className='mx-auto max-w-full pb-20 pt-8 md:max-w-4xl'>
        {response.length > 0 ? (
          <DataTable
            data={response}
            columns={BulkDnsLookupColumnDef}
            pagination={true}
            download={true}
          />
        ) : (
          ''
        )}
      </div>
    </>
  );
}

export function WhoisForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<DomainWhoisData | IPWhoisData>();
  const [domainType, setDomainType] = useState<Boolean>();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof whoIsFormSchema>>({
    resolver: zodResolver(whoIsFormSchema),
    defaultValues: {
      query: searchParams.get('query') || '',
      type: searchParams.get('type') || '',
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof whoIsFormSchema>) {
    if (response !== undefined) {
      // Handle Multiple queries easier, by resetting state.
      setResponse(undefined);
    }

    startTransition(async () => {
      const query = await fetch(`/api/whois`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      setDomainType(
        WhoIsTypes[values.type as keyof typeof WhoIsTypes] === WhoIsTypes.DOMAIN
      );
      setResponse(await query.json());
    });
    router.push(`/tools/whois?query=${values.query}&type=${values.type}`, {
      scroll: false,
    });
  }
  return (
    <>
      <div className='mx-auto flex max-w-2xl items-center justify-center px-4'>
        <div className='w-full md:w-1/2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=''>
              <FormField
                control={form.control}
                name='query'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='sr-only'>Query</FormLabel>
                    <FormControl>
                      <Input
                        className='min-w-0 flex-auto rounded-md bg-black/5 px-3.5 text-gray-600 shadow-sm dark:bg-white/5 dark:text-gray-200 sm:text-sm sm:leading-6'
                        {...field}
                        disabled={isPending}
                        placeholder={'example.com'}
                      />
                    </FormControl>
                    <FormDescription className='sr-only'>
                      This is where you input your domain or IP Address that you
                      want to look up the WhoIS results for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='mb-1 inline-flex w-full pt-3'>
                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem className='mr-6 w-3/4 text-gray-600 dark:text-gray-200 '>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                        name='type'
                      >
                        <FormControl>
                          <SelectTrigger className='bg-black/5 dark:bg-white/5'>
                            <SelectValue placeholder='Select type' />
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
                      <FormDescription className='sr-only'>
                        This is where you select the type you want to look up
                        the WHOIS data for.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  disabled={isPending}
                  className='h-full w-1/2 text-black'
                >
                  <MagnifyingGlassIcon className='' />{' '}
                  {isPending ? 'Digging..' : 'Dig'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      {response !== undefined ? (
          Object.keys(response).length === 0 ? (
            <p className='mx-auto my-6 rounded-md border bg-black/5 p-8 dark:bg-white/5 text-gray-600 dark:text-gray-300 md:max-w-4xl'>No data available, this could be due to an invalid domain, or IP Address.</p>
          ) : (
            domainType ? (
              <DomainWhoisResponse response={response as DomainWhoisData} />
            ) : !domainType ? (
              <IpAddressWhoisReponse response={response as IPWhoisData} />
            ) : null
          )
        ) : null}
    </>
  );
}
