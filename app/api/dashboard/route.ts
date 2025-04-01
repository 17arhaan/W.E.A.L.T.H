import { NextResponse } from "next/server"
import * as dataService from "@/lib/data"

export async function GET() {
  // Get all the data needed for the dashboard in a single API call
  const dashboardData = {
    accounts: dataService.getAccounts(),
    recentTransactions: dataService.getTransactions().slice(0, 5),
    goals: dataService.getGoals(),
    totalBalance: dataService.getTotalBalance(),
    monthlyIncome: dataService.getMonthlyIncome(),
    monthlyExpenses: dataService.getMonthlyExpenses(),
    expenseBreakdown: dataService.getExpenseBreakdown(),
    spendingTrends: dataService.getSpendingTrends(),
    budgetComparison: dataService.getBudgetComparison(),
    savingsGrowth: dataService.getSavingsGrowth(),
    healthScore: dataService.calculateFinancialHealthScore(),
    insights: dataService.getInsights(),
    // Unique features
    spendingPatterns: dataService.getSpendingPatterns(),
    budgetRecommendations: dataService.getBudgetRecommendations(),
    recurringTransactions: dataService.getRecurringTransactions(),
  }

  return NextResponse.json(dashboardData)
}

// Add endpoints for creating and managing real data
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Handle different data types
    if (body.type === "account") {
      const account = dataService.addAccount(body.data)
      return NextResponse.json({ success: true, account }, { status: 201 })
    }

    if (body.type === "transaction") {
      const transaction = dataService.addTransaction(body.data)
      return NextResponse.json({ success: true, transaction }, { status: 201 })
    }

    if (body.type === "goal") {
      // Goal creation logic would go here
      return NextResponse.json({ success: true }, { status: 201 })
    }

    if (body.type === "budget") {
      // Budget creation logic would go here
      return NextResponse.json({ success: true }, { status: 201 })
    }

    return NextResponse.json({ error: "Invalid data type" }, { status: 400 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

