"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinance } from "@/context/finance-context"
import type { TransactionCategory } from "@/lib/types"

export function AddBudgetForm({ onSuccess }: { onSuccess: () => void }) {
  const { addBudget } = useFinance()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    allocated: "0",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Available categories for budgeting
  const categories: TransactionCategory[] = [
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

    if (!formData.name) {
      newErrors.name = "Category is required"
    }

    const allocatedValue = Number.parseFloat(formData.allocated)
    if (isNaN(allocatedValue) || allocatedValue <= 0) {
      newErrors.allocated = "Allocated amount must be a positive number"
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

    addBudget({
      name: formData.name as TransactionCategory,
      allocated: Number.parseFloat(formData.allocated),
      spent: 0,
      color: "",
    })

    setIsSubmitting(false)
    setFormData({
      name: "",
      allocated: "0",
    })
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Category</Label>
        <Select value={formData.name} onValueChange={(value) => handleChange("name", value)}>
          <SelectTrigger id="name">
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
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="allocated">Allocated Amount (₹)</Label>
        <Input
          id="allocated"
          type="number"
          placeholder="0.00"
          value={formData.allocated}
          onChange={(e) => handleChange("allocated", e.target.value)}
        />
        {errors.allocated && <p className="text-sm text-destructive">{errors.allocated}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Budget"}
        </Button>
      </div>
    </form>
  )
}
