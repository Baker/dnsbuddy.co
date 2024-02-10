"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="relative isolate overflow-hidden">
      <div className="mx-auto px-6 pt-56 text-center lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Uh, f*ck.
        </h1>
        <p className="mt-4 leading-6 text-neutral-600 dark:text-neutral-400">
          Welp, something broke, but thankfully we got logging and will be on it
          shortly.
        </p>
      </div>
    </main>
  );
}
