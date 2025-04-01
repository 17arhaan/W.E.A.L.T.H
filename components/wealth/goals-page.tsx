"use client"

import { useState } from "react"
import { useData } from "./data-provider"
import { Calendar, PiggyBank, Plus, ArrowRight, TrendingUp, CreditCard } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { FinancialGoal } from "@/lib/types"
import AddGoalForm from "./add-goal-form"

export default function GoalsPage() {
  const { goals, isLoading, error } = useData()
  const [showAddForm, setShowAddForm] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-gray-900 dark:border-t-white border-gray-200 dark:border-gray-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading goals...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <PiggyBank className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Unable to load goals</h2>
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
        <AddGoalForm onClose={() => setShowAddForm(false)} />
      </div>
    )
  }

  const getGoalIcon = (title: string) => {
    if (title.toLowerCase().includes("emergency") || title.toLowerCase().includes("saving")) {
      return <PiggyBank className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    } else if (title.toLowerCase().includes("investment") || title.toLowerCase().includes("retirement")) {
      return <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
    } else if (title.toLowerCase().includes("debt") || title.toLowerCase().includes("loan")) {
      return <CreditCard className="w-5 h-5 text-red-600 dark:text-red-400" />
    } else {
      return <PiggyBank className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Financial Goals</h1>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-zinc-800 rounded-lg p-8 text-center">
            <div className="bg-gray-100 dark:bg-zinc-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <PiggyBank className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No financial goals yet</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Set goals to track your financial progress</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Create Goal</span>
            </button>
          </div>
        ) : (
          goals.map((goal: FinancialGoal) => {
            const targetDate = new Date(goal.targetDate)
            const formattedDate = targetDate.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })

            return (
              <div key={goal.id} className="bg-white dark:bg-zinc-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-md bg-gray-100 dark:bg-zinc-700">{getGoalIcon(goal.title)}</div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 capitalize">
                    {goal.status.replace("-", " ")}
                  </div>
                </div>

                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">{goal.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{goal.subtitle}</p>

                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="text-gray-900 dark:text-white">{goal.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-zinc-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 dark:bg-gray-300 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    <span>Target: {formattedDate}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(goal.targetAmount)}
                  </span>
                </div>

                <button className="mt-3 w-full flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-md transition-colors">
                  View Details
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

