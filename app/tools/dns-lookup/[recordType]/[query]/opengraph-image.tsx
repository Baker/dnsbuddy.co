import { ImageMetadata } from "@/components/image-metadata";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function Image({
  params,
}: { params: { recordType?: string; query?: string } }) {
  const slogan = `Lookup a ${params.recordType?.toUpperCase()} record for ${
    params.query
  }..`;
  return ImageMetadata({ slogan });
}
