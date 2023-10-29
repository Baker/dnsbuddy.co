"use client"

import {
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    VisibilityState,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { CSVLink } from "react-csv";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import { ExtendedColumnDef } from "@/components/tables/columns"
import { timeUnix } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ExtendedColumnDef<TData, TValue>[]
    data: TData[]
    download: boolean
    pagination: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    download,
    pagination,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    if (columns.length > 1) {
        columns.forEach((column) => {
            // @ts-ignore
            if (!column.isVisible && !columnVisibility[column.accessorKey]) {
                // @ts-ignore
                columnVisibility[column.accessorKey] = column.isVisible;
            }
        });
    }
    const csvHeader = columns.map((column) => ({
        // @ts-ignore
        label: (column.label || column.header).charAt(0).toUpperCase() + (column.label || column.header).slice(1),
        // @ts-ignore
        key: column.accessorKey,
    }))
    const csvBody = data.flatMap((row) => {
        const bodyRows: any[] = [];
        const uniqueRows: Set<string> = new Set();
        Object.entries(row as any[]).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item) => {
                    const newRow = { ...row } as Record<string | number, string | number>;
                    newRow[key] = item;
                    const rowString = JSON.stringify(newRow);
                    if (!uniqueRows.has(rowString)) {
                        uniqueRows.add(rowString);
                        bodyRows.push(newRow);
                    }
                });
            } else {
                const rowString = JSON.stringify(row);
                if (!uniqueRows.has(rowString)) {
                    let isValueArray = false;
                    Object.values(row as any[]).forEach((value) => {
                        if (Array.isArray(value)) {
                            isValueArray = true;
                        }
                    });
                    if (!isValueArray) {
                        uniqueRows.add(rowString);
                        bodyRows.push(row);
                    }
                }
            }
        });
        return bodyRows;
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnVisibility,
        },
    })
    return (
        <div>
            <div className="flex items-center py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="mr-auto">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) => column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {/* @ts-ignore */}
                                        {column.columnDef.label || column.columnDef.header}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
                {(download) ? (
                    <Button variant="outline" className="ml-auto">
                        <CSVLink headers={csvHeader} data={csvBody} filename={`dnsbuddy.co-${timeUnix()}.csv`}>
                            Download
                        </CSVLink>
                    </Button>
                ) : null}
            </div>
            <div className="rounded-md border bg-black/5  dark:bg-white/5 py-4 px-4 ">
                <Table className="">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-black dark:text-white font-semibold text-lg ">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <TableCell key={cell.id} className="dark:text-gray-300 text-left py-3">
                                                {Array.isArray(cell.getValue()) ? (
                                                    // @ts-ignore
                                                    cell.getValue().map((item, index) => (
                                                        <pre key={index}>{item}</pre>
                                                    ))
                                                ) : (
                                                    flexRender(cell.column.columnDef.cell, cell.getContext())
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {
                (pagination) ? (
                    <div className="flex items-center py-4">
                        <div className="mr-auto space-x-1 ">
                            <p className="dark:text-gray-300 px-4 py-2 h-10">Total Results: {table.getFilteredRowModel().rows.length}</p>
                        </div>
                        <div className="ml-auto space-x-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                ) : null
            }
        </div >
    )
}