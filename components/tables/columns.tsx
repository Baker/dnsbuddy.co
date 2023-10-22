"use client"

import { BulkResponseList, ResponseList } from "@/constants/data"
import { ColumnDef, RowData } from "@tanstack/react-table"
import { CrossCircledIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { DataTableColumnHeader } from "@/components/tables/column-header"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react";

export type ExtendedColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<TData, TValue> & {
    label?: string;
}



export const BulkFCrDNSColumnDef: ExtendedColumnDef<BulkResponseList>[] = [
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         const payment = row.original

    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuItem
    //                         onClick={() => navigator.clipboard.writeText(payment.id)}
    //                     >
    //                         Copy payment ID
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem>View customer</DropdownMenuItem>
    //                     <DropdownMenuItem>View payment details</DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         )
    //     },
    // },
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
    },
    { accessorKey: 'response', header: 'Response', },
]