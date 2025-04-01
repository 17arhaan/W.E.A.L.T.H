// Minimal data service with functions to add and manage data

import type { Account, Transaction, FinancialGoal, Budget, FinancialInsight, FinancialHealthScore } from "./types"

// In-memory data store
export const data = {
  accounts: [] as Account[],
  transactions: [] as Transaction[],
  goals: [] as FinancialGoal[],
  budgets: [] as Budget[],
  insights: [] as FinancialInsight[],
  healthScore: {
    overall: 0,
    savings: 0,
    spending: 0,
    debt: 0,
    lastUpdated: new Date().toISOString(),
  } as FinancialHealthScore,
}

// Generate a simple ID
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Data access functions
export function getAccounts() {
  return data.accounts
}

export function getTransactions() {
  return data.transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function getGoals() {
  return data.goals
}

export function getBudgets() {
  return data.budgets
}

export function getInsights() {
  return data.insights
}

export function getHealthScore() {
  return data.healthScore
}

// Data mutation functions
export function addAccount(account: Omit<Account, "id">): Account {
  const newAccount = {
    ...account,
    id: generateId("acc"),
  }

  data.accounts.push(newAccount)

  // Recalculate health score after adding account
  calculateFinancialHealthScore()

  return newAccount
}

export function updateAccount(id: string, updates: Partial<Account>): Account | null {
  const index = data.accounts.findIndex((acc) => acc.id === id)
  if (index === -1) return null

  data.accounts[index] = {
    ...data.accounts[index],
    ...updates,
  }

  // Recalculate health score after updating account
  calculateFinancialHealthScore()

  return data.accounts[index]
}

export function deleteAccount(id: string): boolean {
  const initialLength = data.accounts.length
  data.accounts = data.accounts.filter((acc) => acc.id !== id)

  // Also delete all transactions associated with this account
  data.transactions = data.transactions.filter((tx) => tx.accountId !== id)

  // Recalculate health score after deleting account
  calculateFinancialHealthScore()

  return data.accounts.length < initialLength
}

export function addTransaction(transaction: Omit<Transaction, "id">): Transaction {
  const newTransaction = {
    ...transaction,
    id: generateId("tx"),
  }

  data.transactions.push(newTransaction)

  // Update account balance
  const accountIndex = data.accounts.findIndex((acc) => acc.id === transaction.accountId)
  if (accountIndex !== -1) {
    const account = data.accounts[accountIndex]
    if (transaction.type === "incoming") {
      account.balance += transaction.amount
    } else {
      account.balance -= transaction.amount
    }
  }

  // Generate insights based on new transaction
  generateInsightsFromTransaction(newTransaction)

  // Recalculate health score after adding transaction
  calculateFinancialHealthScore()

  return newTransaction
}

export function updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
  const index = data.transactions.findIndex((tx) => tx.id === id)
  if (index === -1) return null

  const oldTransaction = data.transactions[index]

  // If amount or type changed, update account balance
  if (updates.amount !== undefined || updates.type !== undefined || updates.accountId !== undefined) {
    // Reverse the effect of the old transaction
    const oldAccountIndex = data.accounts.findIndex((acc) => acc.id === oldTransaction.accountId)
    if (oldAccountIndex !== -1) {
      const oldAccount = data.accounts[oldAccountIndex]
      if (oldTransaction.type === "incoming") {
        oldAccount.balance -= oldTransaction.amount
      } else {
        oldAccount.balance += oldTransaction.amount
      }
    }

    // Apply the effect of the new transaction
    const newAccountId = updates.accountId || oldTransaction.accountId
    const newType = updates.type || oldTransaction.type
    const newAmount = updates.amount || oldTransaction.amount

    const newAccountIndex = data.accounts.findIndex((acc) => acc.id === newAccountId)
    if (newAccountIndex !== -1) {
      const newAccount = data.accounts[newAccountIndex]
      if (newType === "incoming") {
        newAccount.balance += newAmount
      } else {
        newAccount.balance -= newAmount
      }
    }
  }

  data.transactions[index] = {
    ...oldTransaction,
    ...updates,
  }

  // Recalculate health score after updating transaction
  calculateFinancialHealthScore()

  return data.transactions[index]
}

export function deleteTransaction(id: string): boolean {
  const transaction = data.transactions.find((tx) => tx.id === id)
  if (!transaction) return false

  // Reverse the effect on account balance
  const accountIndex = data.accounts.findIndex((acc) => acc.id === transaction.accountId)
  if (accountIndex !== -1) {
    const account = data.accounts[accountIndex]
    if (transaction.type === "incoming") {
      account.balance -= transaction.amount
    } else {
      account.balance += transaction.amount
    }
  }

  const initialLength = data.transactions.length
  data.transactions = data.transactions.filter((tx) => tx.id !== id)

  // Recalculate health score after deleting transaction
  calculateFinancialHealthScore()

  return data.transactions.length < initialLength
}

// Analytics functions
export function getTotalBalance() {
  return data.accounts.reduce((total, account) => {
    return account.type === "debt" ? total - account.balance : total + account.balance
  }, 0)
}

export function getMonthlyIncome() {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  return data.transactions
    .filter((tx) => {
      const txDate = new Date(tx.timestamp)
      return tx.type === "incoming" && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
    })
    .reduce((total, tx) => total + tx.amount, 0)
}

export function getMonthlyExpenses() {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  return data.transactions
    .filter((tx) => {
      const txDate = new Date(tx.timestamp)
      return tx.type === "outgoing" && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
    })
    .reduce((total, tx) => total + tx.amount, 0)
}

export function getExpenseBreakdown() {
  const categories = {} as Record<string, number>
  const colors = {
    housing: "#0ea5e9",
    food: "#10b981",
    transport: "#f59e0b",
    utilities: "#ec4899",
    entertainment: "#8b5cf6",
    shopping: "#ef4444",
    health: "#06b6d4",
    education: "#6366f1",
    income: "#84cc16",
    other: "#6b7280",
  }

  data.transactions
    .filter((tx) => tx.type === "outgoing")
    .forEach((tx) => {
      if (!categories[tx.category]) {
        categories[tx.category] = 0
      }
      categories[tx.category] += tx.amount
    })

  return Object.entries(categories).map(([name, value]) => ({
    name,
    value,
    color: colors[name as keyof typeof colors] || "#6b7280",
  }))
}

export function getSpendingTrends() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const result = []

  // Calculate actual spending trends from transaction data
  const currentYear = new Date().getFullYear()

  for (let i = 0; i < 12; i++) {
    const monthExpenses = data.transactions
      .filter((tx) => {
        const txDate = new Date(tx.timestamp)
        return tx.type === "outgoing" && txDate.getMonth() === i && txDate.getFullYear() === currentYear
      })
      .reduce((total, tx) => total + tx.amount, 0)

    const monthIncome = data.transactions
      .filter((tx) => {
        const txDate = new Date(tx.timestamp)
        return tx.type === "incoming" && txDate.getMonth() === i && txDate.getFullYear() === currentYear
      })
      .reduce((total, tx) => total + tx.amount, 0)

    result.push({
      month: months[i],
      expenses: monthExpenses,
      income: monthIncome,
    })
  }

  return result
}

export function getSavingsGrowth() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const result = []

  // Calculate actual savings growth from transaction data
  const currentYear = new Date().getFullYear()
  let cumulativeSavings = 0

  for (let i = 0; i < 12; i++) {
    const monthIncome = data.transactions
      .filter((tx) => {
        const txDate = new Date(tx.timestamp)
        return tx.type === "incoming" && txDate.getMonth() === i && txDate.getFullYear() === currentYear
      })
      .reduce((total, tx) => total + tx.amount, 0)

    const monthExpenses = data.transactions
      .filter((tx) => {
        const txDate = new Date(tx.timestamp)
        return tx.type === "outgoing" && txDate.getMonth() === i && txDate.getFullYear() === currentYear
      })
      .reduce((total, tx) => total + tx.amount, 0)

    const monthlySavings = monthIncome - monthExpenses
    cumulativeSavings += monthlySavings

    // Get savings goal from financial goals if available
    const savingsGoal = data.goals
      .filter((goal) => goal.title.toLowerCase().includes("saving"))
      .reduce((total, goal) => total + (goal.targetAmount / 12) * (i + 1), 0)

    result.push({
      month: months[i],
      savings: Math.max(0, cumulativeSavings),
      goal: savingsGoal || 0,
    })
  }

  return result
}

export function getBudgetComparison() {
  return data.budgets.map((budget) => ({
    category: budget.category,
    budget: budget.budgetAmount,
    actual: budget.actualAmount,
  }))
}

// Calculate financial health score based on real data
export function calculateFinancialHealthScore() {
  if (data.accounts.length === 0 && data.transactions.length === 0) {
    data.healthScore = {
      overall: 0,
      savings: 0,
      spending: 0,
      debt: 0,
      lastUpdated: new Date().toISOString(),
    }
    return data.healthScore
  }

  // Calculate savings score
  const savingsScore = calculateSavingsScore()

  // Calculate spending score
  const spendingScore = calculateSpendingScore()

  // Calculate debt score
  const debtScore = calculateDebtScore()

  // Calculate overall score (weighted average)
  const overall = Math.round(savingsScore * 0.4 + spendingScore * 0.3 + debtScore * 0.3)

  data.healthScore = {
    overall,
    savings: savingsScore,
    spending: spendingScore,
    debt: debtScore,
    lastUpdated: new Date().toISOString(),
  }

  return data.healthScore
}

function calculateSavingsScore(): number {
  // Simple calculation for demo purposes
  if (data.accounts.length === 0) return 0

  const savingsAccounts = data.accounts.filter((a) => a.type === "savings" || a.type === "investment")
  if (savingsAccounts.length === 0) return 30 // Base score

  const totalSavings = savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0)
  const totalIncome = getMonthlyIncome()

  // If we have income data, calculate score based on savings-to-income ratio
  if (totalIncome > 0) {
    const monthsOfExpenses = totalSavings / totalIncome

    // Score based on months of expenses saved
    if (monthsOfExpenses >= 6) return 100
    if (monthsOfExpenses >= 3) return 85
    if (monthsOfExpenses >= 1) return 70
    if (monthsOfExpenses >= 0.5) return 50
    return 40
  }

  // Fallback score based on absolute savings amount
  if (totalSavings > 10000) return 80
  if (totalSavings > 5000) return 65
  if (totalSavings > 1000) return 50
  return 40
}

function calculateSpendingScore(): number {
  // Simple calculation for demo purposes
  if (data.transactions.length === 0) return 0

  const monthlyIncome = getMonthlyIncome()
  const monthlyExpenses = getMonthlyExpenses()

  if (monthlyIncome === 0) return 50 // Base score

  const spendingRatio = monthlyExpenses / monthlyIncome

  // Score based on spending-to-income ratio
  if (spendingRatio <= 0.5) return 100
  if (spendingRatio <= 0.7) return 85
  if (spendingRatio <= 0.9) return 70
  if (spendingRatio <= 1.0) return 50
  return 30
}

function calculateDebtScore(): number {
  // Simple calculation for demo purposes
  const debtAccounts = data.accounts.filter((a) => a.type === "debt")
  if (debtAccounts.length === 0) return 100 // No debt is perfect

  const totalDebt = debtAccounts.reduce((sum, acc) => sum + acc.balance, 0)
  const monthlyIncome = getMonthlyIncome()

  if (monthlyIncome === 0) return 50 // Base score

  const debtToIncomeRatio = totalDebt / (monthlyIncome * 12)

  // Score based on debt-to-annual-income ratio
  if (debtToIncomeRatio <= 0.1) return 100
  if (debtToIncomeRatio <= 0.3) return 85
  if (debtToIncomeRatio <= 0.5) return 70
  if (debtToIncomeRatio <= 1.0) return 50
  return 30
}

// Generate financial insights based on real data
export function generateInsightsFromTransaction(transaction: Transaction) {
  // Only generate insights if we have enough data
  if (data.transactions.length < 2) return

  const insights: FinancialInsight[] = []

  // Check for large expenses (above 15k) vs normal expenses
  if (transaction.type === "outgoing") {
    if (transaction.amount > 15000) {
      insights.push({
        id: generateId("insight"),
        type: "spending",
        title: "Large Expense Detected",
        description: `You spent ${formatCurrency(transaction.amount)} on ${transaction.title}`,
        impact: "negative",
        date: new Date().toISOString(),
      })
    } else {
      insights.push({
        id: generateId("insight"),
        type: "spending",
        title: "Normal Expense Recorded",
        description: `You spent ${formatCurrency(transaction.amount)} on ${transaction.title}`,
        impact: "neutral",
        date: new Date().toISOString(),
      })
    }
  }

  // Check for income
  if (transaction.type === "incoming" && transaction.amount > 1000) {
    insights.push({
      id: generateId("insight"),
      type: "saving",
      title: "Income Received",
      description: `You received ${formatCurrency(transaction.amount)} from ${transaction.title}`,
      impact: "positive",
      date: new Date().toISOString(),
    })
  }

  // Add insights to the data store
  if (insights.length > 0) {
    data.insights = [...insights, ...data.insights].slice(0, 10) // Keep only the 10 most recent insights
  }
}

// Get recurring transactions
export function getRecurringTransactions() {
  // In a real app, this would identify recurring transactions
  // For this demo, we'll just return transactions that have similar amounts and categories
  const transactions = data.transactions
  if (transactions.length < 3) return []

  const potentialRecurring: Record<string, Transaction[]> = {}

  // Group transactions by category and similar amounts
  transactions.forEach((tx) => {
    const key = `${tx.category}_${Math.round(tx.amount / 10) * 10}`
    if (!potentialRecurring[key]) {
      potentialRecurring[key] = []
    }
    potentialRecurring[key].push(tx)
  })

  // Filter for groups with at least 2 transactions
  const recurringGroups = Object.values(potentialRecurring).filter((group) => group.length >= 2)

  // Take the most recent transaction from each recurring group
  return recurringGroups.map((group) => {
    const mostRecent = group.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

    return {
      ...mostRecent,
      isRecurring: true,
      recurringFrequency: "monthly", // Simplified for demo
    }
  })
}

// Get spending patterns
export function getSpendingPatterns() {
  if (data.transactions.length < 5) return []

  const patterns = []

  // Check for weekend spending
  const weekendTransactions = data.transactions.filter((tx) => {
    const date = new Date(tx.timestamp)
    return tx.type === "outgoing" && (date.getDay() === 0 || date.getDay() === 6)
  })

  const weekdayTransactions = data.transactions.filter((tx) => {
    const date = new Date(tx.timestamp)
    return tx.type === "outgoing" && date.getDay() > 0 && date.getDay() < 6
  })

  const weekendSpending = weekendTransactions.reduce((sum, tx) => sum + tx.amount, 0)
  const weekdaySpending = weekdayTransactions.reduce((sum, tx) => sum + tx.amount, 0)

  if (weekendTransactions.length > 0 && weekdayTransactions.length > 0) {
    const weekendAvg = weekendSpending / weekendTransactions.length
    const weekdayAvg = weekdaySpending / weekdayTransactions.length

    if (weekendAvg > weekdayAvg * 1.5) {
      patterns.push({
        type: "weekend",
        description: "You spend significantly more on weekends",
        percentage: Math.round((weekendSpending / (weekendSpending + weekdaySpending)) * 100),
      })
    }
  }

  // Check for category patterns
  const categories: Record<string, number> = {}
  data.transactions
    .filter((tx) => tx.type === "outgoing")
    .forEach((tx) => {
      if (!categories[tx.category]) {
        categories[tx.category] = 0
      }
      categories[tx.category] += tx.amount
    })

  const totalSpending = Object.values(categories).reduce((sum, val) => sum + val, 0)

  if (totalSpending > 0) {
    Object.entries(categories).forEach(([category, amount]) => {
      const percentage = (amount / totalSpending) * 100
      if (percentage > 30) {
        patterns.push({
          type: "category",
          description: `${category.charAt(0).toUpperCase() + category.slice(1)} makes up ${Math.round(percentage)}% of your spending`,
          percentage: Math.round(percentage),
        })
      }
    })
  }

  return patterns
}

// Get budget recommendations
export function getBudgetRecommendations() {
  if (data.budgets.length === 0 || data.transactions.length < 5) return []

  const recommendations = []

  // For demo purposes, generate a recommendation based on spending categories
  const categories: Record<string, number> = {}
  data.transactions
    .filter((tx) => tx.type === "outgoing")
    .forEach((tx) => {
      if (!categories[tx.category]) {
        categories[tx.category] = 0
      }
      categories[tx.category] += tx.amount
    })

  // Find the top spending category
  let topCategory = ""
  let topAmount = 0

  Object.entries(categories).forEach(([category, amount]) => {
    if (amount > topAmount) {
      topCategory = category
      topAmount = amount
    }
  })

  if (topCategory && topAmount > 0) {
    // Check if we have a budget for this category
    const existingBudget = data.budgets.find((b) => b.category === topCategory)

    if (!existingBudget) {
      // Recommend creating a budget
      recommendations.push({
        category: topCategory,
        currentBudget: 0,
        recommendedBudget: Math.round(topAmount * 0.9),
        reason: "Based on your spending patterns",
      })
    } else if (existingBudget.actualAmount > existingBudget.budgetAmount * 1.1) {
      // Recommend increasing budget
      recommendations.push({
        category: topCategory,
        currentBudget: existingBudget.budgetAmount,
        recommendedBudget: Math.round(existingBudget.actualAmount * 0.95),
        reason: "Consistently over budget",
      })
    }
  }

  return recommendations
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function addGoal(goal: Omit<FinancialGoal, "id">): FinancialGoal {
  const newGoal = {
    ...goal,
    id: generateId("goal"),
  }

  data.goals.push(newGoal)
  return newGoal
}

