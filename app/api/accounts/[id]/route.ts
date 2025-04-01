import { NextResponse } from "next/server"
import * as dataService from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const account = dataService.getAccounts().find((acc) => acc.id === params.id)

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 })
  }

  return NextResponse.json({ account })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title && !body.description && body.balance === undefined && !body.type) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const updates: any = {}
    if (body.title) updates.title = body.title
    if (body.description !== undefined) updates.description = body.description
    if (body.balance !== undefined) updates.balance = Number.parseFloat(body.balance)
    if (body.type) updates.type = body.type

    const updatedAccount = dataService.updateAccount(params.id, updates)

    if (!updatedAccount) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, account: updatedAccount })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const success = dataService.deleteAccount(params.id)

  if (!success) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

