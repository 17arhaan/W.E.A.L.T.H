import { DashboardLayout } from "@/components/dashboard-layout"
import { TransactionsTable } from "@/components/transactions-table"

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <TransactionsTable />
      </div>
    </DashboardLayout>
  )
}
