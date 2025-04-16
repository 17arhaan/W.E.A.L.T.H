import { DashboardLayout } from "@/components/dashboard-layout"
import { PortfolioOverview } from "@/components/portfolio-overview"

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Invest Portfolio</h1>
        </div>
        <PortfolioOverview />
      </div>
    </DashboardLayout>
  )
}
