import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  // Convert to INR with Indian number formatting (lakhs, crores)
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(date: string | Date): string {
  if (typeof date === "string") {
    date = new Date(date)
  }

  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    })
  }
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(0)}%`
}

export function getCategoryIcon(category: string) {
  // This would normally return different icons based on the category
  // For simplicity, we're not implementing this here
  return null
}

// Calculate progress percentage
export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0
  return Math.min(Math.round((current / target) * 100), 100)
}

// Get days remaining until a target date
export function getDaysRemaining(targetDate: string | Date): number {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate
  const today = new Date()

  // Reset time to compare dates only
  target.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = target.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

