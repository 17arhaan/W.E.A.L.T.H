"use client"

import { useRef } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from "chart.js"
import { useFinance } from "@/context/finance-context"

ChartJS.register(ArcElement, Tooltip, Legend)

export function PortfolioAllocationChart() {
  const chartRef = useRef<ChartJS>(null)
  const { investments } = useFinance()

  // Process investment data for the chart
  const processInvestments = () => {
    // Group by category
    const valueByCategory: Record<string, number> = {}

    investments.forEach((investment) => {
      const value = investment.shares * investment.price
      if (valueByCategory[investment.category]) {
        valueByCategory[investment.category] += value
      } else {
        valueByCategory[investment.category] = value
      }
    })

    // Calculate total portfolio value
    const totalValue = Object.values(valueByCategory).reduce((sum, value) => sum + value, 0)

    // Convert to percentages
    const categories = Object.keys(valueByCategory)
    const percentages = Object.values(valueByCategory).map((value) =>
      totalValue > 0 ? Math.round((value / totalValue) * 100) : 0,
    )

    return { categories, percentages }
  }

  const { categories, percentages } = processInvestments()

  // Colors for categories
  const categoryColors = [
    "#10B981", // green
    "#3B82F6", // blue
    "#F59E0B", // yellow
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#6B7280", // gray
    "#EF4444", // red
  ]

  const data = {
    labels: categories,
    datasets: [
      {
        data: percentages,
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
            return `${label}: ${value}%`
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
      <Doughnut ref={chartRef} data={data} options={options} />
    </div>
  )
}
