"use client"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
    <div className="w-8 h-8 border-4 border-t-white border-transparent rounded-full animate-spin"></div>
  </div>
)

// Shared empty state component
const ChartEmptyState = ({ icon: Icon, message }: { icon: any; message: string }) => (
  <div className="h-full w-full flex flex-col items-center justify-center">
    <div className="bg-zinc-900 rounded-full w-12 h-12 flex items-center justify-center mb-3">
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
)

// Minimal color palette
const colors = {
  text: "#ffffff",
  grid: "#222222",
  tooltip: {
    bg: "#111111",
    border: "#333333",
  },
  pie: ["#4ade80", "#f87171", "#60a5fa", "#c084fc", "#fbbf24"],
  line: {
    income: "#4ade80",
    expenses: "#f87171",
  },
  bar: {
    budget: "#60a5fa",
    actual: "#fbbf24",
  },
  area: {
    savings: "#4ade80",
    goal: "#60a5fa",
  },
}

// EXPENSE BREAKDOWN CHART
export function MinimalExpenseBreakdown() {
  const [mounted, setMounted] = useState(false)
  const { expenseBreakdown } = useData()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <ChartLoading />
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
              <Cell key={`cell-${index}`} fill={colors.pie[index % colors.pie.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 shadow-sm">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              colors.pie[payload[0].dataKey === "value" ? payload[0].index % colors.pie.length : 0],
                          }}
                        />
                        <span className="font-medium text-white">{data.name}</span>
                      </div>
                      <div className="text-sm text-gray-400">{formatCurrency(data.value)}</div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// SPENDING TRENDS CHART
export function MinimalSpendingTrends() {
  const [mounted, setMounted] = useState(false)
  const { spendingTrends } = useData()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <ChartLoading />
  }

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
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="month" stroke={colors.text} />
          <YAxis stroke={colors.text} tickFormatter={formatCurrency} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 shadow-sm">
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-white">{label}</p>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.line.income }} />
                          <span className="text-sm text-white">
                            Income: {formatCurrency(payload[0].value as number)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.line.expenses }} />
                          <span className="text-sm text-white">
                            Expenses: {formatCurrency(payload[1].value as number)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke={colors.line.income}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke={colors.line.expenses}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// BUDGET COMPARISON CHART
export function MinimalBudgetComparison() {
  const [mounted, setMounted] = useState(false)
  const { budgetComparison } = useData()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <ChartLoading />
  }

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
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="category" stroke={colors.text} />
          <YAxis stroke={colors.text} tickFormatter={formatCurrency} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 shadow-sm">
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-white">{label}</p>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.bar.budget }} />
                          <span className="text-sm text-white">
                            Budget: {formatCurrency(payload[0].value as number)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.bar.actual }} />
                          <span className="text-sm text-white">
                            Actual: {formatCurrency(payload[1].value as number)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="budget" fill={colors.bar.budget} radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" fill={colors.bar.actual} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// SAVINGS GROWTH CHART
export function MinimalSavingsGrowth() {
  const [mounted, setMounted] = useState(false)
  const { savingsGrowth } = useData()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <ChartLoading />
  }

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
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="month" stroke={colors.text} />
          <YAxis stroke={colors.text} tickFormatter={formatCurrency} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 shadow-sm">
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-white">{label}</p>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.area.savings }} />
                          <span className="text-sm text-white">
                            Savings: {formatCurrency(payload[0].value as number)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.area.goal }} />
                          <span className="text-sm text-white">Goal: {formatCurrency(payload[1].value as number)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="savings"
            stroke={colors.area.savings}
            fill={colors.area.savings}
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="goal"
            stroke={colors.area.goal}
            fill={colors.area.goal}
            fillOpacity={0.1}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

