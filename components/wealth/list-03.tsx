"use client"

import { cn } from "@/lib/utils"
import {
  Calendar,
  type LucideIcon,
  ArrowRight,
  CheckCircle2,
  Timer,
  AlertCircle,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Plus,
} from "lucide-react"
import React, { useState } from "react"
import type { FinancialGoal } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import AddGoalForm from "./add-goal-form"

interface List03Props {
  goals?: FinancialGoal[]
  className?: string
}

const statusConfig = {
  pending: {
    icon: Timer,
    class: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  "in-progress": {
    icon: AlertCircle,
    class: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  completed: {
    icon: CheckCircle2,
    class: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
}

export default function List03({ goals = [], className }: List03Props) {
  const [showAddForm, setShowAddForm] = useState(false)

  if (showAddForm) {
    return <AddGoalForm onClose={() => setShowAddForm(false)} className={className} />
  }

  if (!goals || goals.length === 0) {
    return (
      <div className={cn("w-full overflow-x-auto scrollbar-none", className)}>
        <div className="text-center py-8">
          <div className="bg-gray-100 dark:bg-zinc-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <PiggyBank className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No financial goals yet</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Set goals to track your financial progress</p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className={cn(
              "flex items-center justify-center gap-1 mx-auto",
              "py-1.5 px-3 rounded-md",
              "text-xs font-medium",
              "bg-gray-900 dark:bg-gray-100",
              "text-white dark:text-gray-900",
              "hover:bg-gray-800 dark:hover:bg-gray-200",
              "transition-all duration-200",
            )}
          >
            <Plus className="w-3 h-3" />
            <span>Create Goal</span>
          </button>
        </div>
      </div>
    )
  }

  const getGoalIcon = (title: string): LucideIcon => {
    if (title.toLowerCase().includes("emergency") || title.toLowerCase().includes("saving")) {
      return PiggyBank
    } else if (title.toLowerCase().includes("investment") || title.toLowerCase().includes("retirement")) {
      return TrendingUp
    } else if (title.toLowerCase().includes("debt") || title.toLowerCase().includes("loan")) {
      return CreditCard
    } else {
      return PiggyBank
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 min-w-full p-1 overflow-x-auto scrollbar-none">
          {goals.map((goal) => {
            const Icon = getGoalIcon(goal.title)
            const targetDate = new Date(goal.targetDate)
            const formattedDate = targetDate.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })

            return (
              <div
                key={goal.id}
                className={cn(
                  "flex flex-col",
                  "w-[260px] shrink-0",
                  "bg-gray-50 dark:bg-zinc-700/50",
                  "rounded-lg",
                  "transition-all duration-200",
                )}
              >
                <div className="p-3 space-y-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "p-1.5 rounded-md",
                        "bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300",
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                        statusConfig[goal.status].bg,
                        statusConfig[goal.status].class,
                      )}
                    >
                      {React.createElement(statusConfig[goal.status].icon, { className: "w-3 h-3" })}
                      {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{goal.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{goal.subtitle}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="text-gray-900 dark:text-white">{goal.progress}%</span>
                    </div>
                    <div className="h-1 bg-gray-100 dark:bg-zinc-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900 dark:bg-gray-300 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(goal.targetAmount)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">target</span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    <span>Target: {formattedDate}</span>
                  </div>
                </div>

                <div className="mt-auto pt-2">
                  <button
                    className={cn(
                      "w-full flex items-center justify-center gap-1",
                      "py-2 px-3",
                      "text-xs font-medium",
                      "text-gray-600 dark:text-gray-300",
                      "hover:text-gray-900 dark:hover:text-white",
                      "hover:bg-gray-100 dark:hover:bg-zinc-600",
                      "transition-colors duration-200",
                    )}
                  >
                    View Details
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex justify-center mt-2">
          <button
            onClick={() => setShowAddForm(true)}
            className={cn(
              "flex items-center justify-center gap-1",
              "py-1.5 px-3 rounded-md",
              "text-xs font-medium",
              "bg-gray-900 dark:bg-gray-100",
              "text-white dark:text-gray-900",
              "hover:bg-gray-800 dark:hover:bg-gray-200",
              "transition-all duration-200",
            )}
          >
            <Plus className="w-3 h-3" />
            <span>Add New Goal</span>
          </button>
        </div>
      </div>
    </div>
  )
}

