import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CrossCircledIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { CheckCircle } from 'lucide-react';
import { ProviderResponse } from '@/constants/dns';
import { ProviderToLabelMapping } from '@/constants/api';

export default function DnsTable({ response }: { response: ProviderResponse[] }) {
  if (!response || response.length === 0) {
    return;
  }
  return (
    <div className='rounded-lg border bg-neutral-100 px-8 pt-8 dark:bg-neutral-900'>
      <Table id='dns-table'>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Status</TableHead>
            <TableHead className=''>
              Location
              {/* Starting Tooltip */}
              <div className='hidden md:contents'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoCircledIcon className='ml-1 h-[18px] w-[18px] text-black dark:text-white' />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This could be location or DNS Provider.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {/* Ending Tooltip */}
            </TableHead>
            <TableHead className='text-left'>Response</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {response.map((item, index) => (
            <TableRow key={index}>
              <TableCell className='font-medium'>
                {item.response.success && (
                  <CheckCircle className='h-[18px] w-[18px] animate-pulse text-green-600' />
                )}
                {!item.response.success && (
                  <CrossCircledIcon className='h-[18px] w-[18px] animate-pulse text-red-600' />
                )}
              </TableCell>
              <TableCell className='flex min-h-[116px] items-center'>
                {
                  ProviderToLabelMapping[
                  item.provider as keyof typeof ProviderToLabelMapping
                  ]
                }
              </TableCell>
              <TableCell className='whitespace-nowrap text-left '>
                {Array.isArray(item.response.data.Answer) ? (
                  item.response.data.Answer.map((response, index) => {
                    if (response.type == 46) {
                      // This will remove the RRSIG which some DOH return.
                      return null;
                    }
                    if (response.type == 16 && !response.data.startsWith('"')) {
                      // For whatever reason Google doesn't return TXT with "" but the rest do.
                      return <pre key={index}>&quot;{response.data}&quot;</pre>;
                    }
                    return <pre key={index}>{response.data}</pre>;
                  })
                ) : (
                  <p>
                    The record is not set.
                    {/* Starting Tooltip */}
                    <div className='hidden md:contents'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoCircledIcon className='ml-1 h-[18px] w-[18px] text-black dark:text-white' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              This is a generic response, we did not get a real
                              answer from the DNS provider for the select record
                              type.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {/* Ending Tooltip */}
                  </p>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div >
  );
}
