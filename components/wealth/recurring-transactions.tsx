import type { Transaction } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Repeat, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface RecurringTransactionsProps {
  transactions: Transaction[]
  className?: string
}

export default function RecurringTransactions({ transactions, className }: RecurringTransactionsProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className={cn("bg-white dark:bg-zinc-800 rounded-lg p-4", className)}>
        <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Repeat className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          Recurring Transactions
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          No recurring transactions found.
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-white dark:bg-zinc-800 rounded-lg p-4", className)}>
      <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Repeat className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
        Recurring Transactions
      </h2>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "p-1.5 rounded-md",
                  transaction.type === "incoming"
                    ? "bg-emerald-100 dark:bg-emerald-900/30"
                    : "bg-red-100 dark:bg-red-900/30",
                )}
              >
                {transaction.type === "incoming" ? (
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-900 dark:text-white">{transaction.title}</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {transaction.recurringFrequency?.charAt(0).toUpperCase() + transaction.recurringFrequency?.slice(1)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={cn(
                  "text-xs font-medium",
                  transaction.type === "incoming"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {transaction.type === "incoming" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

