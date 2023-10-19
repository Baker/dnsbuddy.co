"use client"

import { BulkResponseList } from "@/constants/dns"
import { ColumnDef } from "@tanstack/react-table"
import { boolean } from "zod"


import { CrossCircledIcon, InfoCircledIcon, CheckCircledIcon } from '@radix-ui/react-icons';


export const BulkFCrDNSColumnDef: ColumnDef<BulkResponseList>[] = [
    {
        accessorKey: 'status', header: 'Status', cell: ({ row }) => {
            if (boolean(row.getValue('status'))) {
                return <CheckCircledIcon className='h-[18px] w-[18px] animate-pulse text-green-600' />
            } else {
                <CrossCircledIcon className='h-[18px] w-[18px] animate-pulse text-red-600' />
            }

        }
    },
    { accessorKey: 'aRecord', header: 'IP Address' },
    { accessorKey: 'ptrRecord', header: 'PTR Record' },
]