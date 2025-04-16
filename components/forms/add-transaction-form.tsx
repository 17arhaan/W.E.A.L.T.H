"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinance } from "@/context/finance-context"
import type { TransactionCategory } from "@/lib/types"
import { getCurrentDate } from "@/lib/utils"

export function AddTransactionForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel?: () => void }) {
  const { addTransaction } = useFinance()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    amount: "0",
    date: getCurrentDate(),
    category: "",
    type: "expense" as "income" | "expense",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter categories based on transaction type
  const incomeCategories: TransactionCategory[] = ["Income", "Salary", "Freelance", "Investment"]
  const expenseCategories: TransactionCategory[] = [
    "Housing",
    "Food",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Bills",
    "Shopping",
    "Health",
    "Education",
    "Travel",
    "Other",
  ]

  const categories = formData.type === "income" ? incomeCategories : expenseCategories

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field when user makes a change
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 2) {
      newErrors.description = "Description must be at least 2 characters"
    }

    const amountValue = Number.parseFloat(formData.amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = "Amount must be a positive number"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    addTransaction({
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      date: formData.date,
      category: formData.category as TransactionCategory,
      type: formData.type,
    })

    setIsSubmitting(false)
    setFormData({
      description: "",
      amount: "0",
      date: getCurrentDate(),
      category: "",
      type: "expense",
    })
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Transaction Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => {
              handleChange("type", value)
              // Reset category when type changes
              handleChange("category", "")
            }}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={formData.date} onChange={(e) => handleChange("date", e.target.value)} />
          {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Enter description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
          />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel || onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Transaction"}
        </Button>
      </div>
    </form>
  )
}
