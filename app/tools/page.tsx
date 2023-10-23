import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import type { Metadata } from 'next';

const ToolsList = [
  {
    name: 'Bulk FCrDNS',
    description:
      'Bulk check Forward-confirmed reverse DNS, up to 100 IP Addresses/Domains.',
    link: '/tools/bulk-fcrdns',
  },
  // {
  //     name: 'Bulk DNS Lookup',
  //     description: 'Bulk check DNS records for up to 100 IP Addresses/Domains.',
  //     link: '/tools/bulk-lookup'
  // },
  // {
  //     name: 'WhoIS',
  //     description: 'Check the WhoIS Information for a given domain or IP Address.',
  //     link: '/tools/whois'
  // },
  // {
  //     name: 'DMARC Analyzer',
  //     description: 'Checks the domains DMARC record, and analyzes the current record.',
  //     link: '/tools/dmarc-analyzer'
  // },
  // {
  //     name: 'SPF Analyzer',
  //     description: 'Checks the domains SPF record, and analyzes the current record.',
  //     link: '/tools/spf-analyzer'
  // },
  {
    name: 'Suggestion',
    description:
      'We love feedback, and want to build what you need, so let us know.',
    link: 'https://github.com/Baker/dnsbuddy.co/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=%5BFB%5D',
  },
];

export const metadata: Metadata = {
  title: 'Other Tools | DnsBuddy',
  description: 'This page contains a list of the various other DNS related tools we maintain today.',
};

export default function Tools() {
  return (
    <main className='relative isolate overflow-hidden'>
      <div className=' mx-auto max-w-4xl px-6 pt-56 text-center lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl'>
          Tools
        </h1>
        <p className='m-auto max-w-2xl pt-2 text-neutral-600 dark:text-neutral-400'>
          Here are some other DNS related tools that we offer to the community.
          These have mostly been created by request or out of necessity.
        </p>
        <Separator className='my-4 bg-neutral-600 dark:bg-neutral-400' />
        <div className='grid-rows grid grid-cols-1 gap-4 pt-8 lg:grid-cols-2'>
          {ToolsList.map((tool) => (
            <Link
              href={tool.link}
              className='rounded-md bg-neutral-100 p-8 dark:bg-neutral-900'
              key={tool.name}
            >
              <h2 className='text-lg font-semibold'>{tool.name}</h2>
              <span className='text-neutral-600 dark:text-neutral-400'>
                {tool.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
