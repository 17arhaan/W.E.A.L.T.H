"use client"

import { useRef, useEffect } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from "chart.js"
import { useFinance } from "@/context/finance-context"
import { formatCurrency } from "@/lib/utils"

ChartJS.register(ArcElement, Tooltip, Legend)

export function ExpensesByCategoryChart() {
  const chartRef = useRef<ChartJS>(null)
  const { transactions } = useFinance()

  // Process transaction data for the chart
  const processExpenses = () => {
    // Get all expense transactions
    const expenseTransactions = transactions.filter((t) => t.type === "expense")

    if (expenseTransactions.length === 0) {
      return { categories: [], amounts: [] }
    }

    // Group by category
    const expensesByCategory: Record<string, number> = {}
    expenseTransactions.forEach((t) => {
      if (expensesByCategory[t.category]) {
        expensesByCategory[t.category] += t.amount
      } else {
        expensesByCategory[t.category] = t.amount
      }
    })

    // Sort categories by amount (descending)
    const sortedCategories = Object.keys(expensesByCategory).sort(
      (a, b) => expensesByCategory[b] - expensesByCategory[a],
    )

    // Get the top 5 categories and group the rest as "Other"
    let categories: string[] = []
    let amounts: number[] = []

    if (sortedCategories.length > 5) {
      const topCategories = sortedCategories.slice(0, 5)
      const otherCategories = sortedCategories.slice(5)

      categories = [...topCategories, "Other"]
      amounts = [
        ...topCategories.map((cat) => expensesByCategory[cat]),
        otherCategories.reduce((sum, cat) => sum + expensesByCategory[cat], 0),
      ]
    } else {
      categories = sortedCategories
      amounts = sortedCategories.map((cat) => expensesByCategory[cat])
    }

    return { categories, amounts }
  }

  const { categories, amounts } = processExpenses()

  // Update chart when transactions change
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update()
    }
  }, [transactions])

  // If no expense data, show a message
  if (amounts.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No expense data available</p>
      </div>
    )
  }

  // Colors for categories
  const categoryColors = [
    "#10B981", // green
    "#3B82F6", // blue
    "#F59E0B", // yellow
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#6B7280", // gray (for "Other")
  ]

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: categoryColors.slice(0, categories.length),
        borderColor: "rgba(30, 41, 59, 1)",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  }

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#94A3B8",
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(30, 41, 59, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(148, 163, 184, 0.2)",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.label || ""
            const value = context.raw as number
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0)
            const percentage = Math.round((value / total) * 100)
            return `${label}: ${formatCurrency(value)} (${percentage}%)`
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Doughnut ref={chartRef} data={data} options={options} key={`expense-chart-${transactions.length}`} />
    </div>
  )
}
