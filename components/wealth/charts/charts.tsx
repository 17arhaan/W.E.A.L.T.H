"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import { useData } from "../data-provider"

// Shared formatting function for all charts
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Shared loading component
const ChartLoading = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-t-brand-600 dark:border-t-brand-400 border-gray-100 dark:border-zinc-800 rounded-full animate-spin"></div>
  </div>
)

// Shared empty state component
const ChartEmptyState = ({ icon: Icon, message }: { icon: any; message: string }) => (
  <div className="h-full w-full flex flex-col items-center justify-center">
    <div className="bg-gray-100 dark:bg-zinc-800 rounded-full w-12 h-12 flex items-center justify-center mb-3">
      <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
  </div>
)

// EXPENSE BREAKDOWN CHART
export function ExpenseBreakdown() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { expenseBreakdown } = useData()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <ChartLoading />
  }

  const textColor = "#f9fafb"
  const tooltipBackground = "#1f1f23"
  const tooltipBorder = "#2e2e34"

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
    return <ChartEmptyState icon={PieChart} message="No expense data available" />
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
                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-2 shadow-sm">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
                        <span className="font-medium">{data.name}</span>
                      </div>
                      <div className="text-sm text-gray-400">{formatCurrency(data.value)}</div>
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

// SPENDING TRENDS CHART
export function SpendingTrends() {
  const [mounted, setMounted] = useState(false)
  const { spendingTrends } = useData()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <ChartLoading />
  }

  const textColor = "#f9fafb"
  const gridColor = "#2e2e34"

  // If no data, show empty state
  if (!spendingTrends || spendingTrends.length === 0) {
    return <ChartEmptyState icon={LineChart} message="No spending trend data available" />
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
                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-2 shadow-sm">
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

// BUDGET COMPARISON CHART
export function BudgetComparison() {
  const [mounted, setMounted] = useState(false)
  const { budgetComparison } = useData()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <ChartLoading />
  }

  const textColor = "#f9fafb"
  const gridColor = "#2e2e34"

  // If no data, show empty state
  if (!budgetComparison || budgetComparison.length === 0) {
    return <ChartEmptyState icon={BarChart} message="No budget data available" />
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
                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-2 shadow-sm">
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

// SAVINGS GROWTH CHART
export function SavingsGrowth() {
  const [mounted, setMounted] = useState(false)
  const { savingsGrowth } = useData()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <ChartLoading />
  }

  const textColor = "#f9fafb"
  const gridColor = "#2e2e34"

  // If no data, show empty state
  if (!savingsGrowth || savingsGrowth.length === 0) {
    return <ChartEmptyState icon={AreaChart} message="No savings data available" />
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
                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-2 shadow-sm">
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

