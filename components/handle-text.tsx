import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TxtImage, TxtTitle } from "@/types/parse";
import Image from "next/image";

export function HandleTxtRecords({ record }: { record: string }) {
  if (record.startsWith('"v=spf1')) {
    return null;
  }
  // removes the starting quote and end quote.
  const newRecord = record.substring(
    record.startsWith('"<') ? 2 : 1,
    record.length - 1,
  );
  for (const title in TxtTitle) {
    if (newRecord.split("=")[0].toLowerCase().startsWith(title.toLowerCase())) {
      return (
        <div key={newRecord} className="col-span-6 sm:col-span-3 md:col-span-2">
          <Card
            key={newRecord}
            className="rounded p-6 bg-black/5 dark:bg-white/5 flex flex-col justify-between min-h-full"
          >
            <Image
              src={`/assets/logos/${TxtImage[title]}-logos.svg`}
              height={120}
              width={120}
              alt="Contribution Icon"
              className="mx-auto w-48 h-24"
            />
            <CardHeader className="mx-auto w-full p-2 leading-4 mb-auto">
              <CardTitle className="text-xl font-semibold">
                {TxtTitle[title]}
              </CardTitle>
              <CardDescription
                className="text-wrap"
                style={{ overflowWrap: "break-word" }}
              >
                {newRecord.split("=")[1]}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }
  }
  return null;
}
