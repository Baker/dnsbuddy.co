import type { Metadata } from "next";

export function buildMetadata({
  title,
  description,
  url,
}: { title: string; description: string; url: string }): Metadata {
  return {
    title: title,
    description: description,
    icons: [
      {
        rel: "apple-touch-icon",
        sizes: "32x32",
        url: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
    manifest: "/manifest.webmanifest",
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
    openGraph: {
      title: title,
      description: description,
      url: url,
      siteName: "DnsBuddy",
      locale: "en_US",
      type: "website",
    },
  };
}
