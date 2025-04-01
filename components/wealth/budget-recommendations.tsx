import { cn } from "@/lib/utils"
import { TrendingUp, ArrowRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface BudgetRecommendation {
  category: string
  currentBudget: number
  recommendedBudget: number
  reason: string
}

interface BudgetRecommendationsProps {
  recommendations: BudgetRecommendation[]
  className?: string
}

export default function BudgetRecommendations({ recommendations, className }: BudgetRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className={cn("bg-white dark:bg-zinc-800 rounded-lg p-4", className)}>
        <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          Budget Recommendations
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          No budget recommendations available.
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-white dark:bg-zinc-800 rounded-lg p-4", className)}>
      <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
        Budget Recommendations
      </h2>
      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="p-3 rounded-md bg-gray-50 dark:bg-zinc-700/50">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white capitalize mb-1">
              {recommendation.category}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{recommendation.reason}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-900 dark:text-white">{formatCurrency(recommendation.currentBudget)}</span>
              <ArrowRight className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {formatCurrency(recommendation.recommendedBudget)}
              </span>
            </div>
            <button className="mt-2 w-full text-xs bg-gray-100 dark:bg-zinc-600 hover:bg-gray-200 dark:hover:bg-zinc-500 text-gray-600 dark:text-gray-300 py-1 rounded-md transition-colors">
              Apply Recommendation
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

