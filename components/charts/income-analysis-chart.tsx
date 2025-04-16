"use client"

import { useRef, useEffect } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { useFinance } from "@/context/finance-context"
import { formatCurrency } from "@/lib/utils"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function IncomeAnalysisChart() {
  const chartRef = useRef<ChartJS>(null)
  const { transactions } = useFinance()

  useEffect(() => {
    // Apply dark mode styling
    const chart = chartRef.current
    if (chart) {
      chart.options.scales!.x!.grid!.color = "rgba(255, 255, 255, 0.1)"
      chart.options.scales!.y!.grid!.color = "rgba(255, 255, 255, 0.1)"
      chart.update()
    }
  }, [])

  // Process transaction data for the chart
  const processIncomeData = () => {
    // Get the last 6 months
    const today = new Date()
    const months = []
    const incomeByCategory: Record<string, number[]> = {}
    const incomeCategories = new Set<string>()

    // Create an array of the last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = month.toLocaleString("default", { month: "short" })
      months.push(monthName)
    }

    // Get all income transactions
    const incomeTransactions = transactions.filter((t) => t.type === "income")

    // Get unique income categories
    incomeTransactions.forEach((t) => {
      incomeCategories.add(t.category)
    })

    // Initialize income by category
    Array.from(incomeCategories).forEach((category) => {
      incomeByCategory[category] = Array(months.length).fill(0)
    })

    // Calculate income for each month by category
    for (let i = 0; i < 6; i++) {
      const month = today.getMonth() - 5 + i
      const year = today.getFullYear() + Math.floor((today.getMonth() - 5 + i) / 12)
      const monthStart = new Date(year, month, 1)
      const monthEnd = new Date(year, month + 1, 0)

      incomeTransactions.forEach((t) => {
        const date = new Date(t.date)
        if (date >= monthStart && date <= monthEnd) {
          const categoryIndex = Array.from(incomeCategories).indexOf(t.category)
          if (categoryIndex !== -1) {
            incomeByCategory[t.category][i] += t.amount
          }
        }
      })
    }

    return { months, incomeByCategory, incomeCategories: Array.from(incomeCategories) }
  }

  const { months, incomeByCategory, incomeCategories } = processIncomeData()

  // Colors for categories
  const categoryColors = [
    "rgba(16, 185, 129, 0.7)", // green
    "rgba(59, 130, 246, 0.7)", // blue
    "rgba(245, 158, 11, 0.7)", // yellow
    "rgba(139, 92, 246, 0.7)", // purple
  ]

  const data = {
    labels: months,
    datasets: incomeCategories.map((category, index) => ({
      label: category,
      data: incomeByCategory[category],
      backgroundColor: categoryColors[index % categoryColors.length],
      borderColor: categoryColors[index % categoryColors.length].replace("0.7", "1"),
      borderWidth: 1,
    })),
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#94A3B8",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(30, 41, 59, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(148, 163, 184, 0.2)",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || ""
            return `${label}: ${formatCurrency(context.parsed.y)}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#94A3B8",
        },
        stacked: true,
      },
      y: {
        grid: {
          display: true,
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#94A3B8",
          callback: (value) => formatCurrency(value as number),
        },
        stacked: true,
      },
    },
  }

  if (incomeCategories.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No income data available</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  )
}
