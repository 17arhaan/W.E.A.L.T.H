"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useData } from "../data-provider"

export default function BudgetComparison() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { budgetComparison } = useData()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-full w-full flex items-center justify-center">Loading...</div>
  }

  const textColor = theme === "dark" ? "#f9fafb" : "#1f2937"
  const gridColor = theme === "dark" ? "#2e2e34" : "#e5e7eb"

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // If no data, show empty state
  if (!budgetComparison || budgetComparison.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-full w-12 h-12 flex items-center justify-center mb-3">
          <BarChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No budget data available</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={budgetComparison}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="category" stroke={textColor} />
          <YAxis stroke={textColor} tickFormatter={formatCurrency} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <div className="flex flex-col gap-2">
                      <p className="font-medium">{label}</p>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-[#8b5cf6]" />
                          <span className="text-sm">Budget: {formatCurrency(payload[0].value as number)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-[#f59e0b]" />
                          <span className="text-sm">Actual: {formatCurrency(payload[1].value as number)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", color: textColor }} />
          <Bar dataKey="budget" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

