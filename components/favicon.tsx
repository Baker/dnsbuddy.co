import { extractRootDomain } from "@/lib/utils";
import { Link2Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useState } from "react";

export default function FavIcon({ domain }: { domain: string }) {
  const [logoError, setLogoError] = useState(false);
  return (
    <>
      {!logoError ? (
        <Image
          alt={`${domain} icon`}
          width={12}
          height={12}
          src={`https://icons.duckduckgo.com/ip3/${extractRootDomain(
            domain,
          )}.ico`}
          className="w-4 h-4 mr-1"
          onError={() => setLogoError(true)}
        />
      ) : (
        <Link2Icon className="w-4 h-4 mr-1" />
      )}
    </>
  );
}
