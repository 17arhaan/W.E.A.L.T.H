import { cn } from "@/lib/utils"
import { LineChart, PieChart, BarChart } from "lucide-react"

interface SpendingPattern {
  type: string
  description: string
  percentage: number
}

interface SpendingPatternsProps {
  patterns: SpendingPattern[]
  className?: string
}

export default function SpendingPatterns({ patterns, className }: SpendingPatternsProps) {
  if (!patterns || patterns.length === 0) {
    return (
      <div className={cn("bg-white dark:bg-zinc-800 rounded-lg p-4", className)}>
        <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <LineChart className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          Spending Patterns
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          Not enough data to analyze spending patterns.
        </div>
      </div>
    )
  }

  const getPatternIcon = (type: string) => {
    switch (type) {
      case "weekend":
        return <BarChart className="w-3.5 h-3.5" />
      case "category":
        return <PieChart className="w-3.5 h-3.5" />
      default:
        return <LineChart className="w-3.5 h-3.5" />
    }
  }

  return (
    <div className={cn("bg-white dark:bg-zinc-800 rounded-lg p-4", className)}>
      <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <LineChart className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
        Spending Patterns
      </h2>
      <div className="space-y-3">
        {patterns.map((pattern, index) => (
          <div key={index} className="p-3 rounded-md bg-gray-50 dark:bg-zinc-700/50">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300">
                {getPatternIcon(pattern.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">{pattern.description}</p>
                <div className="mt-2 w-full bg-gray-200 dark:bg-zinc-600 rounded-full h-1.5">
                  <div
                    className="bg-gray-900 dark:bg-gray-300 h-1.5 rounded-full"
                    style={{ width: `${pattern.percentage}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{pattern.percentage}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

