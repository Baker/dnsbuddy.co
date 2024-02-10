import { BulkDnsLookupForm } from "@/components/forms/forms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk DNS Lookup | DnsBuddy",
  description:
    "Explore information across 100 domains or IP addresses (IPv4 or IPv6) using our versatile tool. We currently support a wide range of DNS record types, including TXT, CNAME, MX, NS, A, AAAA, PTR, SOA, and more. Select  to run the test against any of our nine DNS providers and locations. Plus, enjoy the convenience of exporting this data for your personalized use at any time.",
  twitter: {
    card: "summary",
    title: "Bulk DNS Lookup",
    description:
      "Explore information across 100 domains or IP addresses (IPv4 or IPv6) using our versatile tool. We currently support a wide range of DNS record types, including TXT, CNAME, MX, NS, A, AAAA, PTR, SOA, and more. Select  to run the test against any of our nine DNS providers and locations. Plus, enjoy the convenience of exporting this data for your personalized use at any time.",
  },
  openGraph: {
    title: "Bulk DNS Lookup",
    description:
      "Explore information across 100 domains or IP addresses (IPv4 or IPv6) using our versatile tool. We currently support a wide range of DNS record types, including TXT, CNAME, MX, NS, A, AAAA, PTR, SOA, and more. Select  to run the test against any of our nine DNS providers and locations. Plus, enjoy the convenience of exporting this data for your personalized use at any time.",
    url: "https://DnsBuddy.co/tools/bulk-dns-lookup",
    siteName: "DnsBuddy",
    locale: "en_US",
    type: "website",
  },
};

export default function BulkFCrDNS() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="mx-auto px-6 pt-56 text-center lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Bulk DNS Lookup
        </h1>
        <p className="mx-auto max-w-2xl mt-4 leading-6 text-neutral-600 dark:text-neutral-400">
          Empower yourself to effortlessly lookup multiple domains or IP
          addresses for specific record types, tailored to your needs. Choose
          your preferred DNS provider or location, ensuring accurate and
          customized results with ease. You can also export your results to CSV.
        </p>
        <BulkDnsLookupForm />
      </div>
    </main>
  );
}
