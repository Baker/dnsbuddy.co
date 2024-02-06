import { ImageMetadata } from "@/components/image-metadata";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function Image({
  params,
}: { params: { whoisType?: string; query?: string } }) {
  const slogan = `Lookup ${params.whoisType?.toLowerCase()} whois..`;
  return ImageMetadata({ slogan });
}
