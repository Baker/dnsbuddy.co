import { WhoisForm } from "@/components/forms/forms";
import { WhoIsTypes } from "@/types/whois";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "DnsBuddy | WHOIS Lookup",
  description: "Perform WHOIS lookups with ease.",
  twitter: {
    card: "summary",
    title: "WHOIS Lookup",
    description: "Perform WHOIS lookups with ease.",
  },
  openGraph: {
    title: "WHOIS Lookup",
    description: "Perform WHOIS lookups with ease.",
    url: "https://DnsBuddy.co/tools/whois",
    siteName: "DnsBuddy",
    locale: "en_US",
    type: "website",
  },
};

export default function WHOISPage({
  params,
}: { params: { whoisType?: string; query?: string } }) {
  if (
    params.whoisType &&
    // biome-ignore lint: This isn't an issue.
    !WhoIsTypes.hasOwnProperty(
      params.whoisType.toUpperCase() as keyof typeof WhoIsTypes,
    )
  ) {
    redirect("/tools/whois");
  }
  const query = params.query && params.query.length < 26 ? params.query : null;

  return (
    <main className="relative isolate overflow-hidden">
      <div className="mx-auto pt-56 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
          Lookup{" "}
          {
            WhoIsTypes[
              params.whoisType?.toUpperCase() as keyof typeof WhoIsTypes
            ]
          }{" "}
          whois
          {query ? (
            <>
              {" for "}
              <span className="underline">{query}</span>
            </>
          ) : null}
          ..
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
