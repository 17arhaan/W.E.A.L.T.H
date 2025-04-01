import type { FinancialInsight } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, CreditCard } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface InsightsCardProps {
  insights: FinancialInsight[]
  className?: string
}

// Add a helper function to get the appropriate icon based on insight type and impact
const getInsightIcon = (type: string, impact: string) => {
  if (type === "spending") {
    if (impact === "negative") {
      return <TrendingDown className="w-3.5 h-3.5" />
    } else {
      return <CreditCard className="w-3.5 h-3.5" />
    }
  } else if (type === "saving") {
    return <TrendingUp className="w-3.5 h-3.5" />
  } else {
    return <AlertCircle className="w-3.5 h-3.5" />
  }
}

export default function InsightsCard({ insights, className }: InsightsCardProps) {
  if (!insights || insights.length === 0) {
    return (
      <div className={cn("bg-zinc-900 rounded-lg p-4", className)}>
        <h2 className="text-base font-medium text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-gray-400" />
          Financial Insights
        </h2>
        <div className="text-sm text-gray-400 text-center py-6">No insights available yet. Check back later!</div>
      </div>
    )
  }

  return (
    <div className={cn("bg-zinc-900 rounded-lg p-4", className)}>
      <h2 className="text-base font-medium text-white mb-4 flex items-center gap-2">
        <Lightbulb className="w-3.5 h-3.5 text-gray-400" />
        Financial Insights
      </h2>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={cn(
              "p-3 rounded-md transition-all hover:translate-y-[-1px]",
              insight.impact === "positive"
                ? "bg-emerald-900/20"
                : insight.impact === "negative"
                  ? "bg-red-900/20"
                  : "bg-zinc-800/50",
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "p-1.5 rounded-md",
                  insight.impact === "positive"
                    ? "bg-emerald-900/30 text-emerald-400"
                    : insight.impact === "negative"
                      ? "bg-red-900/30 text-red-400"
                      : "bg-zinc-800 text-gray-300",
                )}
              >
                {getInsightIcon(insight.type, insight.impact)}
              </div>
              <div className="flex-1">
                <h3
                  className={cn(
                    "text-sm font-medium",
                    insight.impact === "positive"
                      ? "text-emerald-300"
                      : insight.impact === "negative"
                        ? "text-red-300"
                        : "text-white",
                  )}
                >
                  {insight.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{insight.description}</p>
                <div className="text-[11px] text-gray-500 mt-1">{formatDate(insight.date)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

