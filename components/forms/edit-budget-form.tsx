"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFinance } from "@/context/finance-context"
import type { BudgetCategory } from "@/lib/types"

export function EditBudgetForm({
  budget,
  onSuccess,
  onCancel,
}: {
  budget: BudgetCategory
  onSuccess: () => void
  onCancel: () => void
}) {
  const { updateBudget } = useFinance()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    allocated: budget.allocated.toString(),
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

    updateBudget({
      ...budget,
      allocated: Number.parseFloat(formData.allocated),
    })

    setIsSubmitting(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-lg font-medium mb-2">{budget.name}</div>

      <div className="space-y-2">
        <Label htmlFor="edit-allocated">Allocated Amount (₹)</Label>
        <Input
          id="edit-allocated"
          type="number"
          placeholder="0.00"
          value={formData.allocated}
          onChange={(e) => handleChange("allocated", e.target.value)}
        />
        {errors.allocated && <p className="text-sm text-destructive">{errors.allocated}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Budget"}
        </Button>
      </div>
    </form>
  )
}
