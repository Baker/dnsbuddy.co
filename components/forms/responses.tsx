import FavIcon from "@/components/favicon";
import { HandleTxtRecords } from "@/components/handle-text";
import { MxRecordColumnDef } from "@/components/tables/columns";
import { DataTable } from "@/components/tables/data-table";
import { Separator } from "@/components/ui/separator";
import type { DomainDnsResponse } from "@/types/dns";
import { parseMxRecords, parseSpfRecords } from "lib/parse";
import Link from "next/link";

export default function DnsFormResponse({
  response,
}: { response: DomainDnsResponse }) {
  return (
    <>
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
      <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400 mb-4" />
      <div className="grid grid-cols-12 gap-4">
        {response.txtRecords && response.txtRecords.length > 0
          ? response.txtRecords.map((record: string) => {
              const resp = HandleTxtRecords({ record: record });
              if (resp !== null) {
                const updatedTxtRecords = response.txtRecords?.filter(
                  (rc) => rc !== record,
                );
                response = { ...response, txtRecords: updatedTxtRecords };
                return <HandleTxtRecords record={record} />;
              }
            })
          : "No records available."}
      </div>

      {response.txtRecords && response.txtRecords.length > 0 ? (
        <>
          <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
            Other TXT Record
          </h2>
          <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
          {response.txtRecords.map((record: string) => {
            if (record.startsWith('"v=spf1')) {
              return null;
            }
            return (
              <div key={record} className="text-left">
                {record}
              </div>
            );
          })}
        </>
      ) : null}
      {response.txtRecords &&
      parseSpfRecords(response.txtRecords).length > 0 ? (
        <>
          <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
            SPF Record
          </h2>
          <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
          {parseSpfRecords(response.txtRecords as []).map((record) => (
            <div key={record} className="text-left">
              {record}
            </div>
          ))}
        </>
      ) : null}
      <h2 className="text-xl font-bold tracking-tight pt-4 text-black dark:text-white">
        MX Records
      </h2>
      <Separator className="my-1 bg-neutral-600 dark:bg-neutral-400" />
      {response.mxRecords && response.mxRecords.length > 0 ? (
        <DataTable
          data={parseMxRecords(response.mxRecords)}
          columns={MxRecordColumnDef}
          pagination={false}
          download={true}
        />
      ) : (
        "No records available."
      )}
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
    </>
  );
}
