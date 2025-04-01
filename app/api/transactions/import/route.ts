import { NextResponse } from "next/server"
import * as dataService from "@/lib/data"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.data || !Array.isArray(body.data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    const importedTransactions = []

    for (const item of body.data) {
      // Validate required fields
      if (!item.title || !item.amount || !item.type || !item.category || !item.accountId) {
        continue // Skip invalid entries
      }

      // Convert amount to number
      const amount = typeof item.amount === "string" ? Number.parseFloat(item.amount) : item.amount

      if (isNaN(amount)) {
        continue // Skip if amount is not a valid number
      }

      // Verify the account exists
      const account = dataService.getAccounts().find((acc) => acc.id === item.accountId)
      if (!account) {
        continue // Skip if account doesn't exist
      }

      // Add transaction
      const transaction = dataService.addTransaction({
        title: item.title,
        amount: amount,
        type: item.type,
        category: item.category,
        accountId: item.accountId,
        timestamp: item.timestamp || new Date().toISOString(),
        status: item.status || "completed",
      })

      importedTransactions.push(transaction)
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully imported ${importedTransactions.length} transactions`,
        transactions: importedTransactions,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to import transactions" }, { status: 400 })
  }
}

