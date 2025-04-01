"use client"

import { cn } from "@/lib/utils"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  ShoppingCart,
  CreditCard,
  type LucideIcon,
  ArrowRight,
  Plus,
} from "lucide-react"
import type { Transaction } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import AddTransactionForm from "./add-transaction-form"

interface List02Props {
  transactions?: Transaction[]
  className?: string
}

export default function List02({ transactions = [], className }: List02Props) {
  const [showAddForm, setShowAddForm] = useState(false)

  if (showAddForm) {
    return <AddTransactionForm onClose={() => setShowAddForm(false)} className={className} />
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className={cn("w-full max-w-xl mx-auto", className)}>
        <div className="text-center py-8">
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-5 h-5 text-brand-500 dark:text-brand-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No transactions yet</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Your transactions will appear here</p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className={cn(
              "flex items-center justify-center gap-1 mx-auto",
              "py-1.5 px-3 rounded-md",
              "text-xs font-medium",
              "bg-brand-600 dark:bg-brand-600",
              "text-white dark:text-white",
              "hover:bg-brand-700 dark:hover:bg-brand-700",
              "transition-all duration-200",
            )}
          >
            <Plus className="w-3 h-3" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>
    )
  }

  const getCategoryIcon = (category: string): LucideIcon => {
    switch (category) {
      case "shopping":
        return ShoppingCart
      case "income":
        return Wallet
      default:
        return CreditCard
    }
  }

  return (
    <div className={cn("w-full max-w-xl mx-auto", className)}>
      <div className="space-y-1">
        {transactions.map((transaction) => {
          const Icon = getCategoryIcon(transaction.category)
          const date = new Date(transaction.timestamp)
          const formattedDate = date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })

          return (
            <div
              key={transaction.id}
              className={cn(
                "group flex items-center gap-3",
                "p-2 rounded-md",
                "hover:bg-gray-50 dark:hover:bg-zinc-700/50",
                "transition-all duration-200",
              )}
            >
              <div className={cn("p-1.5 rounded-md", "bg-gray-50 dark:bg-zinc-700")}>
                <Icon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
              </div>

              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-medium text-gray-900 dark:text-white">{transaction.title}</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{formattedDate}</p>
                </div>

                <div className="flex items-center gap-1.5 pl-3">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      transaction.type === "incoming"
                        ? "text-success-500 dark:text-success-500"
                        : "text-danger-500 dark:text-danger-500",
                    )}
                  >
                    {transaction.type === "incoming" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                  {transaction.type === "incoming" ? (
                    <ArrowDownLeft className="w-3 h-3 text-success-500 dark:text-success-500" />
                  ) : (
                    <ArrowUpRight className="w-3 h-3 text-danger-500 dark:text-danger-500" />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className={cn(
            "flex items-center justify-center gap-1",
            "py-1.5 px-3 rounded-md",
            "text-xs font-medium",
            "bg-brand-600 dark:bg-brand-600",
            "text-white dark:text-white",
            "hover:bg-brand-700 dark:hover:bg-brand-700",
            "transition-all duration-200",
          )}
        >
          <Plus className="w-3 h-3" />
          <span>Add</span>
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 flex items-center justify-center gap-1",
            "py-1.5 px-3 rounded-md",
            "text-xs font-medium",
            "text-gray-600 dark:text-gray-300",
            "bg-gray-50 dark:bg-zinc-700",
            "hover:bg-gray-100 dark:hover:bg-zinc-600",
            "transition-all duration-200",
          )}
        >
          <span>View All Transactions</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

