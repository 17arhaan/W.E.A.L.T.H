"use client"

import { useEffect, useRef } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js"
import { useFinance } from "@/context/finance-context"
import { formatCurrency } from "@/lib/utils"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export function BalanceChart() {
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
  const processTransactions = () => {
    // Get the last 6 months
    const today = new Date()
    const months = []
    const balances = []
    let runningBalance = 0

    // Create an array of the last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = month.toLocaleString("default", { month: "short" })
      months.push(monthName)
    }

    // Calculate balance for each month
    for (let i = 0; i < 6; i++) {
      const month = today.getMonth() - 5 + i
      const year = today.getFullYear() + Math.floor((today.getMonth() - 5 + i) / 12)
      const monthStart = new Date(year, month, 1)
      const monthEnd = new Date(year, month + 1, 0)

      const monthTransactions = transactions.filter((t) => {
        const date = new Date(t.date)
        return date >= monthStart && date <= monthEnd
      })

      const monthIncome = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      const monthExpenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      runningBalance += monthIncome - monthExpenses
      balances.push(runningBalance)
    }

    return { months, balances }
  }

  const { months, balances } = processTransactions()

  const data = {
    labels: months,
    datasets: [
      {
        label: "Balance",
        data: balances,
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
        displayColors: false,
        callbacks: {
          label: (context) => formatCurrency(context.raw as number),
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
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 3,
        hoverRadius: 5,
        backgroundColor: "#10B981",
        borderColor: "#10B981",
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  )
}
