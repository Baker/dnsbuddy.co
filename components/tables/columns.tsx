"use client"

import { BulkFCrDNSResponseList, BulkResponseList, ResponseList } from "@/constants/data"
import { ColumnDef, RowData } from "@tanstack/react-table"
import { CrossCircledIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { DataTableColumnHeader } from "@/components/tables/column-header"

export type ExtendedColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<TData, TValue> & {
    label?: string;
    isVisible?: boolean;
}


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
        accessorKey: 'provider',
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="DNS Provider" />
            )
        },
        label: 'provider'
    },
    { accessorKey: 'response', header: 'Response', },
]

export const BulkFCrDNSColumnDef: ExtendedColumnDef<BulkFCrDNSResponseList>[] = [
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

export const BulkDnsLookupColumnDef: ExtendedColumnDef<BulkResponseList>[] = [
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
    { accessorKey: 'provider', header: 'Provider', isVisible: false },
    {
        accessorKey: 'query',
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Query" />
            )
        },
        label: 'query',
        enableHiding: false,
    },
    { accessorKey: 'record_type', header: 'Record Type', isVisible: false },
    { accessorKey: 'response', header: 'Response' },
]