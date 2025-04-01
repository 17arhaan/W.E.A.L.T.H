import { type NextRequest, NextResponse } from "next/server"
import * as dataService from "@/lib/data"

export async function GET(request: NextRequest) {
  const goals = dataService.getGoals()
  return NextResponse.json({ goals })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.targetAmount || !data.targetDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate progress
    const currentAmount = data.currentAmount || 0
    const progress = Math.round((currentAmount / data.targetAmount) * 100)

    const goal = dataService.addGoal({
      title: data.title,
      subtitle: data.subtitle || "",
      targetAmount: data.targetAmount,
      currentAmount: currentAmount,
      targetDate: new Date(data.targetDate),
      status: data.status || "pending",
      progress,
    })

    return NextResponse.json({ goal }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

