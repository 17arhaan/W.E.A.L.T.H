"use client"

import { useState, useRef } from "react"
import { Calendar, Download, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinance } from "@/context/finance-context"
import { formatCurrency } from "@/lib/utils"
import { ExpensesByCategoryChart } from "@/components/charts/expenses-by-category-chart"
import { BalanceChart } from "@/components/charts/balance-chart"
import { EmptyState } from "@/components/empty-state"
import { generatePdfReport } from "@/lib/pdf-utils"

export function FinancialReports() {
  const { transactions, budgets, investments, totalBalance, monthlyIncome, monthlyExpenses, savingsRate } = useFinance()
  const [reportType, setReportType] = useState("monthly")
  const [reportPeriod, setReportPeriod] = useState("current")
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const reportContentRef = useRef<HTMLDivElement>(null)

  // Get current month and year
  const now = new Date()
  const currentMonth = now.toLocaleString("default", { month: "long" })
  const currentYear = now.getFullYear()

  // Function to generate PDF
  const generatePdf = async () => {
    if (!reportContentRef.current) return

    setIsGeneratingPdf(true)

    try {
      // Generate filename based on report type and period
      const fileName = `${reportType}-report-${reportPeriod === "current" ? `${currentMonth}-${currentYear}` : "last-3-months"}.pdf`

      // Call the actual PDF generation function
      await generatePdfReport(reportContentRef.current, fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  // Check if we have data to show
  const hasData = transactions.length > 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select report type and time period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Summary</SelectItem>
                  <SelectItem value="expense">Expense Analysis</SelectItem>
                  <SelectItem value="income">Income Report</SelectItem>
                  <SelectItem value="investment">Investment Performance</SelectItem>
                  <SelectItem value="tax">Tax Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Time Period</label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Month</SelectItem>
                  <SelectItem value="last3">Last 3 Months</SelectItem>
                  <SelectItem value="last6">Last 6 Months</SelectItem>
                  <SelectItem value="year">Year to Date</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={generatePdf} disabled={isGeneratingPdf || !hasData} className="w-full">
                {isGeneratingPdf ? (
                  <>Generating PDF...</>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export as PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">Report Preview</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="space-y-4">
          {hasData ? (
            <div id="report-content" ref={reportContentRef} className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {reportType === "monthly" && "Monthly Summary Report"}
                      {reportType === "expense" && "Expense Analysis Report"}
                      {reportType === "income" && "Income Report"}
                      {reportType === "investment" && "Investment Performance Report"}
                      {reportType === "tax" && "Tax Report"}
                    </CardTitle>
                    <CardDescription>
                      {reportPeriod === "current" && `${currentMonth} ${currentYear}`}
                      {reportPeriod === "last3" && "Last 3 Months"}
                      {reportPeriod === "last6" && "Last 6 Months"}
                      {reportPeriod === "year" && `${currentYear} (Year to Date)`}
                      {reportPeriod === "custom" && "Custom Date Range"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Generated on {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Financial Summary</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Total Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Monthly Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-wealth-green">{formatCurrency(monthlyIncome)}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Monthly Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-wealth-red">{formatCurrency(monthlyExpenses)}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Savings Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Financial Charts</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Balance History</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                          <BalanceChart />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Expenses by Category</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                          <ExpensesByCategoryChart />
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Transaction Summary</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Category</span>
                            <span className="font-medium">Amount</span>
                          </div>
                          {/* This would be dynamically generated based on actual data */}
                          {budgets && budgets.length > 0 ? (
                            budgets.map((category) => (
                              <div key={category.id} className="flex justify-between">
                                <span>{category.name}</span>
                                <span className="text-wealth-red">{formatCurrency(category.spent)}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">No budget data available</div>
                          )}
                          <div className="flex justify-between border-t pt-2 font-bold">
                            <span>Total</span>
                            <span>{formatCurrency(monthlyExpenses)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Report Footer */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>This report was generated by W.E.A.L.T.H Finance Tracker</p>
                    <p>For personal financial management purposes only</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <EmptyState
              title="No data available"
              description="Add transactions to generate financial reports"
              icon="reports"
            />
          )}
        </TabsContent>
        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>Access your previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Example saved reports */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Monthly Summary - April 2023</p>
                      <p className="text-sm text-muted-foreground">Generated on 01/05/2023</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Tax Report - FY 2022-23</p>
                      <p className="text-sm text-muted-foreground">Generated on 15/04/2023</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Investment Performance - Q1 2023</p>
                      <p className="text-sm text-muted-foreground">Generated on 05/04/2023</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Saved Reports
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
