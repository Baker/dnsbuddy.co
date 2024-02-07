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
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
          Uh, f*ck.
        </h1>
        <p className="mx-auto mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400 md:w-3/4 lg:w-1/2">
          Welp, something broke, but thankfully we got logging and will be on it
          shortly.
        </p>
      </div>
    </main>
  );
}
