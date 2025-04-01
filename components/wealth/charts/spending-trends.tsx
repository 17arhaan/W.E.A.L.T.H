"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useData } from "../data-provider"

export default function SpendingTrends() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { spendingTrends } = useData()

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
  if (!spendingTrends || spendingTrends.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-full w-12 h-12 flex items-center justify-center mb-3">
          <LineChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No spending trend data available</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={spendingTrends}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" stroke={textColor} />
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
                          <div className="h-3 w-3 rounded-full bg-[#10b981]" />
                          <span className="text-sm">Income: {formatCurrency(payload[0].value as number)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-[#ef4444]" />
                          <span className="text-sm">Expenses: {formatCurrency(payload[1].value as number)}</span>
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
          <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

