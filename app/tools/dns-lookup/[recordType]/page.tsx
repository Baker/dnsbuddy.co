import { DnsLookUpForm } from "@/components/forms/forms";
import { buildMetadata } from "@/components/metadata";
import { CommonRecordTypes } from "@/types/record-types";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: { params: { recordType?: string; query?: string } }) {
  return buildMetadata({
    title: "WHOIS Lookup | DNSBuddy.co",
    description:
      "The WHOIS lookup tool allows you to query the WHOIS database for information about a domain name or IP address.",
    url: `https://DnsBuddy.co/tools/dns-lookup/${params.recordType}/`,
  });
}

export default function DnsLookup({
  params,
}: { params: { recordType?: string; query?: string } }) {
  if (
    params.recordType &&
    // biome-ignore lint: This isn't an issue.
    !CommonRecordTypes.hasOwnProperty(
      params.recordType.toUpperCase() as keyof typeof CommonRecordTypes,
    )
  ) {
    redirect("/tools/dns-lookup");
  }
  return (
    <main className="relative isolate overflow-hidden">
      <div className="mx-auto px-6 pt-56 text-center lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
          Lookup a {params.recordType?.toUpperCase()} record..
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
          Making DNS Lookups, cleaner, easier and faster in one place.
        </p>
        <div className="mt-10">
          <DnsLookUpForm recordType={params.recordType} query={params.query} />
        </div>
      </div>
    </main>
  );
}
