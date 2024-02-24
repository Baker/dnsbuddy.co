"use client";

import { DataTableColumnHeader } from "@/components/tables/column-header";
import { Badge } from "@/components/ui/badge";
import type {
  BulkFCrDNSResponseList,
  BulkResponseList,
  ResponseList,
} from "@/types/data";
import type { parsedMxRecords } from "@/types/parse";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import type { ColumnDef, RowData } from "@tanstack/react-table";

export type ExtendedColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<TData, TValue> & {
  label?: string;
  isVisible?: boolean;
};

export const DnsLookupColumnDef: ExtendedColumnDef<ResponseList>[] = [
  {
    accessorKey: "status",
    cell: ({ row }) => {
      if (row.getValue("status")) {
        return (
          <CheckCircledIcon className="ml-4 h-[18px] w-[18px] animate-pulse text-green-600" />
        );
      }
      return (
        <CrossCircledIcon className="ml-4 h-[18px] w-[18px] animate-pulse text-red-600" />
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    label: "status",
  },
  {
    accessorKey: "provider",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Provider" />;
    },
    label: "provider",
  },
  { accessorKey: "response", header: "Response" },
];

export const BulkFCrDNSColumnDef: ExtendedColumnDef<BulkFCrDNSResponseList>[] =
  [
    {
      accessorKey: "status",
      cell: ({ row }) => {
        if (row.getValue("status")) {
          return (
            <CheckCircledIcon className="ml-4 h-[18px] w-[18px] animate-pulse text-green-600" />
          );
        }
        return (
          <CrossCircledIcon className="ml-4 h-[18px] w-[18px] animate-pulse text-red-600" />
        );
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Status" />;
      },
      label: "status",
    },
    { accessorKey: "aRecord", header: "IP Address", enableHiding: false },
    { accessorKey: "ptrRecord", header: "PTR Record" },
  ];

export const BulkDnsLookupColumnDef: ExtendedColumnDef<BulkResponseList>[] = [
  {
    accessorKey: "status",
    cell: ({ row }) => {
      if (row.getValue("status")) {
        return (
          <CheckCircledIcon className="ml-4 h-[18px] w-[18px] animate-pulse text-green-600" />
        );
      }
      return (
        <CrossCircledIcon className="ml-4 h-[18px] w-[18px] animate-pulse text-red-600" />
      );
    },
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    label: "status",
  },
  { accessorKey: "provider", header: "Provider", isVisible: false },
  {
    accessorKey: "query",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Query" />;
    },
    label: "query",
    enableHiding: false,
  },
  { accessorKey: "record_type", header: "Record Type", isVisible: false },
  { accessorKey: "response", header: "Response" },
];

export const MxRecordColumnDef: ExtendedColumnDef<parsedMxRecords>[] = [
  { accessorKey: "value", header: "Mail Server" },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Priority" />;
    },
    cell: ({ row }) => {
      if (parseInt(row.id) === 0) {
        return (
          <>
            {row.getValue("priority")}{" "}
            <Badge variant="outline" className="">
              Priority
            </Badge>
          </>
        );
      }
      return row.getValue("priority");
    },
    label: "priority",
    enableHiding: false,
  },
];
