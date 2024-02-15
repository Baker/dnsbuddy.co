import DomainPage from "@/components/domain";
import { buildMetadata } from "@/components/metadata";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  return buildMetadata({
    title: "DnsBuddy | Index",
    description: "An opensourced DNS Swiss Army Knife.",
    url: "https://DnsBuddy.co/",
    slogan: "DNS Swissy Army Tool",
  });
}

export default function Page({ params }: { params: { domain: string } }) {
  if (!params.domain) {
    redirect("/");
  }

  return (
    <main className="relative isolate overflow-hidden px-6 max-w-4xl justify-center items-center mx-auto">
      <div className="mx-auto pt-24 text-left">
        <DomainPage domain={params.domain} />
      </div>
    </main>
  );
}
