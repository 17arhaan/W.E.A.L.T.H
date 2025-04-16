import { type NextRequest, NextResponse } from "next/server"
import { generateFinancialAdvice } from "@/lib/ai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch((error) => {
      console.error("Error parsing request JSON:", error)
      return {}
    })

    const { financialData, specificArea } = body

    if (!financialData) {
      const defaultSuggestions = await generateFinancialAdvice(undefined, specificArea)
      return NextResponse.json(
        {
          error: "Financial data is required",
          suggestions: defaultSuggestions.suggestions,
        },
        { status: 200 }
      )
    }

    if (
      typeof financialData.totalBalance !== "number" ||
      typeof financialData.monthlyIncome !== "number" ||
      typeof financialData.monthlyExpenses !== "number"
    ) {
      const defaultSuggestions = await generateFinancialAdvice(undefined, specificArea)
      return NextResponse.json(
        {
          error:
            "Invalid financial data format. Numbers expected for totalBalance, monthlyIncome, and monthlyExpenses.",
          suggestions: defaultSuggestions.suggestions,
        },
        { status: 200 }
      )
    }

    if (financialData.budgets && !Array.isArray(financialData.budgets)) {
      financialData.budgets = []
    }

    if (financialData.transactions && !Array.isArray(financialData.transactions)) {
      financialData.transactions = []
    }

    if (financialData.investments && !Array.isArray(financialData.investments)) {
      financialData.investments = []
    }

    try {
      const result = await generateFinancialAdvice(financialData, specificArea)
      return NextResponse.json({ suggestions: result.suggestions }, { status: 200 })
    } catch (aiError) {
      console.error("Error generating financial advice:", aiError)
      const defaultSuggestions = await generateFinancialAdvice(undefined, specificArea)
      return NextResponse.json(
        {
          error: "Failed to generate AI suggestions. Using default suggestions instead.",
          errorDetails: aiError instanceof Error ? aiError.message : String(aiError),
          suggestions: defaultSuggestions.suggestions,
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error("Error in financial advice API:", error)
    const defaultSuggestions = await generateFinancialAdvice()
    return NextResponse.json(
      {
        error: "Failed to process request. Using default suggestions.",
        errorDetails: error instanceof Error ? error.message : String(error),
        suggestions: defaultSuggestions.suggestions,
      },
      { status: 200 }
    )
  }
}
