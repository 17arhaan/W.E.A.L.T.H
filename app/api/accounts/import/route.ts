import { NextResponse } from "next/server"
import * as dataService from "@/lib/data"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.data || !Array.isArray(body.data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    const importedAccounts = []

    for (const item of body.data) {
      // Validate required fields
      if (!item.title || !item.type || item.balance === undefined) {
        continue // Skip invalid entries
      }

      // Convert balance to number
      const balance = typeof item.balance === "string" ? Number.parseFloat(item.balance) : item.balance

      if (isNaN(balance)) {
        continue // Skip if balance is not a valid number
      }

      // Add account
      const account = dataService.addAccount({
        title: item.title,
        description: item.description || "",
        balance: balance,
        type: item.type,
        timestamp: new Date().toISOString(),
      })

      importedAccounts.push(account)
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully imported ${importedAccounts.length} accounts`,
        accounts: importedAccounts,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to import accounts" }, { status: 400 })
  }
}

