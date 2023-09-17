import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  CrossCircledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { CheckCircle } from "lucide-react";
import { ResponseItem } from "@/constants/dns"

export default function DnsTable({ response }: { response: ResponseItem[] }) {
  if (!response || response.length === 0 || !response.some(item => item.response.data.Answer)) {
    return
  }
  return (
    <div className="rounded-lg bg-neutral-900 p-8">
      <Table id="dns-table">
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="">
              Location
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><InfoCircledIcon className="ml-1 w-[18px] h-[18px] text-black dark:text-white" /></TooltipTrigger>
                  <TooltipContent>
                    <p>This could be location or DNS Provider.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead className="text-left">Response</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {response.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {item.response.success &&
                  <CheckCircle className="animate-pulse text-green-600 w-[18px] h-[18px]" />
                }
                {!item.response.success &&
                  <CrossCircledIcon className="animate-pulse text-red-600 w-[18px] h-[18px]" />
                }
              </TableCell>
              <TableCell className="flex items-center min-h-[116px]">{item.provider} </TableCell>
              <TableCell className="text-left whitespace-nowrap ">
                {item.response.data.Answer.map((response, index) => (
                  <pre key={index}>
                    {response.data}
                  </pre>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
