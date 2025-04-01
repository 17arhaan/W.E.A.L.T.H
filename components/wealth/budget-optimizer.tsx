"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  TrendingUp,
  CheckCircle,
  DollarSign,
  ArrowRight,
  BarChart,
  Coffee,
  ShoppingBag,
  Utensils,
  Home,
  Car,
  Smartphone,
  CreditCard,
  AlertCircle,
  Info,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useData } from "./data-provider"

interface BudgetOptimizerProps {
  className?: string
}

// Savings recommendation type
interface SavingsRecommendation {
  id: string
  category: string
  title: string
  description: string
  potentialSavings: number
  difficulty: "easy" | "medium" | "hard"
  steps: string[]
  icon: keyof typeof categoryIcons
}

// Category icons mapping
const categoryIcons = {
  food: Utensils,
  shopping: ShoppingBag,
  entertainment: Smartphone,
  transport: Car,
  utilities: Home,
  housing: Home,
  coffee: Coffee,
  credit: CreditCard,
  general: DollarSign,
}

export default function BudgetOptimizer({ className }: BudgetOptimizerProps) {
  const { transactions, accounts, isLoading } = useData()
  const [recommendations, setRecommendations] = useState<SavingsRecommendation[]>([])
  const [savingsGoal, setSavingsGoal] = useState<number>(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  // Analyze transactions using ML model or fallback
  const analyzeTransactions = async () => {
    setIsAnalyzing(true)
    setError(null)
    setIsUsingFallback(false)

    try {
      if (!transactions || transactions.length === 0) {
        throw new Error("No transaction data available for analysis")
      }

      // Call the API endpoint
      const response = await fetch("/api/budget-optimizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactions,
          accounts,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze budget data")
      }

      const data = await response.json()

      // Check if we're using fallback recommendations
      if (data._usingFallback) {
        setIsUsingFallback(true)
      }

      // Update state with recommendations
      setRecommendations(data.recommendations || [])
      setSavingsGoal(data.totalSavings || 0)
      setAnalysisComplete(true)
    } catch (err) {
      console.error("Budget analysis error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Reset analysis
  const resetAnalysis = () => {
    setRecommendations([])
    setSavingsGoal(0)
    setAnalysisComplete(false)
    setError(null)
    setIsUsingFallback(false)
  }

  return (
    <div className={cn("bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-500 dark:text-brand-400" />
          AI-Powered Budget Optimization
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-t-brand-500 dark:border-t-brand-400 border-gray-200 dark:border-gray-700 rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading transaction data...</p>
          </div>
        </div>
      ) : !analysisComplete ? (
        <div className="text-center py-6">
          <div className="bg-gray-100 dark:bg-zinc-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <BarChart className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">AI Budget Optimizer</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Our intelligent system will analyze your transactions and provide personalized recommendations to help you
            save money based on your unique spending patterns.
          </p>
          <button
            onClick={analyzeTransactions}
            disabled={isAnalyzing || transactions.length === 0}
            className={cn(
              "px-4 py-2 bg-brand-600 dark:bg-brand-600 text-white rounded-md text-sm font-medium",
              "hover:bg-brand-700 dark:hover:bg-brand-700 transition-colors",
              (isAnalyzing || transactions.length === 0) && "opacity-50 cursor-not-allowed",
            )}
          >
            {isAnalyzing ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-t-white border-white/20 rounded-full animate-spin mr-2"></span>
                Analyzing Transactions...
              </>
            ) : transactions.length === 0 ? (
              "Add Transactions First"
            ) : (
              "Analyze My Spending"
            )}
          </button>
        </div>
      ) : (
        <div>
          {isUsingFallback && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-md flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>
                Using intelligent rule-based analysis. For enhanced ML-powered recommendations, an OpenAI API key is
                required.
              </span>
            </div>
          )}

          {/* Results Summary */}
          <div className="bg-gray-50 dark:bg-zinc-700/30 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Potential Monthly Savings</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Based on analysis of your transactions</p>
              </div>
              <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                {formatCurrency(savingsGoal)}
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">/ month</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Implementing these recommendations could save you approximately:
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 dark:bg-zinc-700 rounded-md p-2 flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Monthly</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(savingsGoal)}</p>
                </div>
                <div className="bg-gray-100 dark:bg-zinc-700 rounded-md p-2 flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Yearly</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(savingsGoal * 12)}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-zinc-700 rounded-md p-2 flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">5 Years</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(savingsGoal * 12 * 5)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Personalized Recommendations</h3>

          <div className="space-y-4 mb-6">
            {recommendations.map((rec) => {
              const Icon = categoryIcons[rec.icon] || DollarSign

              return (
                <div key={rec.id} className="bg-gray-50 dark:bg-zinc-700/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-md shrink-0",
                        rec.category === "food"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                          : rec.category === "shopping"
                            ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                            : rec.category === "entertainment"
                              ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{rec.title}</h4>
                        <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                          {formatCurrency(rec.potentialSavings)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">{rec.description}</p>

                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Recommended Steps:</p>
                        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          {rec.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400 shrink-0 mt-0.5" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            rec.difficulty === "easy"
                              ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                              : rec.difficulty === "medium"
                                ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                                : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
                          )}
                        >
                          {rec.difficulty.charAt(0).toUpperCase() + rec.difficulty.slice(1)} difficulty
                        </span>

                        <button className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center">
                          Detailed plan <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action buttons */}
          <div className="flex justify-between">
            <button
              onClick={resetAnalysis}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Reset Analysis
            </button>

            <button className="px-4 py-2 bg-brand-600 dark:bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 dark:hover:bg-brand-700 transition-colors">
              Create Savings Plan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

