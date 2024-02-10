import { BulkFCrDNSForm } from "@/components/forms/forms";
import { buildMetadata } from "@/components/metadata";

export async function generateMetadata() {
  return buildMetadata({
    title:
      "Bulk Forward Confirmation reverse DNS (FCrDNS) Lookup | DNSBuddy.co",
    description:
      "This tool allows you to look up to 100 different IP Addresses and check to make sure they perform a forward confirmation reverse DNS (FCrDNS).",
    url: "https://DnsBuddy.co/tools/bulk-fcrdns",
    slogan: "Bulk FCrDNS (Forward-confirmed reverse DNS) Record lookup.",
  });
}

export default function BulkFCrDNS() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="mx-auto px-6 pt-56 text-center lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Bulk FCrDNS Lookup
        </h1>
        <p className="mx-auto mt-4 max-w-2xl leading-6 text-neutral-600 dark:text-neutral-400">
          Effortlessly validate up to 100 IP addresses with this tool, ensuring
          they successfully perform Forward Confirmation reverse DNS (FCrDNS).
          Verify and enhance the integrity of your IP addresses effortlessly.
        </p>
        <BulkFCrDNSForm />
      </div>
    </main>
  );
}
