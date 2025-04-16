"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Edit, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFinance } from "@/context/finance-context"
import { formatCurrency, calculateInvestmentValue, calculateInvestmentCostBasis } from "@/lib/utils"
import { EmptyState } from "@/components/empty-state"
import type { Investment } from "@/lib/types"
import { EditInvestmentForm } from "@/components/forms/edit-investment-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function InvestmentHoldings() {
  const { investments, deleteInvestment } = useFinance()
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [investmentToDelete, setInvestmentToDelete] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setInvestmentToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (investmentToDelete) {
      deleteInvestment(investmentToDelete)
      setInvestmentToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  if (investments.length === 0) {
    return (
      <EmptyState
        title="No investments yet"
        description="Add your first investment to start tracking your portfolio"
        icon="investment"
      />
    )
  }

  return (
    <div className="space-y-4">
      {editingInvestment && (
        <div className="mb-6 border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Edit Investment</h3>
          <EditInvestmentForm
            investment={editingInvestment}
            onSuccess={() => setEditingInvestment(null)}
            onCancel={() => setEditingInvestment(null)}
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Shares</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Gain/Loss</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => {
            const currentValue = calculateInvestmentValue(investment)
            const costBasis = calculateInvestmentCostBasis(investment)
            const gain = currentValue - costBasis
            const gainPercent = costBasis > 0 ? (gain / costBasis) * 100 : 0

            return (
              <TableRow key={investment.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{investment.symbol}</div>
                    <div className="text-xs text-muted-foreground">{investment.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{investment.category}</Badge>
                </TableCell>
                <TableCell className="text-right">{investment.shares.toLocaleString()}</TableCell>
                <TableCell className="text-right">{formatCurrency(investment.price)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(currentValue)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {gain >= 0 ? (
                      <ArrowUp className="h-4 w-4 text-wealth-green" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-wealth-red" />
                    )}
                    <span className={cn("font-medium", gain >= 0 ? "text-wealth-green" : "text-wealth-red")}>
                      {gainPercent >= 0 ? "+" : ""}
                      {gainPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className={cn("text-xs", gain >= 0 ? "text-wealth-green" : "text-wealth-red")}>
                    {gain >= 0 ? "+" : ""}
                    {formatCurrency(Math.abs(gain))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingInvestment(investment)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(investment.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the investment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
