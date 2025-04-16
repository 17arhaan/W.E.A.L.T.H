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

export function PortfolioPerformanceChart() {
  const chartRef = useRef<ChartJS>(null)
  const { investments } = useFinance()

  useEffect(() => {
    // Apply dark mode styling
    const chart = chartRef.current
    if (chart) {
      chart.options.scales!.x!.grid!.color = "rgba(255, 255, 255, 0.1)"
      chart.options.scales!.y!.grid!.color = "rgba(255, 255, 255, 0.1)"
      chart.update()
    }
  }, [])

  // Calculate current portfolio value
  const currentValue = investments.reduce((sum, investment) => sum + investment.shares * investment.price, 0)

  // Generate simulated historical data
  // In a real app, this would come from an API or database
  const generateHistoricalData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const portfolioValues = []
    const benchmarkValues = []

    // Start with current value and work backwards with random fluctuations
    let value = currentValue
    let benchmarkValue = currentValue

    for (let i = 11; i >= 0; i--) {
      portfolioValues.unshift(value)
      benchmarkValues.unshift(benchmarkValue)

      // Random monthly change between -3% and +5% for portfolio
      const portfolioChange = Math.random() * 0.08 - 0.03
      value = value / (1 + portfolioChange)

      // Random monthly change between -2% and +4% for benchmark
      const benchmarkChange = Math.random() * 0.06 - 0.02
      benchmarkValue = benchmarkValue / (1 + benchmarkChange)
    }

    return { months, portfolioValues, benchmarkValues }
  }

  const { months, portfolioValues, benchmarkValues } = generateHistoricalData()

  const data = {
    labels: months,
    datasets: [
      {
        label: "Portfolio Value",
        data: portfolioValues,
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Benchmark (Nifty 50)",
        data: benchmarkValues,
        borderColor: "#3B82F6",
        backgroundColor: "transparent",
        tension: 0.4,
        borderDash: [5, 5],
        fill: false,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#94A3B8",
          usePointStyle: true,
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
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || ""
            return `${label}: ${formatCurrency(context.raw as number)}`
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
        radius: 2,
        hoverRadius: 5,
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  )
}
