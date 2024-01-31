import { BulkFCrDNSForm } from "@/components/forms/forms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Forward Confirmation reverse DNS (FCrDNS) Lookup | DnsBuddy",
  description:
    "This tool allows you to look up to 100 different IP Addresses and check to make sure they perform a forward confirmation reverse DNS (FCrDNS).",
  twitter: {
    card: "summary",
    title: "Bulk Forward Confirmation reverse DNS (FCrDNS) Lookup",
    description:
      "This tool allows you to look up to 100 different IP Addresses and check to make sure they perform a forward confirmation reverse DNS (FCrDNS).",
  },
  openGraph: {
    title: "Bulk Forward Confirmation reverse DNS (FCrDNS) Lookup",
    description:
      "This tool allows you to look up to 100 different IP Addresses and check to make sure they perform a forward confirmation reverse DNS (FCrDNS).",
    url: "https://DnsBuddy.co/tools/bulk-fcrdns",
    siteName: "DnsBuddy",
    locale: "en_US",
    type: "website",
  },
};

export default function BulkFCrDNS() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="mx-auto px-6 pt-56 text-center lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
          Bulk FCrDNS Lookup
        </h1>
        <p className="mx-auto mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400 md:w-3/4 lg:w-1/2">
          Effortlessly validate up to 100 IP addresses with this tool, ensuring
          they successfully perform Forward Confirmation reverse DNS (FCrDNS).
          Verify and enhance the integrity of your IP addresses effortlessly
        </p>
        <BulkFCrDNSForm />
      </div>
    </main>
  );
}
