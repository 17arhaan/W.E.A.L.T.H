"use client"

import type React from "react"

import { ArrowUp, Coffee, CreditCard, Home, ShoppingBag } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFinance } from "@/context/finance-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import { EmptyState } from "@/components/empty-state"
import Link from "next/link"

// Map of category to icon
const categoryIcons: Record<string, React.ReactNode> = {
  Income: <ArrowUp className="h-4 w-4 text-wealth-green" />,
  Salary: <ArrowUp className="h-4 w-4 text-wealth-green" />,
  Freelance: <ArrowUp className="h-4 w-4 text-wealth-green" />,
  Investment: <ArrowUp className="h-4 w-4 text-wealth-green" />,
  Housing: <Home className="h-4 w-4 text-wealth-blue" />,
  Food: <ShoppingBag className="h-4 w-4 text-wealth-yellow" />,
  Entertainment: <Coffee className="h-4 w-4 text-wealth-purple" />,
  Bills: <CreditCard className="h-4 w-4 text-wealth-red" />,
  Utilities: <CreditCard className="h-4 w-4 text-wealth-red" />,
  Shopping: <ShoppingBag className="h-4 w-4 text-wealth-yellow" />,
  Transportation: <CreditCard className="h-4 w-4 text-wealth-red" />,
  Health: <CreditCard className="h-4 w-4 text-wealth-red" />,
  Education: <CreditCard className="h-4 w-4 text-wealth-red" />,
  Travel: <CreditCard className="h-4 w-4 text-wealth-red" />,
  Other: <CreditCard className="h-4 w-4 text-wealth-red" />,
}

export function RecentTransactions() {
  const { transactions } = useFinance()

  // Sort transactions by date (newest first) and take the most recent 5
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Add your first transaction to get started"
        icon="transaction"
      />
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-muted p-1">
                    {categoryIcons[transaction.category] || <CreditCard className="h-4 w-4" />}
                  </div>
                  {transaction.description}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{transaction.category}</Badge>
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-medium",
                  transaction.type === "income" ? "text-wealth-green" : "text-wealth-red",
                )}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/transactions">View All Transactions</Link>
        </Button>
      </div>
    </div>
  )
}
