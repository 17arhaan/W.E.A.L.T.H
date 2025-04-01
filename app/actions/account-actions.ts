"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { AccountType } from "@/lib/types"

export async function createAccount(formData: FormData) {
  const user = auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const balance = Number.parseFloat(formData.get("balance") as string)
  const type = formData.get("type") as AccountType

  if (!title || isNaN(balance) || !type) {
    throw new Error("Missing required fields")
  }

  db.createAccount({
    userId: user.id,
    title,
    description,
    balance,
    type,
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function updateAccount(accountId: string, formData: FormData) {
  const user = auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const account = db.getAccount(accountId)

  if (!account || account.userId !== user.id) {
    throw new Error("Account not found")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const balance = Number.parseFloat(formData.get("balance") as string)
  const type = formData.get("type") as AccountType

  if (!title || isNaN(balance) || !type) {
    throw new Error("Missing required fields")
  }

  db.updateAccount(accountId, {
    title,
    description,
    balance,
    type,
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function deleteAccount(accountId: string) {
  const user = auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const account = db.getAccount(accountId)

  if (!account || account.userId !== user.id) {
    throw new Error("Account not found")
  }

  db.deleteAccount(accountId)

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function getAccounts() {
  const user = auth.getUser()

  if (!user) {
    return []
  }

  return db.getAccounts(user.id)
}

export async function getTotalBalance() {
  const user = auth.getUser()

  if (!user) {
    return 0
  }

  return db.getTotalBalance(user.id)
}

