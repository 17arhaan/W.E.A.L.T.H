import { NextResponse } from "next/server"
import * as dataService from "@/lib/data"

export async function GET() {
  const accounts = dataService.getAccounts()
  return NextResponse.json({ accounts })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.type || body.balance === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const account = dataService.addAccount({
      title: body.title,
      description: body.description || "",
      balance: Number.parseFloat(body.balance),
      type: body.type,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, account }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

