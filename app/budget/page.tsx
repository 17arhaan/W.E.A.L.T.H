import { DashboardLayout } from "@/components/dashboard-layout"
import { BudgetOverview } from "@/components/budget-overview"

export default function BudgetPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Budget</h1>
        </div>
        <BudgetOverview />
      </div>
    </DashboardLayout>
  )
}
