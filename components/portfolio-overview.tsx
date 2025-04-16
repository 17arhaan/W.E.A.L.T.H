"use client"

import { useState } from "react"
import { ArrowUp, BarChart3, DollarSign, LineChart, Plus } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PortfolioAllocationChart } from "@/components/charts/portfolio-allocation-chart"
import { PortfolioPerformanceChart } from "@/components/charts/portfolio-performance-chart"
import { InvestmentHoldings } from "@/components/investment-holdings"
import { useFinance } from "@/context/finance-context"
import { formatCurrency } from "@/lib/utils"
import { EmptyState } from "@/components/empty-state"
import { AddInvestmentForm } from "@/components/forms/add-investment-form"

export function PortfolioOverview() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddForm, setShowAddForm] = useState(false)
  const { investments } = useFinance()

  // Calculate portfolio metrics
  const totalPortfolioValue = investments.reduce((sum, investment) => sum + investment.shares * investment.price, 0)

  const totalCostBasis = investments.reduce((sum, investment) => sum + investment.shares * investment.purchasePrice, 0)

  const totalGainLoss = totalPortfolioValue - totalCostBasis
  const gainLossPercentage = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0

  // Placeholder for dividend yield (would be calculated from actual dividend data)
  const dividendYield = 2.8
  const annualDividends = totalPortfolioValue * (dividendYield / 100)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Investment Portfolio</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Investment
            </>
          )}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Investment</CardTitle>
            <CardDescription>Add a new investment to your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <AddInvestmentForm onSuccess={() => setShowAddForm(false)} />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</div>
                <p className="text-xs text-muted-foreground">Current market value</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
                <ArrowUp className="h-4 w-4 text-wealth-green" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? "text-wealth-green" : "text-wealth-red"}`}>
                  {totalGainLoss >= 0 ? "+" : ""}
                  {formatCurrency(totalGainLoss)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {gainLossPercentage >= 0 ? "+" : ""}
                  {gainLossPercentage.toFixed(2)}% all time
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Annual Return</CardTitle>
                <LineChart className="h-4 w-4 text-wealth-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9.4%</div>
                <p className="text-xs text-muted-foreground">Estimated annual return</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dividend Yield</CardTitle>
                <BarChart3 className="h-4 w-4 text-wealth-yellow" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dividendYield}%</div>
                <p className="text-xs text-muted-foreground">{formatCurrency(annualDividends)} annually</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Your investment performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                {investments.length > 0 ? (
                  <PortfolioPerformanceChart />
                ) : (
                  <EmptyState
                    title="No investment data"
                    description="Add investments to see performance charts"
                    icon="chart"
                  />
                )}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Your current investment mix</CardDescription>
              </CardHeader>
              <CardContent>
                {investments.length > 0 ? (
                  <PortfolioAllocationChart />
                ) : (
                  <EmptyState
                    title="No investment data"
                    description="Add investments to see asset allocation"
                    icon="pieChart"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Detailed performance metrics for your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {investments.length > 0 ? (
                <>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">1 Year Return</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-wealth-green">+12.4%</div>
                        <p className="text-xs text-muted-foreground">vs. Nifty 50: +10.2%</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">3 Year Return</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-wealth-green">+34.8%</div>
                        <p className="text-xs text-muted-foreground">vs. Nifty 50: +32.1%</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">5 Year Return</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-wealth-green">+62.5%</div>
                        <p className="text-xs text-muted-foreground">vs. Nifty 50: +58.3%</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Detailed performance charts coming soon</p>
                  </div>
                </>
              ) : (
                <EmptyState
                  title="No investment data"
                  description="Add investments to see performance analysis"
                  icon="analytics"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="holdings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Holdings</CardTitle>
              <CardDescription>Your current investment positions</CardDescription>
            </CardHeader>
            <CardContent>
              <InvestmentHoldings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
