import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TxtImage, TxtTitle } from "@/types/parse";
import { useTheme } from "next-themes";
import Image from "next/image";

export function HandleTxtRecords({ record }: { record: string }) {
  const { theme } = useTheme();
  if (record.startsWith('"v=spf1')) {
    return null;
  }
  // removes the starting quote and end quote.
  const newRecord = record.substring(
    record.startsWith('"<') ? 2 : 1,
    record.length - 1,
  );

  const splitRecord =
    newRecord.split("=")[1] ||
    newRecord.split(":")[1] ||
    newRecord.split("ZOOM_verify_") ||
    newRecord.split("SFMC-");
  for (const title in TxtTitle) {
    if (newRecord.split("=")[0].toLowerCase().startsWith(title.toLowerCase())) {
      return (
        <div
          key={newRecord}
          className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
        >
          <Card
            key={newRecord}
            className="rounded p-6 bg-black/5 dark:bg-white/5 flex flex-col justify-between min-h-full"
          >
            <Image
              src={`/assets/logos/${theme === "system" ? "dark" : theme}/${
                (TxtImage as Record<string, string>)[title as unknown as string]
              }.svg`}
              height={120}
              width={120}
              alt={`${
                (TxtTitle as Record<string, string>)[title as unknown as string]
              } icon`}
              className="mx-auto w-48 h-24"
            />
            <CardHeader className="mx-auto w-full p-2 leading-4 mb-auto">
              <CardTitle className="text-xl font-semibold">
                {
                  (TxtTitle as Record<string, string>)[
                    title as unknown as string
                  ]
                }
              </CardTitle>
              <CardDescription
                className="text-wrap"
                style={{ overflowWrap: "break-word" }}
              >
                {splitRecord}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }
  }
  return null;
}
