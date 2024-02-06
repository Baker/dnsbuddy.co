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
  return <main className="relative isolate overflow-hidden"></main>;
}
