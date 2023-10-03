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
import { ResponseItem } from '@/constants/dns';

export default function DnsTable({ response }: { response: ResponseItem[] }) {
  if (
    !response ||
    response.length === 0 ||
    !response.some((item) => item.response.data.Answer)
  ) {
    return;
  }
  return (
    <div className='rounded-lg border bg-neutral-100 p-8 dark:bg-neutral-900'>
      <Table id='dns-table'>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Status</TableHead>
            <TableHead className=''>
              Location
              {/* Starting Tooltip */}
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
                {item.provider}
              </TableCell>
              <TableCell className='whitespace-nowrap text-left '>
                {item.response.data.Answer.map((response, index) => {
                  if (response.type == 46) {
                    // This will remove the RRSIG which some DOH return.
                    return null;
                  }
                  if (response.type == 16 && !response.data.startsWith('"')) {
                    // For whatever reason Google doesn't return TXT with "" but the rest do.
                    return (
                      <pre key={index}>&quot;{response.data}&quot;</pre>
                    )
                  }
                  return (
                    <pre key={index}>{response.data}</pre>
                  )
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
