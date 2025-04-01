import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Fallback function to generate recommendations when OpenAI API is unavailable
function generateFallbackRecommendations(transactions, totalSpending, spendingByCategory) {
  const recommendations = []
  let totalSavings = 0

  // Category thresholds (percentage of total spending)
  const CATEGORY_THRESHOLDS = {
    food: 0.15,
    shopping: 0.1,
    entertainment: 0.05,
    transport: 0.1,
    utilities: 0.1,
    housing: 0.3,
  }

  // Check for high food spending
  if (spendingByCategory.food && spendingByCategory.food / totalSpending > CATEGORY_THRESHOLDS.food) {
    const excessPercentage = spendingByCategory.food / totalSpending - CATEGORY_THRESHOLDS.food
    const potentialSavings = Math.round(totalSpending * excessPercentage * 0.5) // 50% of excess
    totalSavings += potentialSavings

    recommendations.push({
      id: "food-budget",
      category: "food",
      title: "Optimize Food Expenses",
      description: `Your food spending is ${Math.round((spendingByCategory.food / totalSpending) * 100)}% of your budget, which is higher than the recommended ${CATEGORY_THRESHOLDS.food * 100}%.`,
      potentialSavings,
      difficulty: "medium",
      steps: [
        "Plan meals weekly and create a shopping list",
        "Buy groceries in bulk when on sale",
        "Cook at home more often instead of eating out",
        "Use food delivery apps less frequently",
        "Bring lunch to work instead of buying",
      ],
      icon: "food",
    })
  }

  // Check for high entertainment spending
  if (
    spendingByCategory.entertainment &&
    spendingByCategory.entertainment / totalSpending > CATEGORY_THRESHOLDS.entertainment
  ) {
    const excessPercentage = spendingByCategory.entertainment / totalSpending - CATEGORY_THRESHOLDS.entertainment
    const potentialSavings = Math.round(totalSpending * excessPercentage * 0.6) // 60% of excess
    totalSavings += potentialSavings

    recommendations.push({
      id: "entertainment-budget",
      category: "entertainment",
      title: "Optimize Entertainment Budget",
      description: `Your entertainment spending is ${Math.round((spendingByCategory.entertainment / totalSpending) * 100)}% of your budget, which is higher than the recommended ${CATEGORY_THRESHOLDS.entertainment * 100}%.`,
      potentialSavings,
      difficulty: "medium",
      steps: [
        "Look for free or low-cost entertainment options",
        "Share subscription services with family or friends",
        "Use library services for books, movies, and music",
        "Take advantage of student or membership discounts",
        "Set a monthly entertainment budget and stick to it",
      ],
      icon: "entertainment",
    })
  }

  // Check for high shopping spending
  if (spendingByCategory.shopping && spendingByCategory.shopping / totalSpending > CATEGORY_THRESHOLDS.shopping) {
    const excessPercentage = spendingByCategory.shopping / totalSpending - CATEGORY_THRESHOLDS.shopping
    const potentialSavings = Math.round(totalSpending * excessPercentage * 0.7) // 70% of excess
    totalSavings += potentialSavings

    recommendations.push({
      id: "shopping-budget",
      category: "shopping",
      title: "Reduce Discretionary Shopping",
      description: `Your shopping spending is ${Math.round((spendingByCategory.shopping / totalSpending) * 100)}% of your budget, which is higher than the recommended ${CATEGORY_THRESHOLDS.shopping * 100}%.`,
      potentialSavings,
      difficulty: "hard",
      steps: [
        "Implement a 24-hour rule before making non-essential purchases",
        "Unsubscribe from retailer emails and promotional content",
        "Create a shopping list and stick to it",
        "Try a 30-day no-spend challenge for non-essentials",
        "Shop with cash instead of cards to be more mindful",
      ],
      icon: "shopping",
    })
  }

  // Check for small frequent transactions
  const smallTransactions = transactions.filter((tx) => tx.type === "outgoing" && tx.amount < 500)
  if (smallTransactions.length > 10) {
    const totalSmallSpending = smallTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    const potentialSavings = Math.round(totalSmallSpending * 0.4) // 40% of small transactions
    totalSavings += potentialSavings

    recommendations.push({
      id: "small-expenses",
      category: "coffee",
      title: "Reduce Small Daily Expenses",
      description: `You have ${smallTransactions.length} small transactions that could be optimized.`,
      potentialSavings,
      difficulty: "easy",
      steps: [
        "Make coffee at home instead of buying",
        "Bring snacks from home",
        "Use a reusable water bottle",
        "Set a weekly budget for small expenses",
        "Track small expenses with a dedicated app",
      ],
      icon: "coffee",
    })
  }

  // Add a general savings recommendation if we have few specific ones
  if (recommendations.length < 2) {
    const potentialSavings = Math.round(totalSpending * 0.1) // 10% general savings
    totalSavings += potentialSavings

    recommendations.push({
      id: "general-savings",
      category: "general",
      title: "General Savings Strategy",
      description: "Based on your spending patterns, here are some general savings strategies.",
      potentialSavings,
      difficulty: "medium",
      steps: [
        "Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
        "Set up automatic transfers to a savings account",
        "Create specific savings goals with deadlines",
        "Review and negotiate bills annually",
        "Track your expenses regularly to identify patterns",
      ],
      icon: "general",
    })
  }

  return {
    recommendations,
    totalSavings,
  }
}

export async function POST(req: Request) {
  try {
    const { transactions, accounts } = await req.json()

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ error: "No transaction data provided" }, { status: 400 })
    }

    // Calculate total spending and spending by category
    const outgoingTransactions = transactions.filter((tx) => tx.type === "outgoing")
    const totalSpending = outgoingTransactions.reduce((sum, tx) => sum + tx.amount, 0)

    // Group transactions by category
    const spendingByCategory = {}
    outgoingTransactions.forEach((tx) => {
      if (!spendingByCategory[tx.category]) {
        spendingByCategory[tx.category] = 0
      }
      spendingByCategory[tx.category] += tx.amount
    })

    // Check if OpenAI API key is available
    const hasOpenAIKey = process.env.OPENAI_API_KEY || false

    let result

    if (hasOpenAIKey) {
      // Use AI to analyze spending patterns if API key is available
      const transactionSummary = Object.entries(spendingByCategory)
        .map(
          ([category, amount]) =>
            `${category}: ₹${amount} (${(((amount as number) / totalSpending) * 100).toFixed(1)}%)`,
        )
        .join("\n")

      const { text: analysisResult } = await generateText({
        model: openai("gpt-4o"),
        prompt: `
          Analyze the following spending data and provide personalized budget optimization recommendations:
          
          Total monthly spending: ₹${totalSpending}
          
          Spending by category:
          ${transactionSummary}
          
          Based on this data, provide:
          1. 3-5 specific savings recommendations with estimated monthly savings amounts
          2. For each recommendation, provide a difficulty rating (easy, medium, hard)
          3. For each recommendation, provide 3-5 actionable steps
          4. Estimate the total potential monthly savings
          
          Format your response as a JSON object with the following structure:
          {
            "recommendations": [
              {
                "id": "unique-id",
                "category": "category-name",
                "title": "recommendation title",
                "description": "detailed description",
                "potentialSavings": number,
                "difficulty": "easy|medium|hard",
                "steps": ["step 1", "step 2", "step 3"],
                "icon": "food|shopping|entertainment|transport|utilities|housing|coffee|credit|general"
              }
            ],
            "totalSavings": number
          }
        `,
      })

      // Parse the AI response
      try {
        // Extract JSON from the response (in case there's any extra text)
        const jsonMatch = analysisResult.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0])
        } else {
          throw new Error("Could not extract JSON from response")
        }
      } catch (error) {
        console.error("Error parsing AI response:", error)
        // Fall back to rule-based recommendations if parsing fails
        result = generateFallbackRecommendations(transactions, totalSpending, spendingByCategory)
      }
    } else {
      // Use fallback rule-based recommendations if API key is not available
      console.log("OpenAI API key not available, using fallback recommendations")
      result = generateFallbackRecommendations(transactions, totalSpending, spendingByCategory)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Budget optimization error:", error)

    // If the error is related to the OpenAI API key, use fallback
    if (error.message && error.message.includes("OpenAI API key is missing")) {
      console.log("OpenAI API key missing, using fallback recommendations")

      try {
        const { transactions } = await req.json()
        const outgoingTransactions = transactions.filter((tx) => tx.type === "outgoing")
        const totalSpending = outgoingTransactions.reduce((sum, tx) => sum + tx.amount, 0)

        const spendingByCategory = {}
        outgoingTransactions.forEach((tx) => {
          if (!spendingByCategory[tx.category]) {
            spendingByCategory[tx.category] = 0
          }
          spendingByCategory[tx.category] += tx.amount
        })

        const result = generateFallbackRecommendations(transactions, totalSpending, spendingByCategory)
        return NextResponse.json(result)
      } catch (fallbackError) {
        console.error("Fallback recommendation error:", fallbackError)
        return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Failed to analyze budget data" }, { status: 500 })
  }
}

