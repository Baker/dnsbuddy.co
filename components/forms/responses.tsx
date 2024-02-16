import FavIcon from "@/components/favicon";
import { Separator } from "@/components/ui/separator";
import type { DomainDnsResponse } from "@/types/dns";
import Link from "next/link";

export default function DnsFormResponse({
  response,
}: { response: DomainDnsResponse }) {
  return (
    <>
      <div className="">
        <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
          NS Records
        </h2>
        <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
        {response.nsRecords && response.nsRecords.length > 0
          ? response.nsRecords?.map((record: string) => (
              <Link
                key={record}
                className="text-left inline-flex w-full leading-4"
                href={`/tools/domain/${record}?dns_provider=cloudflare`}
              >
                <FavIcon domain={record} />
                <span className="underline decoration-dotted">{record}</span>
              </Link>
            ))
          : "No records available."}
        <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
          A Records
        </h2>
        <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
        {response.aRecords && response.aRecords.length > 0
          ? response.aRecords.map((record: string) => (
              <Link
                key={record}
                className="text-left inline-flex w-full leading-6"
                href={`/tools/whois/IP/${record}`}
              >
                <span className="underline decoration-dotted">{record}</span>
              </Link>
            ))
          : "No records available."}
        <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
          AAAA Records
        </h2>
        <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
        {response.aaaaRecords && response.aaaaRecords.length > 0
          ? response.aaaaRecords.map((record: string) => (
              <Link
                key={record}
                className="text-left inline-flex w-full leading-6"
                href={`/tools/whois/IP/${record}`}
              >
                <span className="underline decoration-dotted">{record}</span>
              </Link>
            ))
          : "No records available."}
        <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
          TXT Records
        </h2>
        <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
        {response.txtRecords && response.txtRecords.length > 0
          ? response.txtRecords.map((record: string) => (
              <div key={record} className="text-left">
                {record}
              </div>
            ))
          : "No records available."}
        <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
          MX Records
        </h2>
        <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
        {response.mxRecords && response.mxRecords.length > 0
          ? response.mxRecords.map((record: string) => (
              <div key={record} className="text-left">
                {record}
              </div>
            ))
          : "No records available."}
        <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
          CNAME Records
        </h2>
        <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
        {response.cnameRecords && response.cnameRecords.length > 0
          ? response.cnameRecords.map((record: string) => (
              <div key={record} className="text-left">
                {record}
              </div>
            ))
          : "No records available."}
        <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
          SOA Records
        </h2>
        <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
        {response.soaRecords && response.soaRecords.length > 0
          ? response.soaRecords.map((record: string) => (
              <div key={record} className="text-left">
                {record}
              </div>
            ))
          : "No records available."}
      </div>
    </>
  );
}
