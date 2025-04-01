"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { X, PiggyBank, TrendingUp, CreditCard, Calendar } from "lucide-react"
import type { GoalStatus } from "@/lib/types"
import { useData } from "./data-provider"

interface AddGoalFormProps {
  onClose: () => void
  className?: string
}

export default function AddGoalForm({ onClose, className }: AddGoalFormProps) {
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
    <div className={cn("bg-white dark:bg-zinc-800 rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Add New Financial Goal</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Goal Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md 
                        bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Emergency Fund"
              required
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md 
                        bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 3 months of expenses saved"
            />
          </div>

          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Amount*
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                id="targetAmount"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md 
                          bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                id="currentAmount"
                name="currentAmount"
                value={formData.currentAmount}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md 
                          bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Date*
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md 
                          bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md 
                        bg-white dark:bg-zinc-900 text-gray-900 dark:text-white 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center gap-1 p-2 border rounded-md text-sm",
                  "border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800",
                )}
              >
                <PiggyBank className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Savings</span>
              </button>
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center gap-1 p-2 border rounded-md text-sm",
                  "border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800",
                )}
              >
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Investment</span>
              </button>
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center gap-1 p-2 border rounded-md text-sm",
                  "border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800",
                )}
              >
                <CreditCard className="w-5 h-5 text-red-600 dark:text-red-400" />
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
              "flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium",
              "hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              isSubmitting && "opacity-70 cursor-not-allowed",
            )}
          >
            {isSubmitting ? "Creating..." : "Create Goal"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 
                      rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

