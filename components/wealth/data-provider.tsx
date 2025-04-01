"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Account, Transaction, FinancialGoal, FinancialInsight, FinancialHealthScore } from "@/lib/types"

interface SpendingPattern {
  type: string
  description: string
  percentage: number
}

interface BudgetRecommendation {
  category: string
  currentBudget: number
  recommendedBudget: number
  reason: string
}

interface DashboardData {
  accounts: Account[]
  recentTransactions: Transaction[]
  transactions: Transaction[]
  goals: FinancialGoal[]
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  expenseBreakdown: { name: string; value: number; color: string }[]
  spendingTrends: { month: string; expenses: number; income: number }[]
  budgetComparison: { category: string; budget: number; actual: number }[]
  savingsGrowth: { month: string; savings: number; goal: number }[]
  healthScore: FinancialHealthScore
  insights: FinancialInsight[]
  spendingPatterns: SpendingPattern[]
  budgetRecommendations: BudgetRecommendation[]
  recurringTransactions: Transaction[]
  isLoading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

const DataContext = createContext<DashboardData | undefined>(undefined)

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Omit<DashboardData, "isLoading" | "error" | "refreshData">>({
    accounts: [],
    recentTransactions: [],
    transactions: [],
    goals: [],
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    expenseBreakdown: [],
    spendingTrends: [],
    budgetComparison: [],
    savingsGrowth: [],
    healthScore: { overall: 0, savings: 0, spending: 0, debt: 0, lastUpdated: "" },
    insights: [],
    spendingPatterns: [],
    budgetRecommendations: [],
    recurringTransactions: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/dashboard")
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const dashboardData = await response.json()

      // Add all transactions to the data (not just recent ones)
      const transactionsResponse = await fetch("/api/transactions")
      const transactionsData = await transactionsResponse.json()

      setData({
        ...dashboardData,
        transactions: transactionsData.transactions || [],
      })
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <DataContext.Provider
      value={{
        ...data,
        isLoading,
        error,
        refreshData: fetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

