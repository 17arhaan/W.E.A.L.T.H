// Simple in-memory database for demo purposes
// In a real application, you would use a proper database like PostgreSQL, MongoDB, etc.

import type { Account, Transaction, FinancialGoal, Budget, User } from "./types"
import { v4 as uuidv4 } from "uuid"

// In-memory storage
const users: User[] = []
const accounts: Account[] = []
const transactions: Transaction[] = []
const goals: FinancialGoal[] = []
const budgets: Budget[] = []

// Initialize with some demo data
const initializeDb = () => {
  // Create a demo user if none exists
  if (users.length === 0) {
    const userId = uuidv4()

    // Demo user
    users.push({
      id: userId,
      name: "Eugene An",
      email: "eugene@example.com",
      role: "Financial Manager",
      subscription: "Free Trial",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Demo accounts
    accounts.push(
      {
        id: uuidv4(),
        userId,
        title: "Main Savings",
        description: "Personal savings",
        balance: 8459.45,
        type: "savings",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId,
        title: "Checking Account",
        description: "Daily expenses",
        balance: 2850.0,
        type: "checking",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId,
        title: "Investment Portfolio",
        description: "Stock & ETFs",
        balance: 15230.8,
        type: "investment",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId,
        title: "Credit Card",
        description: "Pending charges",
        balance: 1200.0,
        type: "debt",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    )

    // Demo transactions
    const categories = ["shopping", "food", "transport", "entertainment", "income", "bills"]
    const titles = [
      "Apple Store Purchase",
      "Salary Deposit",
      "Netflix Subscription",
      "Grocery Shopping",
      "Gas Station",
      "Rent Payment",
      "Dividend Income",
      "Restaurant Bill",
    ]

    for (let i = 0; i < 20; i++) {
      const isIncoming = Math.random() > 0.7
      const amount = isIncoming ? Math.floor(Math.random() * 5000) + 1000 : Math.floor(Math.random() * 1000) + 10

      const daysAgo = Math.floor(Math.random() * 30)
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)

      transactions.push({
        id: uuidv4(),
        userId,
        accountId: accounts[Math.floor(Math.random() * accounts.length)].id,
        title: titles[Math.floor(Math.random() * titles.length)],
        amount,
        type: isIncoming ? "incoming" : "outgoing",
        category: categories[Math.floor(Math.random() * categories.length)],
        timestamp: date,
        status: Math.random() > 0.1 ? "completed" : "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Demo financial goals
    goals.push(
      {
        id: uuidv4(),
        userId,
        title: "Emergency Fund",
        subtitle: "3 months of expenses saved",
        targetAmount: 15000,
        currentAmount: 9750,
        targetDate: new Date(2024, 11, 31), // Dec 31, 2024
        status: "in-progress",
        progress: 65,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId,
        title: "Retirement Investment",
        subtitle: "Annual contribution goal",
        targetAmount: 6000,
        currentAmount: 4500,
        targetDate: new Date(2024, 11, 31), // Dec 31, 2024
        status: "in-progress",
        progress: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId,
        title: "Debt Reduction",
        subtitle: "Credit card and loan payoff",
        targetAmount: 25000,
        currentAmount: 11250,
        targetDate: new Date(2025, 2, 31), // Mar 31, 2025
        status: "in-progress",
        progress: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    )

    // Demo budgets
    const budgetCategories = ["Housing", "Food", "Transport", "Utilities", "Entertainment", "Other"]

    for (const category of budgetCategories) {
      const budgetAmount = Math.floor(Math.random() * 1500) + 250
      const actualAmount = Math.floor(budgetAmount * (0.8 + Math.random() * 0.4))

      budgets.push({
        id: uuidv4(),
        userId,
        category,
        budgetAmount,
        actualAmount,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  }
}

// Initialize the database
initializeDb()

// Database operations
export const db = {
  // User operations
  getUser: (id: string) => users.find((user) => user.id === id),
  getUserByEmail: (email: string) => users.find((user) => user.email === email),
  createUser: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    const newUser = {
      ...user,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    users.push(newUser)
    return newUser
  },
  updateUser: (id: string, data: Partial<User>) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...data,
        updatedAt: new Date(),
      }
      return users[index]
    }
    return null
  },

  // Account operations
  getAccounts: (userId: string) => accounts.filter((account) => account.userId === userId),
  getAccount: (id: string) => accounts.find((account) => account.id === id),
  createAccount: (account: Omit<Account, "id" | "createdAt" | "updatedAt">) => {
    const newAccount = {
      ...account,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    accounts.push(newAccount)
    return newAccount
  },
  updateAccount: (id: string, data: Partial<Account>) => {
    const index = accounts.findIndex((account) => account.id === id)
    if (index !== -1) {
      accounts[index] = {
        ...accounts[index],
        ...data,
        updatedAt: new Date(),
      }
      return accounts[index]
    }
    return null
  },
  deleteAccount: (id: string) => {
    const index = accounts.findIndex((account) => account.id === id)
    if (index !== -1) {
      const deleted = accounts[index]
      accounts.splice(index, 1)
      return deleted
    }
    return null
  },

  // Transaction operations
  getTransactions: (userId: string, limit?: number) => {
    let result = transactions
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    if (limit) {
      result = result.slice(0, limit)
    }

    return result
  },
  getTransaction: (id: string) => transactions.find((transaction) => transaction.id === id),
  createTransaction: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    transactions.push(newTransaction)

    // Update account balance
    const account = accounts.find((a) => a.id === transaction.accountId)
    if (account) {
      const balanceChange = transaction.type === "incoming" ? transaction.amount : -transaction.amount
      account.balance += balanceChange
      account.updatedAt = new Date()
    }

    return newTransaction
  },
  updateTransaction: (id: string, data: Partial<Transaction>) => {
    const index = transactions.findIndex((transaction) => transaction.id === id)
    if (index !== -1) {
      // If amount or type changed, update account balance
      if (data.amount !== undefined || data.type !== undefined) {
        const oldTransaction = transactions[index]
        const account = accounts.find((a) => a.id === oldTransaction.accountId)

        if (account) {
          // Reverse the old transaction effect
          const oldBalanceChange = oldTransaction.type === "incoming" ? -oldTransaction.amount : oldTransaction.amount
          account.balance += oldBalanceChange

          // Apply the new transaction effect
          const newType = data.type || oldTransaction.type
          const newAmount = data.amount || oldTransaction.amount
          const newBalanceChange = newType === "incoming" ? newAmount : -newAmount
          account.balance += newBalanceChange
          account.updatedAt = new Date()
        }
      }

      transactions[index] = {
        ...transactions[index],
        ...data,
        updatedAt: new Date(),
      }
      return transactions[index]
    }
    return null
  },
  deleteTransaction: (id: string) => {
    const index = transactions.findIndex((transaction) => transaction.id === id)
    if (index !== -1) {
      const deleted = transactions[index]

      // Update account balance
      const account = accounts.find((a) => a.id === deleted.accountId)
      if (account) {
        const balanceChange = deleted.type === "incoming" ? -deleted.amount : deleted.amount
        account.balance += balanceChange
        account.updatedAt = new Date()
      }

      transactions.splice(index, 1)
      return deleted
    }
    return null
  },

  // Financial goal operations
  getGoals: (userId: string) => goals.filter((goal) => goal.userId === userId),
  getGoal: (id: string) => goals.find((goal) => goal.id === id),
  createGoal: (goal: Omit<FinancialGoal, "id" | "createdAt" | "updatedAt">) => {
    const newGoal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    goals.push(newGoal)
    return newGoal
  },
  updateGoal: (id: string, data: Partial<FinancialGoal>) => {
    const index = goals.findIndex((goal) => goal.id === id)
    if (index !== -1) {
      goals[index] = {
        ...goals[index],
        ...data,
        updatedAt: new Date(),
      }

      // Recalculate progress if amounts changed
      if (data.currentAmount !== undefined || data.targetAmount !== undefined) {
        const current = data.currentAmount || goals[index].currentAmount
        const target = data.targetAmount || goals[index].targetAmount
        goals[index].progress = Math.round((current / target) * 100)
      }

      return goals[index]
    }
    return null
  },
  deleteGoal: (id: string) => {
    const index = goals.findIndex((goal) => goal.id === id)
    if (index !== -1) {
      const deleted = goals[index]
      goals.splice(index, 1)
      return deleted
    }
    return null
  },

  // Budget operations
  getBudgets: (userId: string, month?: number, year?: number) => {
    let result = budgets.filter((budget) => budget.userId === userId)

    if (month !== undefined && year !== undefined) {
      result = result.filter((budget) => budget.month === month && budget.year === year)
    }

    return result
  },
  getBudget: (id: string) => budgets.find((budget) => budget.id === id),
  createBudget: (budget: Omit<Budget, "id" | "createdAt" | "updatedAt">) => {
    const newBudget = {
      ...budget,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    budgets.push(newBudget)
    return newBudget
  },
  updateBudget: (id: string, data: Partial<Budget>) => {
    const index = budgets.findIndex((budget) => budget.id === id)
    if (index !== -1) {
      budgets[index] = {
        ...budgets[index],
        ...data,
        updatedAt: new Date(),
      }
      return budgets[index]
    }
    return null
  },
  deleteBudget: (id: string) => {
    const index = budgets.findIndex((budget) => budget.id === id)
    if (index !== -1) {
      const deleted = budgets[index]
      budgets.splice(index, 1)
      return deleted
    }
    return null
  },

  // Analytics operations
  getMonthlyExpenses: (userId: string, year: number) => {
    const monthlyExpenses = Array(12).fill(0)
    const monthlyIncome = Array(12).fill(0)

    transactions
      .filter((t) => t.userId === userId && new Date(t.timestamp).getFullYear() === year)
      .forEach((t) => {
        const month = new Date(t.timestamp).getMonth()
        if (t.type === "outgoing") {
          monthlyExpenses[month] += t.amount
        } else {
          monthlyIncome[month] += t.amount
        }
      })

    return Array(12)
      .fill(0)
      .map((_, i) => ({
        month: new Date(year, i, 1).toLocaleString("default", { month: "short" }),
        expenses: Math.round(monthlyExpenses[i]),
        income: Math.round(monthlyIncome[i]),
      }))
  },

  getExpenseBreakdown: (userId: string, month?: number, year?: number) => {
    const categories: Record<string, number> = {}

    const filteredTransactions = transactions.filter((t) => {
      if (t.userId !== userId || t.type !== "outgoing") return false

      if (month !== undefined && year !== undefined) {
        const transactionDate = new Date(t.timestamp)
        return transactionDate.getMonth() === month && transactionDate.getFullYear() === year
      }

      return true
    })

    filteredTransactions.forEach((t) => {
      if (!categories[t.category]) {
        categories[t.category] = 0
      }
      categories[t.category] += t.amount
    })

    // Convert to array format for charts
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: Math.round(value),
      color: getCategoryColor(name),
    }))
  },

  getSavingsGrowth: (userId: string, year: number) => {
    const monthlyData = Array(12)
      .fill(0)
      .map((_, i) => ({
        month: new Date(year, i, 1).toLocaleString("default", { month: "short" }),
        savings: 0,
        goal: 0,
      }))

    // Set some sample data
    let savings = 5000
    const monthlyGoal = 1000

    for (let i = 0; i < 12; i++) {
      // Add some randomness to the savings growth
      const growth = monthlyGoal + (Math.random() * 500 - 250)
      savings += growth

      monthlyData[i].savings = Math.round(savings)
      monthlyData[i].goal = 5000 + (i + 1) * monthlyGoal
    }

    return monthlyData
  },

  // Get total balance across all accounts
  getTotalBalance: (userId: string) => {
    return accounts
      .filter((account) => account.userId === userId)
      .reduce((total, account) => {
        // For debt accounts, subtract from total
        if (account.type === "debt") {
          return total - account.balance
        }
        return total + account.balance
      }, 0)
  },

  // Get monthly income and expenses
  getMonthlyTotals: (userId: string) => {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    let income = 0
    let expenses = 0

    transactions
      .filter((t) => t.userId === userId && t.timestamp >= firstDayOfMonth)
      .forEach((t) => {
        if (t.type === "incoming") {
          income += t.amount
        } else {
          expenses += t.amount
        }
      })

    return { income, expenses }
  },
}

// Helper function to get a color for a category
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    housing: "#0ea5e9",
    food: "#10b981",
    transport: "#f59e0b",
    entertainment: "#8b5cf6",
    utilities: "#ec4899",
    shopping: "#ef4444",
    income: "#10b981",
    bills: "#6366f1",
  }

  return colors[category.toLowerCase()] || "#6b7280"
}

