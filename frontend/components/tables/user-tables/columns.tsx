"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { User, UserTableColumns } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<UserTableColumns>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "us_fname",
    header: "First Name",
  },
  {
    accessorKey: "us_lname",
    header: "Last Name",
  },
  {
    accessorKey: "us_email",
    header: "Email",
  },
  {
    accessorKey: "us_role",
    header: "ROLE",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];