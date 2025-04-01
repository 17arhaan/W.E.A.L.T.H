"use client"

import { useState } from "react"
import { useData } from "./data-provider"
import { CreditCard, Plus, Filter, Search, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import AddTransactionForm from "./add-transaction-form"
import type { Transaction, TransactionCategory } from "@/lib/types"

export default function TransactionsPage() {
  const { transactions, isLoading, error } = useData()
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "incoming" | "outgoing">("all")
  const [filterCategory, setFilterCategory] = useState<TransactionCategory | "all">("all")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-gray-900 dark:border-t-white border-gray-200 dark:border-gray-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading transactions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Unable to load transactions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (showAddForm) {
    return (
      <div className="p-4 sm:p-6">
        <AddTransactionForm onClose={() => setShowAddForm(false)} />
      </div>
    )
  }

  // Filter transactions
  const filteredTransactions = transactions.filter((tx: Transaction) => {
    // Search filter
    const matchesSearch = searchTerm === "" || tx.title.toLowerCase().includes(searchTerm.toLowerCase())

    // Type filter
    const matchesType = filterType === "all" || tx.type === filterType

    // Category filter
    const matchesCategory = filterCategory === "all" || tx.category === filterCategory

    return matchesSearch && matchesType && matchesCategory
  })

  const categories: TransactionCategory[] = [
    "housing",
    "food",
    "transport",
    "utilities",
    "entertainment",
    "shopping",
    "health",
    "education",
    "income",
    "other",
  ]

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Transactions</h1>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as "all" | "incoming" | "outgoing")}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="incoming">Income</option>
                <option value="outgoing">Expense</option>
              </select>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as TransactionCategory | "all")}
              className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-zinc-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No transactions found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your filters or add a new transaction
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                {filteredTransactions.map((tx: Transaction) => {
                  const date = new Date(tx.timestamp)
                  const formattedDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{tx.title}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 capitalize">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span
                            className={`text-sm font-medium ${
                              tx.type === "incoming"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {tx.type === "incoming" ? "+" : "-"}
                            {formatCurrency(tx.amount)}
                          </span>
                          {tx.type === "incoming" ? (
                            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

