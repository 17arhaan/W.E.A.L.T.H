"use client"

import { useData } from "./data-provider"
import { BarChart2, LineChart, PieChart, TrendingUp } from "lucide-react"
import {
  MinimalExpenseBreakdown,
  MinimalSpendingTrends,
  MinimalBudgetComparison,
  MinimalSavingsGrowth,
} from "./charts/minimal-charts"

export default function AnalyticsPage() {
  const { isLoading, error } = useData()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-white border-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="bg-zinc-900 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-medium text-white mb-2">Unable to load analytics</h2>
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white mb-6">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-950 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-zinc-900">
            <h2 className="text-base font-medium text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-white" />
              Expense Breakdown
            </h2>
          </div>
          <div className="p-4 h-[300px]">
            <MinimalExpenseBreakdown />
          </div>
        </div>

        <div className="bg-zinc-950 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-zinc-900">
            <h2 className="text-base font-medium text-white flex items-center gap-2">
              <LineChart className="w-4 h-4 text-white" />
              Spending Trends
            </h2>
          </div>
          <div className="p-4 h-[300px]">
            <MinimalSpendingTrends />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-950 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-zinc-900">
            <h2 className="text-base font-medium text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-white" />
              Budget vs. Actual
            </h2>
          </div>
          <div className="p-4 h-[300px]">
            <MinimalBudgetComparison />
          </div>
        </div>

        <div className="bg-zinc-950 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-zinc-900">
            <h2 className="text-base font-medium text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white" />
              Savings Growth
            </h2>
          </div>
          <div className="p-4 h-[300px]">
            <MinimalSavingsGrowth />
          </div>
        </div>
      </div>
    </div>
  )
}

