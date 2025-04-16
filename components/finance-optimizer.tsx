"use client"

import { useState, useRef, useEffect } from "react"
import { AlertCircle, Lightbulb, RefreshCw, Sparkles } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinance } from "@/context/finance-context"
import type { OptimizationSuggestion } from "@/lib/types"

export function FinanceOptimizer() {
  const {
    generateAiSuggestions,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    budgets,
    transactions,
    investments,
    optimizationSuggestions,
    toggleOptimizationImplemented,
  } = useFinance()

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [shownSuggestions, setShownSuggestions] = useState<string[]>([])
  const [displayedSuggestions, setDisplayedSuggestions] = useState<OptimizationSuggestion[]>([])
  const [hasGeneratedReport, setHasGeneratedReport] = useState(false)
  const shuffleRef = useRef(0)

  // Update displayed suggestions when optimizationSuggestions or shownSuggestions change
  useEffect(() => {
    if (!optimizationSuggestions || optimizationSuggestions.length === 0) {
      setDisplayedSuggestions([])
      return
    }

    const actionable = optimizationSuggestions.filter(s => !s.implemented && !shownSuggestions.includes(s.id))
    if (actionable.length === 0) {
      setDisplayedSuggestions([])
      return
    }

    const shuffled = shuffleArray(actionable, shuffleRef.current)
    const toShow = shuffled.slice(0, 5)
    setDisplayedSuggestions(toShow)
  }, [optimizationSuggestions, shownSuggestions])

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true)
    setError(null)
    setApiResponse(null)
    shuffleRef.current++
    setHasGeneratedReport(true)

    try {
      // Calculate current month's transactions
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()

      const monthlyTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
      })

      // Calculate monthly income and expenses
      const monthlyIncome = monthlyTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0)

      const monthlyExpenses = monthlyTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)

      // Calculate total investment value
      const totalInvestmentValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.price), 0)

      // Calculate total budget allocation and spending
      const totalBudgetAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0)
      const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0)

      // Prepare financial data for analysis
      const financialData = {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        savingsRate,
        totalInvestmentValue,
        totalBudgetAllocated,
        totalBudgetSpent,
        budgets: budgets.map((budget) => ({
          name: budget.name,
          allocated: budget.allocated,
          spent: budget.spent,
          percentageSpent: (budget.spent / budget.allocated) * 100,
        })),
        transactions: monthlyTransactions.map((t) => ({
          date: t.date,
          description: t.description,
          category: t.category,
          amount: t.amount,
          type: t.type,
        })),
        investments: investments.map((inv) => ({
          symbol: inv.symbol,
          name: inv.name,
          category: inv.category,
          shares: inv.shares,
          price: inv.price,
          purchasePrice: inv.purchasePrice,
          currentValue: inv.shares * inv.price,
          costBasis: inv.shares * inv.purchasePrice,
          gainLoss: (inv.shares * inv.price) - (inv.shares * inv.purchasePrice),
        })),
      }

      try {
        const result = await Promise.race([
          generateAiSuggestions(financialData),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out after 15 seconds")), 15000),
          ),
        ])
        setApiResponse(result)
        if (result?.error) {
          setError(result.error)
        }
        setShownSuggestions([])
      } catch (timeoutError) {
        console.error("Request timed out:", timeoutError)
        setError("Request timed out. Please try again.")
      }
    } catch (err: any) {
      console.error("Error generating suggestions:", err)
      setError(err?.message || "Failed to generate suggestions. Using default suggestions instead.")
    } finally {
      setIsGenerating(false)
    }
  }

  function shuffleArray<T>(array: T[], seed: number): T[] {
    let arr = array.slice()
    let m = arr.length, t, i
    let random = () => {
      const x = Math.sin(seed++) * 10000
      return x - Math.floor(x)
    }
    while (m) {
      i = Math.floor(random() * m--)
      t = arr[m]
      arr[m] = arr[i]
      arr[i] = t
    }
    return arr
  }

  const detailedAdvice = () => {
    if (displayedSuggestions.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          No suggestions found for your current data. Try adding more transactions or changing your spending patterns.
        </div>
      )
    }

    // Calculate detailed metrics
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Monthly transaction analysis
    const monthlyTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
    })

    // Category-wise spending
    const categorySpending = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)

    // Investment analysis
    const totalInvestmentValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.price), 0)
    const totalInvestmentCost = investments.reduce((sum, inv) => sum + (inv.shares * inv.purchasePrice), 0)
    const investmentGainLoss = totalInvestmentValue - totalInvestmentCost
    const investmentReturn = totalInvestmentCost > 0 ? (investmentGainLoss / totalInvestmentCost) * 100 : 0

    // Calculate recommended investment amount
    const recommendedMonthlyInvestment = monthlyIncome * 0.15 // 15% of monthly income
    const currentMonthlyInvestment = monthlyTransactions
      .filter(t => t.category === 'Investments')
      .reduce((sum, t) => sum + t.amount, 0)
    const investmentGap = recommendedMonthlyInvestment - currentMonthlyInvestment

    // Budget analysis
    const budgetUtilization = budgets.map(budget => ({
      name: budget.name,
      allocated: budget.allocated,
      spent: budget.spent,
      remaining: budget.allocated - budget.spent,
      utilization: (budget.spent / budget.allocated) * 100
    }))

    // Group suggestions by category
    const suggestionsByCategory = displayedSuggestions.reduce((acc, suggestion) => {
      if (!acc[suggestion.category]) {
        acc[suggestion.category] = []
      }
      acc[suggestion.category].push(suggestion)
      return acc
    }, {} as Record<string, OptimizationSuggestion[]>)

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Your Personalized Financial Plan</h2>
          <p className="text-muted-foreground">Based on your current financial data and goals</p>
        </div>

        {/* Financial Overview */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Your current financial position and key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-background">
                <div className="text-sm text-muted-foreground">Monthly Income</div>
                <div className="text-2xl font-bold">₹{monthlyIncome.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {monthlyTransactions.filter(t => t.type === 'income').length} transactions
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="text-sm text-muted-foreground">Monthly Expenses</div>
                <div className="text-2xl font-bold">₹{monthlyExpenses.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {monthlyTransactions.filter(t => t.type === 'expense').length} transactions
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="text-sm text-muted-foreground">Savings Rate</div>
                <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  ₹{(monthlyIncome - monthlyExpenses).toLocaleString()} saved
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="text-sm text-muted-foreground">Total Balance</div>
                <div className="text-2xl font-bold">₹{totalBalance.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Including investments
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Spending Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Analysis</CardTitle>
              <CardDescription>Your monthly expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categorySpending)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{category}</div>
                        <div className="text-sm text-muted-foreground">
                          {(amount / monthlyExpenses * 100).toFixed(1)}% of expenses
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {monthlyTransactions.filter(t => t.type === 'expense' && t.category === category).length} transactions
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Investment Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Portfolio</CardTitle>
              <CardDescription>Your current investment position and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Total Value</div>
                    <div className="text-sm text-muted-foreground">Current market value</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{totalInvestmentValue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {investments.length} holdings
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Total Gain/Loss</div>
                    <div className="text-sm text-muted-foreground">Since purchase</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${investmentGainLoss >= 0 ? 'text-wealth-green' : 'text-wealth-red'}`}>
                      ₹{Math.abs(investmentGainLoss).toLocaleString()} ({investmentReturn.toFixed(1)}%)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {investmentGainLoss >= 0 ? 'Profit' : 'Loss'}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Recommended Monthly Investment</div>
                    <div className="text-sm text-muted-foreground">15% of monthly income</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{recommendedMonthlyInvestment.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {currentMonthlyInvestment > 0 ? `${((currentMonthlyInvestment / monthlyIncome) * 100).toFixed(1)}% of income` : 'Not investing yet'}
                    </div>
                  </div>
                </div>
                {investmentGap > 0 && (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Investment Gap</div>
                      <div className="text-sm text-muted-foreground">Additional amount to invest</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-wealth-blue">₹{investmentGap.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {((investmentGap / monthlyIncome) * 100).toFixed(1)}% of income
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Plan */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Action Plan</h3>
          {Object.entries(suggestionsByCategory).map(([category, suggestions]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-lg font-medium capitalize">{category} Improvements</h4>
              <div className="grid gap-4 md:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <CardDescription>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wealth-blue/10 text-wealth-blue">
                          {suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)} Impact
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{suggestion.description}</p>
                        
                        {(suggestion.potentialSavings || suggestion.potentialReturn) && (
                          <div className="flex flex-wrap gap-2">
                            {suggestion.potentialSavings && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wealth-green/10 text-wealth-green">
                                Potential Savings: ₹{suggestion.potentialSavings.toLocaleString()}
                                {monthlyIncome > 0 && ` (${((suggestion.potentialSavings / monthlyIncome) * 100).toFixed(1)}% of income)`}
                              </span>
                            )}
                            {suggestion.potentialReturn && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-wealth-blue/10 text-wealth-blue">
                                Potential Return: ₹{suggestion.potentialReturn.toLocaleString()}
                                {totalInvestmentValue > 0 && ` (${((suggestion.potentialReturn / totalInvestmentValue) * 100).toFixed(1)}% of portfolio)`}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="space-y-2">
                          <h5 className="font-medium">Implementation Steps:</h5>
                          <p className="text-sm text-muted-foreground">
                            {suggestion.howToFix || `Review your ${suggestion.category} and follow the advice above.`}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            toggleOptimizationImplemented(suggestion.id)
                            setShownSuggestions(prev => [...prev, suggestion.id])
                          }}
                        >
                          Mark as Implemented
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Financial Stability Tips */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Financial Stability Guidelines</CardTitle>
            <CardDescription>Key principles for long-term financial success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Essential Practices</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-wealth-green">✓</span>
                    <span>Track all income and expenses regularly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-wealth-green">✓</span>
                    <span>Build an emergency fund (3-6 months of expenses)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-wealth-green">✓</span>
                    <span>Invest consistently in diversified assets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-wealth-green">✓</span>
                    <span>Review and optimize recurring expenses</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Advanced Strategies</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-wealth-blue">→</span>
                    <span>Set clear financial goals and track progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-wealth-blue">→</span>
                    <span>Maximize tax-saving investments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-wealth-blue">→</span>
                    <span>Regularly review and rebalance portfolio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-wealth-blue">→</span>
                    <span>Seek professional advice for complex decisions</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Comprehensive Financial Optimization</AlertTitle>
        <AlertDescription>
          Get a detailed, actionable plan for financial stability based on your full financial data.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Finances</CardTitle>
          <CardDescription>Get a comprehensive financial stability plan based on your transactions, investments, and budgets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <Button
              onClick={handleGenerateSuggestions}
              disabled={isGenerating || transactions.length === 0}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Finances...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze My Finances
                </>
              )}
            </Button>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {transactions.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Add transactions first</AlertTitle>
              <AlertDescription>You need to add some transactions before generating AI suggestions.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      {hasGeneratedReport && detailedAdvice()}
    </div>
  )
}
