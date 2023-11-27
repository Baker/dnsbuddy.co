import { BulkDnsLookupForm } from '@/components/forms/forms';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bulk DNS Lookup | DnsBuddy',
  description:
    'This tool allows users to check multiple domains or IP addresses for a specific record type against a chosen DNS provider or location.',
  twitter: {
    card: 'summary',
    title: 'Bulk DNS Lookup',
    description:
      'This tool allows users to check multiple domains or IP addresses for a specific record type against a chosen DNS provider or location.',
  },
  openGraph: {
    title: 'Bulk DNS Lookup',
    description:
      'This tool allows users to check multiple domains or IP addresses for a specific record type against a chosen DNS provider or location.',
    url: 'https://DnsBuddy.co',
    siteName: 'DnsBuddy',
    locale: 'en_US',
    type: 'website',
  },
};

export default function BulkFCrDNS() {
  return (
    <main className='relative isolate overflow-hidden'>
      <div className='mx-auto px-6 pt-56 text-center lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl'>
          Bulk DNS Lookup
        </h1>
        <p className='mx-auto mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400 md:w-3/4 lg:w-1/2'>
          This tool allows users to check multiple domains or IP addresses for a
          specific record type against a chosen DNS provider or location.
        </p>
        <BulkDnsLookupForm />
      </div>
    </main>
  );
}
