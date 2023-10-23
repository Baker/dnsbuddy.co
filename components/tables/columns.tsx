"use client"

import { BulkResponseList, ResponseList } from "@/constants/data"
import { ColumnDef, RowData } from "@tanstack/react-table"
import { CrossCircledIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { DataTableColumnHeader } from "@/components/tables/column-header"

export type ExtendedColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<TData, TValue> & {
    label?: string;
}



export const BulkFCrDNSColumnDef: ExtendedColumnDef<BulkResponseList>[] = [
    {
        accessorKey: 'status',
        cell: ({ row }) => {
            if (row.getValue('status')) {
                return <CheckCircledIcon className='h-[18px] w-[18px] animate-pulse text-green-600 ml-4' />
            } else {
                return <CrossCircledIcon className='h-[18px] w-[18px] animate-pulse text-red-600 ml-4' />
            }
        },
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Status" />
            )
        },
        label: 'status'
    },
    { accessorKey: 'aRecord', header: 'IP Address', enableHiding: false, },
    { accessorKey: 'ptrRecord', header: 'PTR Record', },
]

export const DnsLookupColumnDef: ExtendedColumnDef<ResponseList>[] = [
    {
        accessorKey: 'status',
        cell: ({ row }) => {
            if (row.getValue('status')) {
                return <CheckCircledIcon className='h-[18px] w-[18px] animate-pulse text-green-600 ml-4' />
            } else {
                return <CrossCircledIcon className='h-[18px] w-[18px] animate-pulse text-red-600 ml-4' />
            }
        },
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Status" />
            )
        },
        label: 'status'
    },
    {
        accessorKey: 'location',
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Location" />
            )
        },
        label: 'Location'
    },
    { accessorKey: 'response', header: 'Response', },
]