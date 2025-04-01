import { NextResponse } from "next/server"
import * as dataService from "@/lib/data"

export async function GET() {
  const transactions = dataService.getTransactions()
  return NextResponse.json({ transactions })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.amount || !body.type || !body.accountId || !body.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify the account exists
    const account = dataService.getAccounts().find((acc) => acc.id === body.accountId)
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    const transaction = dataService.addTransaction({
      title: body.title,
      amount: Number.parseFloat(body.amount),
      type: body.type,
      category: body.category,
      accountId: body.accountId,
      timestamp: body.timestamp || new Date().toISOString(),
      status: body.status || "completed",
    })

    return NextResponse.json({ success: true, transaction }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

