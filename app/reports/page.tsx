import { DashboardLayout } from "@/components/dashboard-layout"
import { FinancialReports } from "@/components/financial-reports"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Financial Reports</h1>
        </div>
        <FinancialReports />
      </div>
    </DashboardLayout>
  )
}
