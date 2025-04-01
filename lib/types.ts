// Simplified types for our financial data models

export type AccountType = "savings" | "checking" | "investment" | "debt"
export type TransactionType = "incoming" | "outgoing"
export type TransactionCategory =
  | "housing"
  | "food"
  | "transport"
  | "utilities"
  | "entertainment"
  | "shopping"
  | "health"
  | "education"
  | "income"
  | "other"

export type TransactionStatus = "completed" | "pending"
export type GoalStatus = "pending" | "in-progress" | "completed"

export interface Account {
  id: string
  title: string
  description?: string
  balance: number
  type: AccountType
  timestamp?: string
}

export interface Transaction {
  id: string
  title: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  accountId: string
  timestamp: string
  status?: TransactionStatus
  isRecurring?: boolean
  recurringFrequency?: string
}

export interface FinancialGoal {
  id: string
  title: string
  subtitle: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  status: GoalStatus
  progress: number
  milestones?: { amount: number; date: string; achieved: boolean }[]
}

export interface Budget {
  id: string
  category: string
  budgetAmount: number
  actualAmount: number
  month: number
  year: number
}

export interface FinancialInsight {
  id: string
  type: "spending" | "saving" | "budget" | "goal"
  title: string
  description: string
  impact: "positive" | "negative" | "neutral"
  date: string
}

export interface FinancialHealthScore {
  overall: number // 0-100
  savings: number
  spending: number
  debt: number
  lastUpdated: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  subscription: string
  createdAt: Date
  updatedAt: Date
}

