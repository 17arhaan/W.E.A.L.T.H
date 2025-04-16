"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, DollarSign, Wallet } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BalanceChart } from "@/components/charts/balance-chart"
import { ExpensesByCategoryChart } from "@/components/charts/expenses-by-category-chart"
import { IncomeAnalysisChart } from "@/components/charts/income-analysis-chart"
import { IncomeExpenseComparisonChart } from "@/components/charts/income-expense-comparison-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { useFinance } from "@/context/finance-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const { totalBalance, monthlyIncome, monthlyExpenses, savingsRate, transactions } = useFinance()

  // Check if we have expense transactions
  const hasExpenseData = transactions.some((t) => t.type === "expense")
  const hasIncomeData = transactions.some((t) => t.type === "income")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button variant="outline" asChild>
          <Link href="/transactions">View Transactions</Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
                <p className="text-xs text-muted-foreground">Your current net balance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <ArrowUp className="h-4 w-4 text-wealth-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</div>
                <p className="text-xs text-muted-foreground">Income this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <ArrowDown className="h-4 w-4 text-wealth-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</div>
                <p className="text-xs text-muted-foreground">Expenses this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                <DollarSign className="h-4 w-4 text-wealth-yellow" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Of your monthly income</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Balance History</CardTitle>
                <CardDescription>Your balance trend over time</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <BalanceChart />
                ) : (
                  <EmptyState
                    title="No transaction data"
                    description="Add transactions to see your balance history"
                    icon="chart"
                  />
                )}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>Your spending breakdown for this month</CardDescription>
              </CardHeader>
              <CardContent>
                {hasExpenseData ? (
                  <ExpensesByCategoryChart />
                ) : (
                  <EmptyState
                    title="No expense data"
                    description="Add expense transactions to see your spending breakdown"
                    icon="pieChart"
                  />
                )}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your most recent financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Income vs. Expenses</CardTitle>
              <CardDescription>Compare your income and expenses over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              {transactions.length > 0 ? (
                <IncomeExpenseComparisonChart />
              ) : (
                <EmptyState
                  title="No transaction data"
                  description="Add transactions to see your income vs. expenses comparison"
                  icon="analytics"
                />
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income Analysis</CardTitle>
                <CardDescription>Breakdown of your income sources</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {hasIncomeData ? (
                  <IncomeAnalysisChart />
                ) : (
                  <EmptyState
                    title="No income data"
                    description="Add income transactions to see your income analysis"
                    icon="chart"
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Analysis</CardTitle>
                <CardDescription>Detailed breakdown of your expenses</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {hasExpenseData ? (
                  <ExpensesByCategoryChart />
                ) : (
                  <EmptyState
                    title="No expense data"
                    description="Add expense transactions to see your expense analysis"
                    icon="pieChart"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Savings Trend</CardTitle>
              <CardDescription>Track your savings progress over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              {transactions.length > 0 ? (
                <BalanceChart />
              ) : (
                <EmptyState
                  title="No transaction data"
                  description="Add transactions to see your savings trend"
                  icon="chart"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
