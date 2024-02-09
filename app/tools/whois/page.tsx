import { WhoisForm } from "@/components/forms/forms";
import { buildMetadata } from "@/components/metadata";

export async function generateMetadata() {
  return buildMetadata({
    title: "WHOIS Lookup | DNSBuddy.co",
    description:
      "The WHOIS lookup tool allows you to query the WHOIS database for information about a domain name or IP address.",
    url: "https://DnsBuddy.co/tools/whois/",
  });
}

export default function WHOISPage({
  params,
}: { params: { whoisType?: string; query?: string } }) {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="mx-auto pt-56 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
          WHOIS Lookups
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
          Perform WHOIS lookups with ease.
        </p>
        <div className="mt-10">
          <WhoisForm whoisType={params.whoisType} query={params.query} />
        </div>
      </div>
    </main>
  );
}
