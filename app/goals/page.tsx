import { DashboardLayout } from "@/components/dashboard-layout"
import { FinancialGoals } from "@/components/financial-goals"

export default function GoalsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Financial Goals</h1>
        </div>
        <FinancialGoals />
      </div>
    </DashboardLayout>
  )
}
