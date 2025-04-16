// Common types used throughout the application
export type TransactionType = "income" | "expense"
export type TransactionCategory =
  | "Income"
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Housing"
  | "Food"
  | "Transportation"
  | "Entertainment"
  | "Utilities"
  | "Bills"
  | "Shopping"
  | "Health"
  | "Education"
  | "Travel"
  | "Other"

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
}

export interface BudgetCategory {
  id: string
  name: string
  allocated: number
  spent: number
  color: string
}

export interface FinancialGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  status: "in-progress" | "completed" | "behind"
}

export interface Investment {
  id: string
  symbol: string
  name: string
  category: string
  shares: number
  price: number
  purchasePrice: number
  purchaseDate: string
  currentValue: number
  costBasis: number
  gainLoss: number
}

export interface OptimizationSuggestion {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  category: "expense" | "investment" | "budget" | "savings"
  potentialSavings?: number
  potentialReturn?: number
  implemented: boolean
  howToFix?: string
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  status: 'on_track' | 'at_risk' | 'off_track'
}

export interface FinancialData {
  transactions: Transaction[]
  investments: Investment[]
  goals: Goal[]
  income: number
  expenses: number
}

export interface Budget {
  id: string
  category: string
  amount: number
  spent: number
  remaining: number
}

export interface FinancialSummary {
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
}
