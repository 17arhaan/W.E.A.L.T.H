"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useData } from "../data-provider"

export default function SavingsGrowth() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { savingsGrowth } = useData()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-full w-full flex items-center justify-center">Loading...</div>
  }

  const textColor = theme === "dark" ? "#f9fafb" : "#1f2937"
  const gridColor = theme === "dark" ? "#2e2e34" : "#e5e7eb"

  // Update the formatCurrency function to use INR
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // If no data, show empty state
  if (!savingsGrowth || savingsGrowth.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-full w-12 h-12 flex items-center justify-center mb-3">
          <AreaChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No savings data available</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={savingsGrowth}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
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
                          <div className="h-3 w-3 rounded-full bg-[#0ea5e9]" />
                          <span className="text-sm">Savings: {formatCurrency(payload[0].value as number)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-[#6b7280]" />
                          <span className="text-sm">Goal: {formatCurrency(payload[1].value as number)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area type="monotone" dataKey="savings" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
          <Area
            type="monotone"
            dataKey="goal"
            stroke="#6b7280"
            fill="#6b7280"
            fillOpacity={0.1}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

