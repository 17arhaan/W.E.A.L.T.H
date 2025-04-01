"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Wallet, QrCode, ArrowUpRight, CreditCard, X } from "lucide-react"
import type { AccountType } from "@/lib/types"
import { useData } from "./data-provider"

interface AddAccountFormProps {
  onClose: () => void
  className?: string
}

export default function AddAccountForm({ onClose, className }: AddAccountFormProps) {
  const { refreshData, accounts } = useData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    balance: "",
    type: "checking" as AccountType,
    accountNumber: "",
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
          balance: Number.parseFloat(formData.balance),
          type: formData.type,
          accountNumber: formData.accountNumber,
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
    <div className={cn("bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Add New Account</h2>
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

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Name*
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
              placeholder="e.g. Main Checking Account"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-md 
                      bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                      focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Daily expenses account"
            />
          </div>

          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Number*
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleAccountNumberChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-md 
                      bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                      focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. XXXX-XXXX"
              required
            />
          </div>

          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Balance*
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                id="balance"
                name="balance"
                value={formData.balance}
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
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                      ? "border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                      : "border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800",
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
              "flex-1 px-4 py-2 bg-brand-600 dark:bg-brand-600 text-white dark:text-white rounded-md text-sm font-medium",
              "hover:bg-brand-700 dark:hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500",
              isSubmitting && "opacity-70 cursor-not-allowed",
            )}
          >
            {isSubmitting ? "Creating..." : "Create Account"}
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
    </div>
  )
}

