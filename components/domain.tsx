"use client";
import { DnsForm, DomainForm } from "@/components/forms/forms";
import { Link2Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function DomainPage({ domain }: { domain: string }) {
  const [logoError, setLogoError] = useState(false);
  return (
    <>
      <DomainForm domain={domain} />
      <div className="inline-flex w-full justify-between pb-2">
        <h1 className="text-xl md:text-xl font-bold tracking-tight text-center pt-4 text-black dark:text-white justify-start">
          Results:{" "}
          <Link
            href={domain}
            className="underline decoration-dotted inline-flex items-center pl-2"
          >
            {!logoError ? (
              <Image
                alt={`${domain} icon`}
                width={12}
                height={12}
                src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
                className="w-4 h-4 mr-1"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Link2Icon className="w-4 h-4 mr-1" />
            )}
            {domain}
          </Link>
        </h1>
        <div className="justify-end">
          <DnsForm />
        </div>
      </div>
    </>
  );
}
