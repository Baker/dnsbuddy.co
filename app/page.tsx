'use client';
import LocalQuery from '@/components/local-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
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
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  CommonRecordTypes,
  RecordTypeDescriptions,
} from '@/constants/record-types';
import { DOMAIN_REGEX } from '@/constants/regex';
import { useTransition, useState, useEffect } from 'react';
import { isValidDomain } from '@/lib/utils';
import DnsTable from '@/components/dns-table';
import { ProviderToUrlMapping } from '@/constants/api';
import { ResponseItem } from '@/constants/dns';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<ResponseItem[]>([]);
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

  const formSchema = z.object({
    query: z
      .string()
      .toLowerCase()
      .trim()
      .regex(DOMAIN_REGEX, { message: 'The URL you provided is not valid.' })
      .refine(isValidDomain, {
        message: 'The URL contains a protocol, please remove it.',
      }),
    record_type: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: searchParams.get('query') || '',
      record_type: recordValue,
    },
    mode: 'onChange',
  });
  const recordTypes = Object.keys(CommonRecordTypes);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (response.length > 0) {
      // Handle Multiple queries easier, by resetting state.
      setResponse([]);
    }

    startTransition(async () => {
      for (const provider of Object.keys(ProviderToUrlMapping)) {
        const response = await fetch(`/api/${provider}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const responseData = await response.json();
          setResponse((prevResponse) => [
            ...prevResponse,
            { provider, response: responseData },
          ]);
        }
      }
    });
    router.push(`/?query=${values.query}&record_type=${values.record_type}`, {
      scroll: false,
    });
  }
  return (
    <main className='relative isolate overflow-hidden'>
      <div className=' mx-auto max-w-2xl px-6 pb-8 pt-56 text-center sm:pb-20 lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl'>
          DNS Lookups, made easy.
        </h1>
        <p className='mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400'>
          Making DNS Lookups, cleaner, easier and faster in one place.
        </p>
        <div className='mt-10 flex min-w-full items-center justify-center'>
          <div className='w-full md:w-1/2'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className=''>
                <FormField
                  control={form.control}
                  name='query'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className='min-w-0 flex-auto rounded-md border-0 bg-black/5 px-3.5 text-gray-600 shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-black dark:bg-white/5 dark:text-gray-200 dark:ring-white/10 dark:focus:ring-white sm:text-sm sm:leading-6'
                          {...field}
                          disabled={isPending}
                          placeholder={'example.com'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='inline-flex w-full pt-3'>
                  <FormField
                    control={form.control}
                    name='record_type'
                    render={({ field }) => (
                      <FormItem className='mr-6 w-3/4 text-gray-600 dark:text-gray-200'>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isPending}
                          name='record_type'
                        >
                          <FormControl>
                            <SelectTrigger>
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
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    disabled={isPending}
                    className='h-full w-1/2'
                  >
                    <MagnifyingGlassIcon className='' />{' '}
                    {isPending ? 'Digging..' : 'Dig'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className=' mx-auto max-w-4xl px-6 pt-14 sm:pb-20 lg:px-8'>
        {response ? <DnsTable response={response} /> : ''}
      </div>
    </main>
  );
}
