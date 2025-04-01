"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { GoalStatus } from "@/lib/types"

export async function createGoal(formData: FormData) {
  const user = auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const subtitle = formData.get("subtitle") as string
  const targetAmount = Number.parseFloat(formData.get("targetAmount") as string)
  const currentAmount = Number.parseFloat(formData.get("currentAmount") as string) || 0
  const targetDateStr = formData.get("targetDate") as string
  const status = (formData.get("status") as GoalStatus) || "pending"

  if (!title || isNaN(targetAmount) || !targetDateStr) {
    throw new Error("Missing required fields")
  }

  const targetDate = new Date(targetDateStr)
  const progress = Math.round((currentAmount / targetAmount) * 100)

  db.createGoal({
    userId: user.id,
    title,
    subtitle,
    targetAmount,
    currentAmount,
    targetDate,
    status,
    progress,
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function updateGoal(goalId: string, formData: FormData) {
  const user = auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const goal = db.getGoal(goalId)

  if (!goal || goal.userId !== user.id) {
    throw new Error("Goal not found")
  }

  const title = formData.get("title") as string
  const subtitle = formData.get("subtitle") as string
  const targetAmount = Number.parseFloat(formData.get("targetAmount") as string)
  const currentAmount = Number.parseFloat(formData.get("currentAmount") as string)
  const targetDateStr = formData.get("targetDate") as string
  const status = formData.get("status") as GoalStatus

  if (!title || isNaN(targetAmount) || isNaN(currentAmount) || !targetDateStr || !status) {
    throw new Error("Missing required fields")
  }

  const targetDate = new Date(targetDateStr)
  const progress = Math.round((currentAmount / targetAmount) * 100)

  db.updateGoal(goalId, {
    title,
    subtitle,
    targetAmount,
    currentAmount,
    targetDate,
    status,
    progress,
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function deleteGoal(goalId: string) {
  const user = auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const goal = db.getGoal(goalId)

  if (!goal || goal.userId !== user.id) {
    throw new Error("Goal not found")
  }

  db.deleteGoal(goalId)

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function getFinancialGoals() {
  const user = auth.getUser()

  if (!user) {
    return []
  }

  return db.getGoals(user.id)
}

