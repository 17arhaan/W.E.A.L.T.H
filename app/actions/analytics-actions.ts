"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function getMonthlyExpenses(year = new Date().getFullYear()) {
  const user = auth.getUser()

  if (!user) {
    return []
  }

  return db.getMonthlyExpenses(user.id, year)
}

export async function getExpenseBreakdown(month?: number, year = new Date().getFullYear()) {
  const user = auth.getUser()

  if (!user) {
    return []
  }

  return db.getExpenseBreakdown(user.id, month, year)
}

export async function getSavingsGrowth(year = new Date().getFullYear()) {
  const user = auth.getUser()

  if (!user) {
    return []
  }

  return db.getSavingsGrowth(user.id, year)
}

export async function getDashboardSummary() {
  const user = auth.getUser()

  if (!user) {
    return { totalBalance: 0, income: 0, expenses: 0 }
  }

  const totalBalance = db.getTotalBalance(user.id)
  const { income, expenses } = db.getMonthlyTotals(user.id)

  return {
    totalBalance,
    income,
    expenses,
  }
}

export async function getBudgetComparison(month = new Date().getMonth(), year = new Date().getFullYear()) {
  const user = auth.getUser()

  if (!user) {
    return []
  }

  const budgets = db.getBudgets(user.id, month, year)

  return budgets.map((budget) => ({
    category: budget.category,
    budget: budget.budgetAmount,
    actual: budget.actualAmount,
  }))
}

