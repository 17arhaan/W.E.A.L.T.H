import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const type = request.nextUrl.searchParams.get("type")
  const month = request.nextUrl.searchParams.get("month")
  const year = request.nextUrl.searchParams.get("year") || new Date().getFullYear().toString()

  let data

  switch (type) {
    case "monthly-expenses":
      data = db.getMonthlyExpenses(user.id, Number.parseInt(year))
      break
    case "expense-breakdown":
      data = db.getExpenseBreakdown(
        user.id,
        month ? Number.parseInt(month) : undefined,
        year ? Number.parseInt(year) : undefined,
      )
      break
    case "savings-growth":
      data = db.getSavingsGrowth(user.id, Number.parseInt(year))
      break
    case "dashboard-summary":
      const totalBalance = db.getTotalBalance(user.id)
      const { income, expenses } = db.getMonthlyTotals(user.id)
      data = { totalBalance, income, expenses }
      break
    default:
      return NextResponse.json({ error: "Invalid analytics type" }, { status: 400 })
  }

  return NextResponse.json({ data })
}

