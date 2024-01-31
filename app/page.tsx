import { DnsLookUpForm } from "@/components/forms/forms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DnsBuddy | Index",
  description: "Your friendly neighborhood DNS lookup tool.",
  twitter: {
    card: "summary",
    title: "Index",
    description: "Your friendly neighborhood DNS lookup tool.",
  },
  openGraph: {
    title: "Index",
    description: "Your friendly neighborhood DNS lookup tool.",
    url: "https://DnsBuddy.co",
    siteName: "DnsBuddy",
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="mx-auto px-6 pt-56 text-center lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
          DNS Lookups, made easy.
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
          Making DNS Lookups, cleaner, easier and faster in one place.
        </p>
        <div className="mt-10">
          <DnsLookUpForm path={"/"} />
        </div>
      </div>
    </main>
  );
}
