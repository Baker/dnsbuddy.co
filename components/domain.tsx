"use client";
import { DnsForm } from "@/components/forms/forms";
import { redirect } from "next/navigation";

export default function DomainPage({ domain }: { domain: string }) {
  if (!domain) {
    redirect("/");
  }

  return (
    <>
      <DnsForm domain={domain} />
    </>
  );
}
