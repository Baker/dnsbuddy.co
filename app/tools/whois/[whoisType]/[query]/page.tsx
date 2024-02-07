import { WhoisForm } from "@/components/forms/forms";
import { buildMetadata } from "@/components/metadata";
import { WhoIsTypes } from "@/types/whois";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: { params: { whoisType?: string; query?: string } }) {
  return buildMetadata({
    title: `Lookup ${params.whoisType?.toLowerCase()} whois for ${
      params.query
    } | DNSBuddy.co`,
    description: `The WHOIS Information for ${params.query} is available here.`,
    url: "https://DnsBuddy.co/tools/whois/",
  });
}

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
