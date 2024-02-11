import { DomainForm } from "@/components/forms/forms";
import { buildMetadata } from "@/components/metadata";
import Link from "next/link";

export async function generateMetadata() {
  return buildMetadata({
    title: "DnsBuddy | Index",
    description: "An opensourced DNS Swiss Army Knife.",
    url: "https://DnsBuddy.co/",
    slogan: "DNS Swissy Army Tool",
  });
}

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-xl px-6 pt-56 text-left lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Welcome to DnsBuddy 👋
        </h1>
        <p className="mt-4 leading-6 text-neutral-600 dark:text-neutral-400">
          DnsBuddy is an opensourced DNS Swiss Army Knife. We have a wide range
          of{" "}
          <Link className="underline font-semibold" href="/tools">
            tools
          </Link>{" "}
          to help you with your DNS needs. We are constantly trying to bring
          these tools to you in the most user-friendly way possible.
        </p>
      </div>
      <DomainForm />
    </main>
  );
}
