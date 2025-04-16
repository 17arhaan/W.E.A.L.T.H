"use client"

import type React from "react"

import { Check, Clock, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface FinancialGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  status: "in-progress" | "completed" | "behind"
  icon: React.ReactNode
}

const goals: FinancialGoal[] = [
  {
    id: "g1",
    name: "Emergency Fund",
    targetAmount: 760000,
    currentAmount: 646000,
    targetDate: "2023-12-31",
    status: "in-progress",
    icon: <Target className="h-5 w-5 text-wealth-blue" />,
  },
  {
    id: "g2",
    name: "New Car",
    targetAmount: 1900000,
    currentAmount: 912000,
    targetDate: "2024-06-30",
    status: "in-progress",
    icon: <Target className="h-5 w-5 text-wealth-yellow" />,
  },
  {
    id: "g3",
    name: "Vacation Fund",
    targetAmount: 380000,
    currentAmount: 380000,
    targetDate: "2023-07-15",
    status: "completed",
    icon: <Check className="h-5 w-5 text-wealth-green" />,
  },
  {
    id: "g4",
    name: "Home Down Payment",
    targetAmount: 4560000,
    currentAmount: 1140000,
    targetDate: "2025-01-01",
    status: "behind",
    icon: <Clock className="h-5 w-5 text-wealth-red" />,
  },
]

export function FinancialGoals() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {goals.map((goal) => {
        const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100)

        return (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-muted p-2">{goal.icon}</div>
                <div>
                  <CardTitle className="text-lg">{goal.name}</CardTitle>
                  <CardDescription>Target: {new Date(goal.targetDate).toLocaleDateString()}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">₹{goal.currentAmount.toLocaleString()}</span>
                  <span className="text-sm font-medium">of ₹{goal.targetAmount.toLocaleString()}</span>
                </div>
                <Progress
                  value={percentage}
                  className="h-2"
                  indicatorClassName={
                    goal.status === "completed"
                      ? "bg-wealth-green"
                      : goal.status === "behind"
                        ? "bg-wealth-red"
                        : "bg-wealth-blue"
                  }
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{percentage}% complete</span>
                  <span
                    className={
                      goal.status === "completed"
                        ? "text-wealth-green"
                        : goal.status === "behind"
                          ? "text-wealth-red"
                          : "text-wealth-blue"
                    }
                  >
                    {goal.status === "completed"
                      ? "Goal Achieved!"
                      : goal.status === "behind"
                        ? "Behind Schedule"
                        : "On Track"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {goal.status !== "completed" && (
                <Button variant="outline" className="w-full">
                  Add Funds
                </Button>
              )}
              {goal.status === "completed" && (
                <Button variant="outline" className="w-full" disabled>
                  Completed
                </Button>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
