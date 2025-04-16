"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Transaction, BudgetCategory, Investment, OptimizationSuggestion } from "@/lib/types"
import { generateId } from "@/lib/utils"

interface FinanceContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  updateTransaction: (transaction: Transaction) => void
  deleteTransaction: (id: string) => void
  budgets: BudgetCategory[]
  addBudget: (budget: Omit<BudgetCategory, "id" | "spent" | "color">) => void
  updateBudget: (budget: BudgetCategory) => void
  deleteBudget: (id: string) => void
  investments: Investment[]
  addInvestment: (investment: Omit<Investment, "id">) => void
  updateInvestment: (investment: Investment) => void
  deleteInvestment: (id: string) => void
  optimizationSuggestions: OptimizationSuggestion[]
  toggleOptimizationImplemented: (id: string) => void
  generateAiSuggestions: (financialData: any) => Promise<any>
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
  clearAllData: () => void
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

// Default budget category colors
const categoryColors: Record<string, string> = {
  Housing: "bg-wealth-blue",
  Food: "bg-wealth-yellow",
  Transportation: "bg-wealth-red",
  Entertainment: "bg-wealth-purple",
  Utilities: "bg-wealth-green",
  Savings: "bg-emerald-500",
  Shopping: "bg-pink-500",
  Health: "bg-cyan-500",
  Education: "bg-amber-500",
  Travel: "bg-indigo-500",
  Other: "bg-gray-500",
}

// Default optimization suggestions
const defaultOptimizationSuggestions: OptimizationSuggestion[] = [
  {
    id: "s1",
    title: "Create Emergency Fund",
    description: "Build an emergency fund with 3-6 months of expenses to protect against unexpected financial shocks.",
    impact: "high",
    category: "savings",
    implemented: false,
  },
  {
    id: "s2",
    title: "Track All Expenses",
    description: "Record all expenses to identify spending patterns and find opportunities to save.",
    impact: "medium",
    category: "expense",
    implemented: false,
  },
  {
    id: "s3",
    title: "Set Up Automatic Investments",
    description: "Set up automatic monthly investments to build wealth consistently over time.",
    impact: "high",
    category: "investment",
    potentialReturn: 50000,
    implemented: false,
  },
  {
    id: "s4",
    title: "Review Subscriptions",
    description: "Review all subscriptions and cancel those you don't use regularly.",
    impact: "low",
    category: "expense",
    potentialSavings: 12000,
    implemented: false,
  },
  {
    id: "s5",
    title: "Tax-Saving Investments",
    description: "Maximize tax-saving investments under Section 80C to reduce your tax liability.",
    impact: "medium",
    category: "investment",
    potentialSavings: 46800,
    implemented: false,
  },
]

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  // State for all financial data
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<BudgetCategory[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [optimizationSuggestions, setOptimizationSuggestions] =
    useState<OptimizationSuggestion[]>(defaultOptimizationSuggestions)

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadedTransactions = localStorage.getItem("wealth-transactions")
    const loadedBudgets = localStorage.getItem("wealth-budgets")
    const loadedInvestments = localStorage.getItem("wealth-investments")
    const loadedOptimizationSuggestions = localStorage.getItem("wealth-optimization-suggestions")

    if (loadedTransactions) setTransactions(JSON.parse(loadedTransactions))
    if (loadedBudgets) setBudgets(JSON.parse(loadedBudgets))
    if (loadedInvestments) setInvestments(JSON.parse(loadedInvestments))
    if (loadedOptimizationSuggestions) setOptimizationSuggestions(JSON.parse(loadedOptimizationSuggestions))
    else setOptimizationSuggestions(defaultOptimizationSuggestions)
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wealth-transactions", JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem("wealth-budgets", JSON.stringify(budgets))
  }, [budgets])

  useEffect(() => {
    localStorage.setItem("wealth-investments", JSON.stringify(investments))
  }, [investments])

  useEffect(() => {
    localStorage.setItem("wealth-optimization-suggestions", JSON.stringify(optimizationSuggestions))
  }, [optimizationSuggestions])

  // Update budgets spent amounts based on transactions
  useEffect(() => {
    if (transactions.length === 0 || budgets.length === 0) return

    const updatedBudgets = budgets.map((budget) => {
      const budgetTransactions = transactions.filter(
        (t) => t.type === "expense" && t.category === budget.name
      )
      const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0)
      return { ...budget, spent }
    })

    // Only update if there are actual changes
    const hasChanges = updatedBudgets.some(
      (budget, index) => budget.spent !== budgets[index].spent
    )

    if (hasChanges) {
      setBudgets(updatedBudgets)
    }
  }, [transactions, budgets])

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: generateId() }
    setTransactions((prev) => [newTransaction, ...prev])
  }

  const updateTransaction = (transaction: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === transaction.id ? transaction : t)))
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  // Budget functions
  const addBudget = (budget: Omit<BudgetCategory, "id" | "spent" | "color">) => {
    const newBudget = {
      ...budget,
      id: generateId(),
      spent: 0,
      color: categoryColors[budget.name] || "bg-gray-500",
    }
    setBudgets((prev) => [...prev, newBudget])
  }

  const updateBudget = (budget: BudgetCategory) => {
    setBudgets((prev) => prev.map((b) => (b.id === budget.id ? budget : b)))
  }

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id))
  }

  // Investment functions
  const addInvestment = (investment: Omit<Investment, "id">) => {
    const newInvestment = { ...investment, id: generateId() }
    setInvestments((prev) => [...prev, newInvestment])
  }

  const updateInvestment = (investment: Investment) => {
    setInvestments((prev) => prev.map((i) => (i.id === investment.id ? investment : i)))
  }

  const deleteInvestment = (id: string) => {
    setInvestments((prev) => prev.filter((i) => i.id !== id))
  }

  // Optimization functions
  const toggleOptimizationImplemented = (id: string) => {
    setOptimizationSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, implemented: !s.implemented } : s)))
  }

  // Generate AI suggestions
  const generateAiSuggestions = async (financialData: any) => {
    try {
      // Calculate investment metrics
      const totalInvestmentValue = financialData.investments.reduce((sum: number, inv: any) => sum + (inv.shares * inv.price), 0)
      const totalInvestmentCost = financialData.investments.reduce((sum: number, inv: any) => sum + (inv.shares * inv.purchasePrice), 0)
      const investmentGainLoss = totalInvestmentValue - totalInvestmentCost
      const investmentReturn = totalInvestmentCost > 0 ? (investmentGainLoss / totalInvestmentCost) * 100 : 0
      const hasInvestments = financialData.investments.length > 0

      // Calculate recommended investment amount
      const recommendedMonthlyInvestment = financialData.monthlyIncome * 0.15
      const currentMonthlyInvestment = financialData.transactions
        .filter((t: any) => t.category === 'Investments')
        .reduce((sum: number, t: any) => sum + t.amount, 0)
      const investmentGap = recommendedMonthlyInvestment - currentMonthlyInvestment

      // Calculate savings metrics
      const savingsRate = financialData.savingsRate
      const monthlySavings = financialData.monthlyIncome - financialData.monthlyExpenses
      const recommendedEmergencyFund = financialData.monthlyExpenses * 6

      // Calculate budget metrics
      const budgetUtilization = financialData.budgets.map((budget: any) => ({
        name: budget.name,
        allocated: budget.allocated,
        spent: budget.spent,
        remaining: budget.allocated - budget.spent,
        utilization: (budget.spent / budget.allocated) * 100
      }))

      // Generate investment suggestions based on portfolio
      const investmentSuggestions = hasInvestments ? [
        {
          id: 'inv-diversify',
          title: 'Diversify Your Investment Portfolio',
          description: 'Consider adding different types of investments to reduce risk and potentially increase returns.',
          impact: 'high',
          category: 'investments',
          potentialSavings: 0,
          potentialReturn: totalInvestmentValue * 0.05,
          implemented: false,
          howToFix: 'Review your current portfolio allocation and consider adding different asset classes like bonds, international stocks, or alternative investments.'
        }
      ] : [
        {
          id: 'inv-start',
          title: 'Start Building Your Investment Portfolio',
          description: 'Begin investing to grow your wealth and achieve long-term financial goals.',
          impact: 'high',
          category: 'investments',
          potentialSavings: 0,
          potentialReturn: recommendedMonthlyInvestment * 12 * 0.07,
          implemented: false,
          howToFix: 'Start with a small amount and gradually increase your investment contributions. Consider low-cost index funds or ETFs as a starting point.'
        }
      ]

      // Generate savings suggestions
      const savingsSuggestions = [
        {
          id: 'sav-emergency',
          title: 'Build Emergency Fund',
          description: `Aim to save 6 months of expenses (₹${recommendedEmergencyFund.toLocaleString()}) for emergencies.`,
          impact: 'high',
          category: 'savings',
          potentialSavings: 0,
          potentialReturn: 0,
          implemented: false,
          howToFix: `Set up automatic transfers of ₹${(recommendedEmergencyFund / 12).toLocaleString()} monthly to build your emergency fund.`
        },
        {
          id: 'sav-increase',
          title: 'Increase Monthly Savings',
          description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% of income.`,
          impact: 'high',
          category: 'savings',
          potentialSavings: financialData.monthlyIncome * 0.2 - monthlySavings,
          potentialReturn: 0,
          implemented: false,
          howToFix: 'Review your expenses and identify areas where you can cut back to increase savings.'
        }
      ]

      // Generate budget suggestions
      const budgetSuggestions = budgetUtilization
        .filter((budget: any) => budget.utilization > 100)
        .map((budget: any) => ({
          id: `budget-${budget.name.toLowerCase()}`,
          title: `Reduce ${budget.name} Spending`,
          description: `You've exceeded your ${budget.name} budget by ₹${Math.abs(budget.remaining).toLocaleString()}.`,
          impact: 'medium',
          category: 'budget',
          potentialSavings: Math.abs(budget.remaining),
          potentialReturn: 0,
          implemented: false,
          howToFix: `Review your ${budget.name} expenses and identify areas to cut back. Consider setting a stricter budget limit.`
        }))

      // Generate expense optimization suggestions
      const expenseSuggestions = [
        {
          id: 'exp-review',
          title: 'Review Recurring Expenses',
          description: 'Regularly review and optimize your recurring expenses to save money.',
          impact: 'medium',
          category: 'expenses',
          potentialSavings: financialData.monthlyExpenses * 0.05,
          potentialReturn: 0,
          implemented: false,
          howToFix: 'List all your subscriptions and recurring payments. Cancel unused services and negotiate better rates.'
        },
        {
          id: 'exp-track',
          title: 'Track Daily Expenses',
          description: 'Small daily expenses can add up significantly over time.',
          impact: 'medium',
          category: 'expenses',
          potentialSavings: financialData.monthlyExpenses * 0.03,
          potentialReturn: 0,
          implemented: false,
          howToFix: 'Use the expense tracker to monitor daily spending and identify areas to cut back.'
        }
      ]

      // Combine all suggestions and remove duplicates
      const allSuggestions = [
        ...investmentSuggestions,
        ...savingsSuggestions,
        ...budgetSuggestions,
        ...expenseSuggestions
      ].filter((suggestion, index, self) => 
        index === self.findIndex((s) => s.id === suggestion.id)
      )

      // Update state with new suggestions
      setOptimizationSuggestions(prev => {
        // Remove any existing suggestions that match the new ones
        const existingIds = new Set(prev.map(s => s.id))
        const newSuggestions = allSuggestions.filter(s => !existingIds.has(s.id))
        return [...prev, ...newSuggestions]
      })

      return { suggestions: allSuggestions }
    } catch (error) {
      console.error('Error generating suggestions:', error)
      return { error: 'Failed to generate suggestions' }
    }
  }

  // Calculate dashboard data
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const monthlyTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date)
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
  })

  const monthlyIncome = monthlyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpenses = monthlyTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = totalIncome - totalExpenses

  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0

  // Function to clear all data
  const clearAllData = () => {
    // Clear localStorage
    localStorage.removeItem("wealth-transactions")
    localStorage.removeItem("wealth-budgets")
    localStorage.removeItem("wealth-investments")
    localStorage.removeItem("wealth-optimization-suggestions")

    // Reset state
    setTransactions([])
    setBudgets([])
    setInvestments([])
    setOptimizationSuggestions(defaultOptimizationSuggestions)
  }

  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,

    budgets,
    addBudget,
    updateBudget,
    deleteBudget,

    investments,
    addInvestment,
    updateInvestment,
    deleteInvestment,

    optimizationSuggestions,
    toggleOptimizationImplemented,
    generateAiSuggestions,

    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    clearAllData,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}
