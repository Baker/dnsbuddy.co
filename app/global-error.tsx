"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* biome-ignore lint: Skip for now, since you can't omit the statusCode */}
        <NextError statusCode={undefined as any} />
      </body>
    </html>
  );
}
