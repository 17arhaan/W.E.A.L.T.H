import type { FinancialHealthScore } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Activity, Wallet, CreditCard, TrendingUp } from "lucide-react"

interface HealthScoreCardProps {
  healthScore: FinancialHealthScore
  className?: string
}

export default function HealthScoreCard({ healthScore, className }: HealthScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-amber-400"
    return "text-red-400"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-emerald-900/20"
    if (score >= 60) return "bg-amber-900/20"
    return "bg-red-900/20"
  }

  return (
    <div className={cn("bg-zinc-900 rounded-lg p-4", className)}>
      <h2 className="text-base font-medium text-white mb-4 flex items-center gap-2">
        <Activity className="w-3.5 h-3.5 text-gray-400" />
        Financial Health Score
      </h2>

      <div className="flex flex-col items-center mb-4">
        <div
          className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center mb-2 transition-all duration-500",
            getScoreBackground(healthScore.overall),
          )}
        >
          <span className={cn("text-3xl font-bold", getScoreColor(healthScore.overall))}>{healthScore.overall}</span>
        </div>
        <div className="text-sm text-gray-400">
          Last updated: {new Date(healthScore.lastUpdated).toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2 rounded-md bg-zinc-800/50 transition-all hover:bg-zinc-800">
          <Wallet className={cn("w-4 h-4 mb-1", getScoreColor(healthScore.savings))} />
          <span className={cn("text-lg font-medium", getScoreColor(healthScore.savings))}>{healthScore.savings}</span>
          <span className="text-xs text-gray-400">Savings</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-md bg-zinc-800/50 transition-all hover:bg-zinc-800">
          <TrendingUp className={cn("w-4 h-4 mb-1", getScoreColor(healthScore.spending))} />
          <span className={cn("text-lg font-medium", getScoreColor(healthScore.spending))}>{healthScore.spending}</span>
          <span className="text-xs text-gray-400">Spending</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-md bg-zinc-800/50 transition-all hover:bg-zinc-800">
          <CreditCard className={cn("w-4 h-4 mb-1", getScoreColor(healthScore.debt))} />
          <span className={cn("text-lg font-medium", getScoreColor(healthScore.debt))}>{healthScore.debt}</span>
          <span className="text-xs text-gray-400">Debt</span>
        </div>
      </div>
    </div>
  )
}

