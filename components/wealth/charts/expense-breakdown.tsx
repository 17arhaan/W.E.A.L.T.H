"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useData } from "../data-provider"

export default function ExpenseBreakdown() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { expenseBreakdown } = useData()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-full w-full flex items-center justify-center">Loading...</div>
  }

  const textColor = theme === "dark" ? "#f9fafb" : "#1f2937"
  const tooltipBackground = theme === "dark" ? "#1f1f23" : "#ffffff"
  const tooltipBorder = theme === "dark" ? "#2e2e34" : "#e5e7eb"

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number
    cy: number
    midAngle: number
    innerRadius: number
    outerRadius: number
    percent: number
  }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return percent > 0.05 ? (
      <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  // If no data, show empty state
  if (!expenseBreakdown || expenseBreakdown.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-full w-12 h-12 flex items-center justify-center mb-3">
          <PieChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No expense data available</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={expenseBreakdown}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {expenseBreakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
                        <span className="font-medium">{data.name}</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(data.value)}</div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: "12px", color: textColor }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

