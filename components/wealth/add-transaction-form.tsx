"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownLeft, X } from "lucide-react"
import type { TransactionType, TransactionCategory } from "@/lib/types"
import { useData } from "./data-provider"

interface AddTransactionFormProps {
  onClose: () => void
  className?: string
}

export default function AddTransactionForm({ onClose, className }: AddTransactionFormProps) {
  const { refreshData, accounts } = useData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "outgoing" as TransactionType,
    category: "other" as TransactionCategory,
    accountId: "",
    timestamp: new Date().toISOString().split("T")[0],
  })

  // Set default account if available
  useEffect(() => {
    if (accounts.length > 0 && !formData.accountId) {
      setFormData((prev) => ({ ...prev, accountId: accounts[0].id }))
    }
  }, [accounts, formData.accountId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate form
      if (!formData.title) {
        throw new Error("Transaction description is required")
      }

      if (!formData.amount || isNaN(Number.parseFloat(formData.amount)) || Number.parseFloat(formData.amount) <= 0) {
        throw new Error("Valid amount is required")
      }

      if (!formData.accountId) {
        throw new Error("Please select an account")
      }

      // Submit to API
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          amount: Number.parseFloat(formData.amount),
          type: formData.type,
          category: formData.category,
          accountId: formData.accountId,
          timestamp: new Date(formData.timestamp).toISOString(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create transaction")
      }

      // Refresh dashboard data
      await refreshData()

      // Close the form
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

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
    <div className={cn("bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Add New Transaction</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-danger-50 dark:bg-danger-500/20 text-danger-500 dark:text-danger-500 text-sm rounded-md">
          {error}
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            You need to create an account before adding transactions.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-brand-600 dark:bg-brand-600 text-white dark:text-white rounded-md text-sm font-medium"
          >
            Create an Account First
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-md 
                        bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                        focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="e.g. Grocery shopping"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-md 
                          bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                          focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Transaction Type*
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: "outgoing" }))}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm",
                    formData.type === "outgoing"
                      ? "border-danger-500 bg-danger-50 dark:bg-danger-500/20 text-danger-500 dark:text-danger-500"
                      : "border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800",
                  )}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: "incoming", category: "income" }))}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm",
                    formData.type === "incoming"
                      ? "border-success-500 bg-success-50 dark:bg-success-500/20 text-success-500 dark:text-success-500"
                      : "border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800",
                  )}
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Income</span>
                </button>
              </div>
            </div>

            {formData.type === "outgoing" && (
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-md 
                          bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                          focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                >
                  {categories
                    .filter((cat) => cat !== "income")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account*
              </label>
              <select
                id="accountId"
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-md 
                        bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                        focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              >
                <option value="" disabled>
                  Select an account
                </option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber ? account.accountNumber : "No Account Number"} (₹{account.balance.toFixed(2)}
                    ){account.title ? ` - ${account.title}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                id="timestamp"
                name="timestamp"
                value={formData.timestamp}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-md 
                        bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                        focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex-1 px-4 py-2 bg-brand-600 dark:bg-brand-600 text-white dark:text-white rounded-md text-sm font-medium",
                "hover:bg-brand-700 dark:hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500",
                isSubmitting && "opacity-70 cursor-not-allowed",
              )}
            >
              {isSubmitting ? "Creating..." : "Add Transaction"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 
                      rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

