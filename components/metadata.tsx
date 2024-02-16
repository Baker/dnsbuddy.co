import type { Metadata } from "next";

export function buildMetadata({
  title,
  description,
  url,
  slogan,
}: {
  title: string;
  description: string;
  url: string;
  slogan?: string;
}): Metadata {
  const siteUrl = process.env.SITE_URL
    ? `${process.env.SITE_URL}`
    : "http://localhost:3000";
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
      images: [`${siteUrl}/api/og?slogan=${slogan}`],
    },
    openGraph: {
      title: title,
      description: description,
      url: url,
      siteName: "DnsBuddy",
      locale: "en_US",
      type: "website",
      images: {
        url: `${siteUrl}/api/og?slogan=${slogan}`,
      },
    },
    robots: {
      follow: true,
      index: true,
    },
  };
}
