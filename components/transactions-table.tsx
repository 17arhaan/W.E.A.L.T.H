"use client"

import type React from "react"

import { useState } from "react"
import { ArrowUp, Coffee, CreditCard, Home, Search, ShoppingBag, Trash2, Edit, Plus, Database } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFinance } from "@/context/finance-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import { EmptyState } from "@/components/empty-state"
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
import { EditTransactionForm } from "@/components/forms/edit-transaction-form"
import type { Transaction } from "@/lib/types"
import { AddTransactionForm } from "@/components/forms/add-transaction-form"

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

export function TransactionsTable() {
  const { transactions, deleteTransaction, addTransaction, clearAllData } = useFinance()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)

  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter
      const matchesType = typeFilter === "all" || transaction.type === typeFilter

      return matchesSearch && matchesCategory && matchesType
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const categories = Array.from(new Set(transactions.map((t) => t.category)))

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete)
      setTransactionToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  const generateDemoTransactions = () => {
    // Categories for random selection
    const incomeCategories = ["Salary", "Freelance", "Investment", "Income"]
    const expenseCategories = ["Housing", "Food", "Transportation", "Entertainment", "Utilities", "Shopping", "Health"]

    // Random date within the last 30 days
    const getRandomDate = () => {
      const today = new Date()
      const daysAgo = Math.floor(Math.random() * 30)
      const date = new Date(today)
      date.setDate(today.getDate() - daysAgo)
      return date.toISOString().split("T")[0]
    }

    // Generate 5 random transactions (3 expenses, 2 incomes)
    const demoTransactions = [
      // Income transactions
      {
        description: "Monthly Salary",
        amount: Math.floor(50000 + Math.random() * 30000),
        date: getRandomDate(),
        category: "Salary",
        type: "income",
      },
      {
        description: "Freelance Project",
        amount: Math.floor(15000 + Math.random() * 25000),
        date: getRandomDate(),
        category: "Freelance",
        type: "income",
      },
      // Expense transactions
      {
        description: "Grocery Shopping",
        amount: Math.floor(2000 + Math.random() * 3000),
        date: getRandomDate(),
        category: "Food",
        type: "expense",
      },
      {
        description: "Electricity Bill",
        amount: Math.floor(1500 + Math.random() * 1000),
        date: getRandomDate(),
        category: "Utilities",
        type: "expense",
      },
      {
        description: "Movie Night",
        amount: Math.floor(500 + Math.random() * 1000),
        date: getRandomDate(),
        category: "Entertainment",
        type: "expense",
      },
    ]

    // Add each transaction
    demoTransactions.forEach((transaction) => {
      addTransaction(transaction)
    })
  }

  if (transactions.length === 0 && !showAddForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Transactions</h2>
          <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
        <EmptyState
          title="No transactions yet"
          description="Add your first transaction to get started"
          icon="transaction"
        />
        {showAddForm && (
          <div className="mb-6 border rounded-lg p-6 bg-card shadow-sm">
            <h3 className="text-xl font-bold mb-4">Add New Transaction</h3>
            <AddTransactionForm onSuccess={() => setShowAddForm(false)} onCancel={() => setShowAddForm(false)} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Transactions</h2>
        <div className="flex gap-2">
          <Button onClick={generateDemoTransactions} variant="outline" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Demo Data
          </Button>
          <Button onClick={() => setShowClearDialog(true)} variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-primary hover:bg-primary/90" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            {showAddForm ? "Cancel" : "Add Transaction"}
          </Button>
        </div>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete all your transactions, budgets, and investments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearAllData()
                setShowClearDialog(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editingTransaction && (
        <div className="mb-6 border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Edit Transaction</h3>
          <EditTransactionForm
            transaction={editingTransaction}
            onSuccess={() => setEditingTransaction(null)}
            onCancel={() => setEditingTransaction(null)}
          />
        </div>
      )}

      {showAddForm && (
        <div className="mb-6 border rounded-lg p-6 bg-card shadow-sm">
          <h3 className="text-xl font-bold mb-4">Add New Transaction</h3>
          <AddTransactionForm onSuccess={() => setShowAddForm(false)} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select defaultValue={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
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
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(transaction)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(transaction.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
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
