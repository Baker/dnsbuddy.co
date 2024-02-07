import { buildMetadata } from "@/components/metadata";

export async function generateMetadata() {
  return buildMetadata({
    title: "DnsBuddy | Index",
    description: "An opensourced DNS Swiss Army Knife.",
    url: "https://DnsBuddy.co/",
  });
}

export default function Home() {
  return <main className="relative isolate overflow-hidden">Test</main>;
}
