// Enhanced AI service that analyzes transaction data

import { Transaction, FinancialData } from './types'

// Function to generate financial advice based on transaction analysis
export function generateFinancialAdvice(data: FinancialData, area?: string): string[] {
  if (!data.transactions || data.transactions.length === 0) {
    return [
      "Start tracking your expenses to get personalized advice",
      "Set up a budget to better manage your finances",
      "Consider setting up automatic savings",
      "Review your recurring subscriptions",
      "Create an emergency fund"
    ]
  }

  const suggestions: string[] = []
  const spendingByCategory = analyzeSpendingByCategory(data.transactions)
  const highSpendingCategories = findHighSpendingCategories(spendingByCategory, data.income)
  const frequentSmallTransactions = checkFrequentSmallTransactions(data.transactions)
  const recurringExpenses = identifyRecurringExpenses(data.transactions)

  if (highSpendingCategories.length > 0) {
    highSpendingCategories.forEach(category => {
      suggestions.push(`Consider reducing spending in ${category.name} category. It's taking up ${Math.round(category.percentOfIncome)}% of your income.`)
    })
  }

  if (frequentSmallTransactions) {
    suggestions.push("You have many small transactions. Consider consolidating these purchases to better track your spending.")
  }

  if (recurringExpenses.length > 0) {
    recurringExpenses.forEach(expense => {
      suggestions.push(`Review your recurring expense: ${expense.description}. You've spent ${formatCurrency(expense.total)} on this in the last month.`)
    })
  }

  const savingsRate = calculateSavingsRate(data.income, data.expenses)
  if (savingsRate < 20) {
    suggestions.push(`Your savings rate is ${Math.round(savingsRate)}%. Consider increasing it to at least 20% for better financial health.`)
  }

  if (suggestions.length < 5) {
    suggestions.push(
      "Review your investment portfolio regularly",
      "Consider automating your savings",
      "Set up financial goals for the next 6 months",
      "Track your net worth monthly",
      "Review your insurance coverage"
    )
  }

  if (area) {
    return suggestions.filter(s => s.toLowerCase().includes(area.toLowerCase()))
  }

  return suggestions.slice(0, 5)
}

// Helper function to analyze spending by category
function analyzeSpendingByCategory(transactions: Transaction[]): { [key: string]: number } {
  return transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
    }
    return acc
  }, {} as { [key: string]: number })
}

// Helper function to find high spending categories
function findHighSpendingCategories(spendingByCategory: { [key: string]: number }, income: number): { name: string; percentOfIncome: number }[] {
  return Object.entries(spendingByCategory)
    .map(([category, amount]) => ({
      name: category,
      percentOfIncome: (amount / income) * 100
    }))
    .filter(cat => cat.percentOfIncome > 15)
}

// Helper function to check for frequent small transactions
function checkFrequentSmallTransactions(transactions: Transaction[]): boolean {
  const smallTransactions = transactions.filter(t => t.type === 'expense' && t.amount < 500)
  return smallTransactions.length > 15
}

// Helper function to identify recurring expenses
function identifyRecurringExpenses(transactions: Transaction[]): { description: string; total: number }[] {
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      acc[transaction.description] = (acc[transaction.description] || 0) + transaction.amount
    }
    return acc
  }, {} as { [key: string]: number })

  return Object.entries(groupedTransactions)
    .filter(([_, total]) => total > 1000)
    .map(([description, total]) => ({ description, total }))
}

function calculateSavingsRate(income: number, expenses: number): number {
  if (income === 0) return 0
  return ((income - expenses) / income) * 100
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
