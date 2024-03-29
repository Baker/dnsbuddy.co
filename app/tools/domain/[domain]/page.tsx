import { DnsForm } from "@/components/forms/forms";
import { buildMetadata } from "@/components/metadata";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: { params: { domain: string } }) {
  return buildMetadata({
    title: `${params.domain} - DnsBuddy.co`,
    description: "An opensourced DNS Swiss Army Knife.",
    url: `https://DnsBuddy.co/domain/${params.domain}`,
    slogan: `${params.domain} - DnsBuddy.co`,
  });
}

export default function Page({ params }: { params: { domain: string } }) {
  if (!params.domain) {
    redirect("/");
  }

  return (
    <main className="relative isolate overflow-hidden px-6 max-w-4xl justify-center items-center mx-auto">
      <div className="mx-auto pt-24 text-left">
        <DnsForm domain={params.domain} />
      </div>
    </main>
  );
}
