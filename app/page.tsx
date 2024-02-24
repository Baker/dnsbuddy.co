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
    <main className="relative isolate overflow-hidden px-6 max-w-xl justify-center items-center mx-auto">
      <div className="mx-auto pt-24 md:pt-56 text-left">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-black dark:text-white">
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
      <div className="mt-10 mb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white">
          Let's check out a domain
        </h2>
        <p className="mt-4 leading-6 text-neutral-600 dark:text-neutral-400">
          This tool will run a few different checks, think of as{" "}
          <code className="bg-black/5 dark:bg-white/5 px-2 py-1 rounded border font-mono text-sm">
            dig ANY
          </code>{" "}
          and more. It will give you a good overview of the DNS records for a
          domain.
        </p>
        <DomainForm />
        <p className="text-sm text-right pt-2 text-neutral-500 dark:text-neutral-500">
          Not sure? Check out an example for:{" "}
          <Link
            className="underline decoration-dotted"
            href="/tools/domain/francispbaker.com"
          >
            francispbaker.com
          </Link>
        </p>
      </div>
    </main>
  );
}
