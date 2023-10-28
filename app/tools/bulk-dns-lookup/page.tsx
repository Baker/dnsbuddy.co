import { BulkDnsLookupForm } from '@/components/forms/forms';
import type { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Bulk DNS Lookup | DnsBuddy',
    description: 'This tool allows you to look up to 100 different IP Addresses and check to make sure they perform a forward confirmation reverse DNS (FCrDNS).',
};

export default function BulkFCrDNS() {
    return (
        <main className='relative isolate overflow-hidden'>
            <div className='mx-auto px-6 pt-56 text-center lg:px-8'>
                <h1 className='text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl'>
                    Bulk DNS Lookup
                </h1>
                <p className='mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400 md:w-3/4 lg:w-1/2 mx-auto'>
                    This tool allows you to lookup a 100 different domain records, for anything IP Address related we recommend using the <Link className="font-semibold underline dark:text-gray-300" href={`/tools/bulk-fcrdns`}>Bulk FCrDNS tool</Link>.
                </p>
                <BulkDnsLookupForm />
            </div>
        </main>
    );
}
