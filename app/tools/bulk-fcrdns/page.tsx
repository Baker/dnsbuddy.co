'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { isIpListLengthCheck } from '@/lib/utils';
import { useTransition, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function BulkFCrDNS() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const formSchema = z.object({
    query: z.string().toLowerCase().trim().refine(isIpListLengthCheck, {
      message: 'The length of the list exceeds the max allowed of 100.',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
    mode: 'onChange',
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const IpAddressString = values.query;
      const IpAddressList = IpAddressString.split('\n');
      console.log(IpAddressList);
    });
  }
  return (
    <main className='relative isolate overflow-hidden'>
      <div className='mx-auto mb-8 max-w-2xl px-6 pt-56 text-center sm:pb-20 lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl'>
          Bulk FCrDNS Check
        </h1>
        <p className='mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400'>
          This tool allows you to look up to 100 different IP Addresses and
          check to make sure they perform a forward confirmation reverse DNS
          (FCrDNS).
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='mt-8'>
            <FormField
              control={form.control}
              name='query'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder='Enter up to 100 IP Addresses, separated by a new line'
                      rows={10}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={isPending}
              className='mt-2 h-full w-1/4'
            >
              {isPending ? 'Checking..' : 'Check'}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
