import { NextResponse } from "next/server"
import * as dataService from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const transaction = dataService.getTransactions().find((tx) => tx.id === params.id)

  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
  }

  return NextResponse.json({ transaction })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title && !body.amount && !body.type && !body.category && !body.accountId) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const updates: any = {}
    if (body.title) updates.title = body.title
    if (body.amount !== undefined) updates.amount = Number.parseFloat(body.amount)
    if (body.type) updates.type = body.type
    if (body.category) updates.category = body.category
    if (body.accountId) {
      // Verify the account exists
      const account = dataService.getAccounts().find((acc) => acc.id === body.accountId)
      if (!account) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 })
      }
      updates.accountId = body.accountId
    }
    if (body.timestamp) updates.timestamp = body.timestamp
    if (body.status) updates.status = body.status

    const updatedTransaction = dataService.updateTransaction(params.id, updates)

    if (!updatedTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, transaction: updatedTransaction })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const success = dataService.deleteTransaction(params.id)

  if (!success) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

