"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Wallet,
  QrCode,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  X,
  PiggyBank,
  TrendingUp,
  Calendar,
  Upload,
  FileText,
  Check,
  AlertCircle,
} from "lucide-react"
import type { AccountType, TransactionType, TransactionCategory, GoalStatus } from "@/lib/types"
import { useData } from "./data-provider"

// ACCOUNT FORM
export function AddAccountForm({ onClose, className }: { onClose: () => void; className?: string }) {
  const { refreshData, accounts } = useData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    balance: "",
    accountNumber: "",
    type: "checking" as AccountType,
  })

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
        throw new Error("Account name is required")
      }

      if (!formData.balance || isNaN(Number.parseFloat(formData.balance))) {
        throw new Error("Valid balance amount is required")
      }

      // Check if account number is provided and validate uniqueness
      if (formData.accountNumber) {
        const isDuplicate = accounts.some((account) => account.accountNumber === formData.accountNumber)

        if (isDuplicate) {
          throw new Error("Account number must be unique. This number is already in use.")
        }
      }

      // Submit to API
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          accountNumber: formData.accountNumber,
          balance: Number.parseFloat(formData.balance),
          type: formData.type,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create account")
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

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case "savings":
        return <Wallet className="w-4 h-4 text-success-500 dark:text-success-500" />
      case "checking":
        return <QrCode className="w-4 h-4 text-brand-500 dark:text-brand-400" />
      case "investment":
        return <ArrowUpRight className="w-4 h-4 text-purple-500 dark:text-purple-400" />
      case "debt":
        return <CreditCard className="w-4 h-4 text-danger-500 dark:text-danger-500" />
    }
  }

  // Add a new function to handle account number formatting
  // This should be added inside the AddAccountForm function, before the return statement

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Remove any non-digit characters
    value = value.replace(/\D/g, "")

    // Format with a hyphen after 4 digits
    if (value.length > 4) {
      value = value.substring(0, 4) + "-" + value.substring(4)
    }

    // Limit to 9 characters (XXXX-XXXX format)
    if (value.length > 9) {
      value = value.substring(0, 9)
    }

    // Update the form data
    setFormData((prev) => ({ ...prev, accountNumber: value }))
  }

  return (
    <div className={cn("bg-zinc-800 rounded-lg p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-white">Add New Account</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-300">
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-danger-500/20 text-danger-500 text-sm rounded-md">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Account Name*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-zinc-700 rounded-md 
                      bg-zinc-900 text-white 
                      focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Main Checking Account"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-zinc-700 rounded-md 
                      bg-zinc-900 text-white 
                      focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Daily expenses account"
            />
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300 mb-1">
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleAccountNumberChange}
              className="w-full px-3 py-2 border border-zinc-700 rounded-md 
                      bg-zinc-900 text-white 
                      focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. XXXX-XXXX"
            />
          </div>

          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-300 mb-1">
              Current Balance*
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
              <input
                type="number"
                step="0.01"
                id="balance"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 border border-zinc-700 rounded-md 
                        bg-zinc-900 text-white 
                        focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
              Account Type*
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["checking", "savings", "investment", "debt"] as AccountType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type }))}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 border rounded-md text-sm",
                    formData.type === type
                      ? "border-brand-400 bg-brand-900/20 text-brand-400"
                      : "border-zinc-700 text-gray-300 hover:bg-zinc-800",
                  )}
                >
                  {getAccountIcon(type)}
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex-1 px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium",
              "hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500",
              isSubmitting && "opacity-70 cursor-not-allowed",
            )}
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-700 text-gray-300 
                    rounded-md text-sm font-medium hover:bg-zinc-800 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

// TRANSACTION FORM
export function AddTransactionForm({ onClose, className }: { onClose: () => void; className?: string }) {
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
    <div className={cn("bg-zinc-800 rounded-lg p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-white">Add New Transaction</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-300">
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-danger-500/20 text-danger-500 text-sm rounded-md">{error}</div>}

      {accounts.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-400 mb-4">You need to create an account before adding transactions.</p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium"
          >
            Create an Account First
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Description*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-700 rounded-md 
                        bg-zinc-900 text-white 
                        focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="e.g. Grocery shopping"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                Amount*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 border border-zinc-700 rounded-md 
                          bg-zinc-900 text-white 
                          focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Transaction Type*</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: "outgoing" }))}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm",
                    formData.type === "outgoing"
                      ? "border-danger-500 bg-danger-500/20 text-danger-500"
                      : "border-zinc-700 text-gray-300 hover:bg-zinc-800",
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
                      ? "border-success-500 bg-success-500/20 text-success-500"
                      : "border-zinc-700 text-gray-300 hover:bg-zinc-800",
                  )}
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Income</span>
                </button>
              </div>
            </div>

            {formData.type === "outgoing" && (
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-700 rounded-md 
                          bg-zinc-900 text-white 
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
              <label htmlFor="accountId" className="block text-sm font-medium text-gray-300 mb-1">
                Account*
              </label>
              <select
                id="accountId"
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-700 rounded-md 
                        bg-zinc-900 text-white 
                        focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              >
                <option value="" disabled>
                  Select an account
                </option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber
                      ? `${account.accountNumber} - ${account.title} (₹${account.balance.toFixed(2)})`
                      : `${account.title} (₹${account.balance.toFixed(2)})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="timestamp" className="block text-sm font-medium text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                id="timestamp"
                name="timestamp"
                value={formData.timestamp}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-zinc-700 rounded-md 
                        bg-zinc-900 text-white 
                        focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex-1 px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium",
                "hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500",
                isSubmitting && "opacity-70 cursor-not-allowed",
              )}
            >
              {isSubmitting ? "Creating..." : "Add Transaction"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-700 text-gray-300 
                      rounded-md text-sm font-medium hover:bg-zinc-800 
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

// GOAL FORM
export function AddGoalForm({ onClose, className }: { onClose: () => void; className?: string }) {
  const { refreshData } = useData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: getDefaultTargetDate(),
    status: "pending" as GoalStatus,
  })

  function getDefaultTargetDate() {
    const date = new Date()
    date.setMonth(date.getMonth() + 6) // Default to 6 months from now
    return date.toISOString().split("T")[0]
  }

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
        throw new Error("Goal title is required")
      }

      if (
        !formData.targetAmount ||
        isNaN(Number.parseFloat(formData.targetAmount)) ||
        Number.parseFloat(formData.targetAmount) <= 0
      ) {
        throw new Error("Valid target amount is required")
      }

      if (!formData.targetDate) {
        throw new Error("Target date is required")
      }

      // Ensure current amount is a valid number
      const currentAmount = formData.currentAmount ? Number.parseFloat(formData.currentAmount) : 0

      if (isNaN(currentAmount) || currentAmount < 0) {
        throw new Error("Current amount must be a valid number")
      }

      // Submit to API
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          subtitle: formData.subtitle,
          targetAmount: Number.parseFloat(formData.targetAmount),
          currentAmount: currentAmount,
          targetDate: new Date(formData.targetDate).toISOString(),
          status: formData.status,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create goal")
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

  return (
    <div className={cn("bg-zinc-800 rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-white">Add New Financial Goal</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-300">
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-900/20 text-red-400 text-sm rounded-md">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Goal Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-zinc-700 rounded-md 
                        bg-zinc-900 text-white 
                        focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Emergency Fund"
              required
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-zinc-700 rounded-md 
                        bg-zinc-900 text-white 
                        focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. 3 months of expenses saved"
            />
          </div>

          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-300 mb-1">
              Target Amount*
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                id="targetAmount"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 border border-zinc-700 rounded-md 
                          bg-zinc-900 text-white 
                          focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-300 mb-1">
              Current Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
              <input
                type="number"
                step="0.01"
                min="0"
                id="currentAmount"
                name="currentAmount"
                value={formData.currentAmount}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 border border-zinc-700 rounded-md 
                          bg-zinc-900 text-white 
                          focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-gray-300 mb-1">
              Target Date*
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-md 
                          bg-zinc-900 text-white 
                          focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-zinc-700 rounded-md 
                        bg-zinc-900 text-white 
                        focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Goal Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center gap-1 p-2 border rounded-md text-sm",
                  "border-zinc-700 text-gray-300 hover:bg-zinc-800",
                )}
              >
                <PiggyBank className="w-5 h-5 text-emerald-400" />
                <span>Savings</span>
              </button>
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center gap-1 p-2 border rounded-md text-sm",
                  "border-zinc-700 text-gray-300 hover:bg-zinc-800",
                )}
              >
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span>Investment</span>
              </button>
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center gap-1 p-2 border rounded-md text-sm",
                  "border-zinc-700 text-gray-300 hover:bg-zinc-800",
                )}
              >
                <CreditCard className="w-5 h-5 text-red-400" />
                <span>Debt</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex-1 px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium",
              "hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500",
              isSubmitting && "opacity-70 cursor-not-allowed",
            )}
          >
            {isSubmitting ? "Creating..." : "Create Goal"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-700 text-gray-300 
                      rounded-md text-sm font-medium hover:bg-zinc-800 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

// IMPORT DATA FORM
export function ImportDataForm({ onClose, className }: { onClose: () => void; className?: string }) {
  const { refreshData } = useData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [importType, setImportType] = useState<"accounts" | "transactions">("transactions")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (!file) {
        throw new Error("Please select a file to import")
      }

      // Check file type
      if (!file.name.endsWith(".csv") && !file.name.endsWith(".json")) {
        throw new Error("Only CSV and JSON files are supported")
      }

      // Read file content
      const fileContent = await readFileContent(file)

      // Parse file content based on file type
      let data
      try {
        if (file.name.endsWith(".json")) {
          data = JSON.parse(fileContent)
        } else {
          // Simple CSV parsing (in a real app, use a proper CSV parser)
          data = parseCSV(fileContent)
        }
      } catch (err) {
        throw new Error("Failed to parse file. Please check the file format.")
      }

      // Send data to API
      const response = await fetch(`/api/${importType}/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to import ${importType}`)
      }

      // Show success message
      setSuccess(`Successfully imported ${data.length || 0} ${importType}`)

      // Refresh dashboard data
      await refreshData()

      // Close form after 2 seconds
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to read file content
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = (e) => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  // Simple CSV parser
  const parseCSV = (content: string) => {
    const lines = content.split("\n")
    const headers = lines[0].split(",")

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",")
        const entry: Record<string, string> = {}

        headers.forEach((header, index) => {
          entry[header.trim()] = values[index]?.trim() || ""
        })

        return entry
      })
  }

  return (
    <div className={cn("bg-zinc-800 rounded-lg p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-white">Import Data</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-300">
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-danger-500/20 text-danger-500 text-sm rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-success-500/20 text-success-500 text-sm rounded-md flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">What would you like to import?</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setImportType("transactions")}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm",
                  importType === "transactions"
                    ? "border-brand-400 bg-brand-900/20 text-brand-400"
                    : "border-zinc-700 text-gray-300 hover:bg-zinc-800",
                )}
              >
                <span>Transactions</span>
              </button>
              <button
                type="button"
                onClick={() => setImportType("accounts")}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm",
                  importType === "accounts"
                    ? "border-brand-400 bg-brand-900/20 text-brand-400"
                    : "border-zinc-700 text-gray-300 hover:bg-zinc-800",
                )}
              >
                <span>Accounts</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Upload File (CSV or JSON)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-zinc-700 rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-brand-400 hover:text-brand-300 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".csv,.json"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400">CSV or JSON up to 10MB</p>
              </div>
            </div>
            {file && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                <FileText className="w-4 h-4" />
                <span>{file.name}</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-400 mb-4">
              {importType === "transactions" ? (
                <>
                  For transactions, your CSV or JSON should include: <strong>title</strong>, <strong>amount</strong>,{" "}
                  <strong>type</strong> (incoming/outgoing), <strong>category</strong>, and <strong>accountId</strong>.
                </>
              ) : (
                <>
                  For accounts, your CSV or JSON should include: <strong>title</strong>, <strong>description</strong>,{" "}
                  <strong>balance</strong>, and <strong>type</strong> (savings/checking/investment/debt).
                </>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || !file}
            className={cn(
              "flex-1 px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium",
              "hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500",
              (isSubmitting || !file) && "opacity-70 cursor-not-allowed",
            )}
          >
            {isSubmitting ? "Importing..." : "Import Data"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-700 text-gray-300 
                    rounded-md text-sm font-medium hover:bg-zinc-800 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

