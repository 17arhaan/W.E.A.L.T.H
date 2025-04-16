import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency in INR format
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Calculate gain/loss percentage
export function calculateGainLoss(currentValue: number, costBasis: number): number {
  return ((currentValue - costBasis) / costBasis) * 100
}

// Calculate total value of investments
export function calculateTotalValue(investments: Investment[]): number {
  return investments.reduce((total, investment) => total + investment.currentValue, 0)
}

// Calculate total cost basis of investments
export function calculateTotalCostBasis(investments: Investment[]): number {
  return investments.reduce((total, investment) => total + investment.costBasis, 0)
}

// Format date to locale string
export function formatDate(date: Date | string): string {
  if (!date) return "Invalid date";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

// Get current date in YYYY-MM-DD format
export function getCurrentDate(): string {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// Get color based on transaction type
export function getTransactionColor(type: 'income' | 'expense'): string {
  return type === 'income' ? 'text-green-600' : 'text-red-600'
}

// Get icon color based on impact
export function getIconColor(impact: 'positive' | 'negative' | 'neutral'): string {
  switch (impact) {
    case 'positive':
      return 'text-green-500'
    case 'negative':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

// Get text color based on impact
export function getTextColor(impact: 'positive' | 'negative' | 'neutral'): string {
  switch (impact) {
    case 'positive':
      return 'text-green-600'
    case 'negative':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

// Get status color for goals
export function getStatusColor(status: 'on_track' | 'at_risk' | 'off_track'): string {
  switch (status) {
    case 'on_track':
      return 'text-green-600'
    case 'at_risk':
      return 'text-yellow-600'
    case 'off_track':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

// Calculate goal status based on progress and target date
export function calculateGoalStatus(progress: number, targetDate: string): 'on_track' | 'at_risk' | 'off_track' {
  const target = new Date(targetDate)
  const today = new Date()
  const daysRemaining = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const requiredProgress = (daysRemaining / 365) * 100

  if (progress >= requiredProgress) {
    return 'on_track'
  } else if (progress >= requiredProgress * 0.7) {
    return 'at_risk'
  } else {
    return 'off_track'
  }
}

// Calculate savings rate
export function calculateSavingsRate(income: number, expenses: number): number {
  return ((income - expenses) / income) * 100
}

export function calculateInvestmentValue(investment: { shares: number; price: number }): number {
  return investment.shares * investment.price
}

export function calculateInvestmentCostBasis(investment: { shares: number; purchasePrice: number }): number {
  return investment.shares * investment.purchasePrice
}
