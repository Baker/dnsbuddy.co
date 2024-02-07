import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DnsBuddy | Index",
  description: "An opensourced DNS Swiss Army Knife.",
  twitter: {
    card: "summary",
    title: "Index",
    description: "An opensourced DNS Swiss Army Knife.",
  },
  openGraph: {
    title: "Index",
    description: "An opensourced DNS Swiss Army Knife.",
    url: "https://DnsBuddy.co",
    siteName: "DnsBuddy",
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return <main className="relative isolate overflow-hidden">Test</main>;
}
