"use client"

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
import {
    CommonRecordTypes,
    RecordTypeDescriptions,
} from '@/constants/record-types';
import { useTransition, useState, useEffect, startTransition } from 'react';
import { ProviderToLabelMapping, ProviderToUrlMapping } from '@/constants/api';
import { BulkResponseList, ResponseList } from '@/constants/data';
import { ProviderResponse, ResponseItem, AnswerItem } from '@/constants/dns';
import { useSearchParams, useRouter } from 'next/navigation';
import { bulkFCrDNSFormSchema, dnsLookupFormSchema } from '@/components/forms/schema';
import { DataTable } from '@/components/tables/data-table';
import { BulkFCrDNSColumnDef, DnsLookupColumnDef } from '@/components/tables/columns';

export function DnsLookUpForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [response, setResponse] = useState<ResponseList[]>([]);
    const searchParams = useSearchParams();
    const recordType = searchParams.get('record_type');

    useEffect(() => {
        if (
            !RecordTypeDescriptions.hasOwnProperty(
                recordType as keyof typeof RecordTypeDescriptions
            ) &&
            recordType != null
        ) {
            router.push(
                `/${searchParams.get('query') != null
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
            RecordTypeDescriptions.hasOwnProperty(
                recordType as keyof typeof RecordTypeDescriptions
            )
        ) {
            recordValue = recordType;
        } else {
            recordValue = undefined;
        }
    } else {
        recordValue = undefined;
    }

    const form = useForm<z.infer<typeof dnsLookupFormSchema>>({
        resolver: zodResolver(dnsLookupFormSchema),
        defaultValues: {
            query: searchParams.get('query') || '',
            record_type: recordValue,
        },
        mode: 'onChange',
    });
    const recordTypes = Object.keys(CommonRecordTypes);

    async function onSubmit(values: z.infer<typeof dnsLookupFormSchema>) {
        if (response.length > 0) {
            // Handle Multiple queries easier, by resetting state.
            setResponse([]);
        }

        startTransition(async () => {
            for (const provider of Object.keys(ProviderToUrlMapping)) {
                const query = await fetch(`/api/${provider}/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (!query.ok) {
                    throw new Error(`HTTP error! status: ${query.status}`);
                } else {
                    const queryData: ResponseItem = await query.json();
                    const answers: string[] = []
                    for (const item in queryData.data.Answer) {
                        const resp = queryData.data.Answer[item]
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
                            location: ProviderToLabelMapping[provider as keyof typeof ProviderToLabelMapping],
                            response: answers
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
            <div className='flex mx-auto items-center justify-center max-w-2xl'>
                <div className="w-full md:w-1/2">
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
                                            This is where you input your domain or IP Address that you want to look up the DNS results for.
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
                                            <FormDescription className='sr-only'>This is where you select the record type you want to look up the DNS records for.</FormDescription>
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
            <div className='mx-auto max-w-full md:max-w-4xl pt-8 pb-20'>
                {response.length > 0 ? <DataTable data={response} columns={DnsLookupColumnDef} pagination={false} download={true} /> : ''}
            </div>

        </>
    )

}

export function BulkFCrDNSForm() {
    const router = useRouter();
    const dnsProviders = Object.keys(ProviderToLabelMapping)
    const [response, setResponse] = useState<BulkResponseList[]>([]);
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

                const ptr_record = await fetch(`/api/${values.dns_provider}/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: ip, record_type: "PTR" }),
                })
                const ptrRecord: ResponseItem = await ptr_record.json()
                if (ptrRecord?.data?.Answer?.[0].data) {
                    const a_record = await fetch(`/api/${values.dns_provider}/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ query: ptrRecord?.data?.Answer?.[0].data, record_type: "A" }),
                    });
                    const aRecord: ResponseItem = await a_record.json()
                    setResponse((prevResponse) => [
                        ...prevResponse,
                        { status: aRecord?.data?.Answer?.[0].data == ip, aRecord: ip, ptrRecord: ptrRecord?.data?.Answer?.[0].data },
                    ]);
                } else {
                    setResponse((prevResponse) => [
                        ...prevResponse,
                        { status: false, aRecord: ip, ptrRecord: ptrRecord?.data?.Answer?.[0].data },
                    ]);
                }
            }
        })
    }
    return (
        <>
            <div className="flex mx-auto items-center justify-center max-w-2xl">
                <div className="w-full">
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
                                                className='bg-black/5 px-3.5 text-gray-600 shadow-sm dark:bg-white/5 dark:text-gray-200 leading-6'
                                            />
                                        </FormControl>
                                        <FormDescription className='sr-only'>Input the list of IP Addresses that you want to look up the and verify the FCrDNS is valid. Please know each IP Address is separated by a new line.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="inline-flex w-full pt-3 pb-2">
                                <FormField control={form.control}
                                    name='dns_provider'
                                    render={({ field }) => (
                                        <FormItem className=' mr-3 w-3/4 text-gray-600 dark:text-gray-200'>
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
                                            <FormDescription className='sr-only'>This is where you select the DNS Provider you want us to use.</FormDescription>
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
            <div className='mx-auto max-w-full md:max-w-4xl pt-8 pb-20'>
                {response.length > 0 ? <DataTable data={response} columns={BulkFCrDNSColumnDef} pagination={true} download={true} /> : ''}
            </div>
        </>
    )
}