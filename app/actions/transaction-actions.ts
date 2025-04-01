"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { TransactionType, TransactionStatus } from "@/lib/types"

export async function createTransaction(formData: FormData) {
  const user = auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const type = formData.get("type") as TransactionType
  const category = formData.get("category") as string
  const accountId = formData.get("accountId") as string
  const status = (formData.get("status") as TransactionStatus) || "completed"
  const timestampStr = formData.get("timestamp") as string
  const timestamp = timestampStr ? new Date(timestampStr) : new Date()

  if (!title || isNaN(amount) || !type || !category || !accountId) {
    throw new Error("Missing required fields")
  }

  // Verify the account belongs to the user
  const account = db.getAccount(accountId)
  if (!account || account.userId !== user.id) {
    throw new Error("Invalid account")
  }

  db.createTransaction({
    userId: user.id,
    accountId,
    title,
    amount,
    type,
    category,
    timestamp,
    status,
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function updateTransaction(transactionId: string, formData: FormData) {
  const user = auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const transaction = db.getTransaction(transactionId)

  if (!transaction || transaction.userId !== user.id) {
    throw new Error("Transaction not found")
  }

  const title = formData.get("title") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const type = formData.get("type") as TransactionType
  const category = formData.get("category") as string
  const accountId = formData.get("accountId") as string
  const status = formData.get("status") as TransactionStatus
  const timestampStr = formData.get("timestamp") as string
  const timestamp = timestampStr ? new Date(timestampStr) : undefined

  if (!title || isNaN(amount) || !type || !category || !accountId || !status) {
    throw new Error("Missing required fields")
  }

  // Verify the account belongs to the user
  const account = db.getAccount(accountId)
  if (!account || account.userId !== user.id) {
    throw new Error("Invalid account")
  }

  db.updateTransaction(transactionId, {
    title,
    amount,
    type,
    category,
    accountId,
    status,
    timestamp,
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function deleteTransaction(transactionId: string) {
  const user = auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const transaction = db.getTransaction(transactionId)

  if (!transaction || transaction.userId !== user.id) {
    throw new Error("Transaction not found")
  }

  db.deleteTransaction(transactionId)

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function getRecentTransactions(limit = 5) {
  const user = auth.getUser()

  if (!user) {
    return []
  }

  return db.getTransactions(user.id, limit)
}

