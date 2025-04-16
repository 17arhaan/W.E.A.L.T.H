import { BarChart3, CreditCard, DollarSign, LineChart, PieChart, Wallet } from "lucide-react"

type EmptyStateProps = {
  title: string
  description: string
  icon: "transaction" | "budget" | "investment" | "chart" | "pieChart" | "analytics" | "reports"
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  const icons = {
    transaction: <CreditCard className="h-12 w-12 text-muted-foreground/50" />,
    budget: <Wallet className="h-12 w-12 text-muted-foreground/50" />,
    investment: <DollarSign className="h-12 w-12 text-muted-foreground/50" />,
    chart: <LineChart className="h-12 w-12 text-muted-foreground/50" />,
    pieChart: <PieChart className="h-12 w-12 text-muted-foreground/50" />,
    analytics: <BarChart3 className="h-12 w-12 text-muted-foreground/50" />,
    reports: <BarChart3 className="h-12 w-12 text-muted-foreground/50" />,
  }

  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
      <div className="mb-4">{icons[icon]}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
