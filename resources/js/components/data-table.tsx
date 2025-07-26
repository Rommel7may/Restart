"use client"

import * as React from "react"
import axios from "axios"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"
import { ChevronDown, FormInputIcon, PlusCircle } from "lucide-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlumniForm } from "./AlumniForm"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export type Alumni = {
  id?: number
  student_number: string
  email: string
  program: string
  last_name: string
  given_name: string
  middle_initial?: string
  present_address: string
  active_email: string
  contact_number: string
  campus?: string
  graduation_year: number
  college?: string
  employment_status: string
  further_studies?: string
  sector: string
  work_location: string
  employer_classification: string
  consent: boolean
}

export function AlumniTable() {
  const [alumniData, setAlumniData] = React.useState<Alumni[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [editingAlumni, setEditingAlumni] = React.useState<Alumni | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [sendEmailOpen, setSendEmailOpen] = React.useState(false)

  // Dynamically create graduation years from 2022 to current year (descending)
  const currentYear = new Date().getFullYear()
  const graduationYears = React.useMemo(() => {
    const years = []
    for (let y = currentYear; y >= 2022; y--) {
      years.push(y.toString())
    }
    return years
  }, [currentYear])

  const fetchAlumni = () => {
    setLoading(true)
    axios.get("/alumni-data")
      .then((response) => {
        setAlumniData(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching alumni data:", error)
        setLoading(false)
      })
  }

  const handleDelete = (id?: number) => {
    if (!id) return
    if (!confirm("Are you sure you want to delete this record?")) return

    axios.delete(`/alumni/${id}`)
      .then(() => {
        setAlumniData(prev => prev.filter(a => a.id !== id))
        toast.success("Deleted successfully")
      })
      .catch(err => {
        console.error("Delete failed:", err)
        toast.error("Delete failed.")
      })
  }

  const handleSendEmails = async () => {
    try {
      const response = await axios.post("/send-email-to-all-alumni")
      const { sent, failed } = response.data

      if (failed?.length) {
        const failedList = failed.map((f: any) => f.email).join(", ")
        toast.warning("Some emails failed to send ❗", {
          description: `Failed: ${failedList}`,
        })
      } else {
        toast.success("Emails sent successfully to all alumni! 📧", {
          description: `Total sent: ${sent.length}`,
        })
      }

      setSendEmailOpen(false)
    } catch (err: any) {
      const fallback = err?.response?.data?.message || "Something went wrong."
      toast.error("Failed to send emails", { description: fallback })
    }
  }

  React.useEffect(() => {
    fetchAlumni()
  }, [])

  const columns: ColumnDef<Alumni>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
    { accessorKey: "student_number", header: "Student #" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "program", header: "Program" },
    { accessorKey: "last_name", header: "Last Name" },
    { accessorKey: "given_name", header: "Given Name" },
    { accessorKey: "middle_initial", header: "M.I." },
    { accessorKey: "campus", header: "Campus" },
    { accessorKey: "graduation_year", header: "Grad Year" },
    { accessorKey: "employment_status", header: "Employment" },
    { accessorKey: "further_studies", header: "Further Studies" },
    { accessorKey: "work_location", header: "Work Location" },
    { accessorKey: "employer_classification", header: "Employer Type" },
    {
      accessorKey: "consent",
      header: "Consent",
      cell: ({ row }) => <div>{row.getValue("consent") ? "Yes" : "No"}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const alumni = row.original
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => alert(`Viewing ${alumni.student_number}`)}>View</Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingAlumni(alumni)
                setShowAddModal(true)
              }}
            >Edit</Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(alumni.id)}>Delete</Button>
          </div>
        )
      }
    }
  ]

  const table = useReactTable({
    data: alumniData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // helper function to clear filter for a column
  const clearFilter = (id: string) => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="w-full">
      {/* Filters and buttons container */}
      <div className="flex flex-col gap-3 py-4">
        <Input
          placeholder="Search by last name..."
          value={(table.getColumn("last_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("last_name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />

        {/* Filters grouped */}
        <div className="flex gap-3 flex-wrap items-center">
          {/* Graduation Year Filter */}
          <Select
            onValueChange={(val) => {
              if (val === "__clear__") clearFilter("graduation_year")
              else
                setColumnFilters((prev) => [
                  ...prev.filter((f) => f.id !== "graduation_year"),
                  { id: "graduation_year", value: val },
                ])
            }}
            value={(table.getColumn("graduation_year")?.getFilterValue() as string) || ""}
            className="w-32"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__clear__">Clear Filter</SelectItem>
              {graduationYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Program Filter */}
          <Select
            onValueChange={(val) => {
              if (val === "__clear__") clearFilter("program")
              else
                setColumnFilters((prev) => [
                  ...prev.filter((f) => f.id !== "program"),
                  { id: "program", value: val },
                ])
            }}
            value={(table.getColumn("program")?.getFilterValue() as string) || ""}
            className="w-32"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__clear__">Clear Filter</SelectItem>
              <SelectItem value="BSIT">BSIT</SelectItem>
              <SelectItem value="BSBA">BSBA</SelectItem>
              <SelectItem value="BSE">BSE</SelectItem>
              <SelectItem value="BEED">BEED</SelectItem>
              <SelectItem value="BSTM">BSTM</SelectItem>
              <SelectItem value="PSYC">PSYC</SelectItem>
              <SelectItem value="BSCE">BSCE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buttons in one row */}
        <div className="flex gap-3">
          <Dialog open={sendEmailOpen} onOpenChange={setSendEmailOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center">
                <FormInputIcon className="mr-2 h-4 w-4" />
                Send Email to All Alumni
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send to All Alumni</DialogTitle>
                <DialogDescription>This will send email to **all alumni with consent and email**.</DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <Button onClick={handleSendEmails}>Send Now</Button>
                <Button variant="ghost" onClick={() => setSendEmailOpen(false)}>Cancel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={showAddModal}
            onOpenChange={(open) => {
              setShowAddModal(open)
              if (!open) setEditingAlumni(null)
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-green-600 text-white flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingAlumni ? "Edit Alumni" : "Add New Alumni"}</DialogTitle>
                <DialogDescription>
                  {editingAlumni
                    ? "Update the alumni information and submit to save changes."
                    : "Fill out the form and submit to add a new record."}
                </DialogDescription>
              </DialogHeader>

              <AlumniForm
                key={editingAlumni?.student_number || "create"}
                mode={editingAlumni ? "edit" : "create"}
                id={editingAlumni?.id}
                student_number={editingAlumni?.student_number}
                email={editingAlumni?.email}
                program={editingAlumni?.program}
                onSuccess={() => {
                  fetchAlumni()
                  setShowAddModal(false)
                  setEditingAlumni(null)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-10 text-muted">Loading alumni data...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
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
      )}

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
    </div>
  )
}
