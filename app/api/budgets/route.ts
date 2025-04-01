import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const month = request.nextUrl.searchParams.get("month")
  const year = request.nextUrl.searchParams.get("year")

  const budgets = db.getBudgets(
    user.id,
    month ? Number.parseInt(month) : undefined,
    year ? Number.parseInt(year) : undefined,
  )

  return NextResponse.json({ budgets })
}

export async function POST(request: NextRequest) {
  const user = auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Validate required fields
    if (!data.category || !data.budgetAmount || data.month === undefined || data.year === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const budget = db.createBudget({
      userId: user.id,
      category: data.category,
      budgetAmount: data.budgetAmount,
      actualAmount: data.actualAmount || 0,
      month: data.month,
      year: data.year,
    })

    return NextResponse.json({ budget }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

