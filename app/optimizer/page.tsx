import { DashboardLayout } from "@/components/dashboard-layout"
import { FinanceOptimizer } from "@/components/finance-optimizer"

export default function OptimizerPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Optimizer</h1>
        </div>
        <FinanceOptimizer />
      </div>
    </DashboardLayout>
  )
}
