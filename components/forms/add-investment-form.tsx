"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinance } from "@/context/finance-context"
import { getCurrentDate } from "@/lib/utils"

export function AddInvestmentForm({ onSuccess }: { onSuccess: () => void }) {
  const { addInvestment } = useFinance()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    category: "",
    shares: "0",
    price: "0",
    purchasePrice: "0",
    purchaseDate: getCurrentDate(),
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

    if (!formData.symbol.trim()) {
      newErrors.symbol = "Symbol is required"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    const sharesValue = Number.parseFloat(formData.shares)
    if (isNaN(sharesValue) || sharesValue <= 0) {
      newErrors.shares = "Shares must be a positive number"
    }

    const priceValue = Number.parseFloat(formData.price)
    if (isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = "Current price must be a positive number"
    }

    const purchasePriceValue = Number.parseFloat(formData.purchasePrice)
    if (isNaN(purchasePriceValue) || purchasePriceValue <= 0) {
      newErrors.purchasePrice = "Purchase price must be a positive number"
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = "Purchase date is required"
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

    addInvestment({
      symbol: formData.symbol,
      name: formData.name,
      category: formData.category as any,
      shares: Number.parseFloat(formData.shares),
      price: Number.parseFloat(formData.price),
      purchasePrice: Number.parseFloat(formData.purchasePrice),
      purchaseDate: formData.purchaseDate,
    })

    setIsSubmitting(false)
    setFormData({
      symbol: "",
      name: "",
      category: "",
      shares: "0",
      price: "0",
      purchasePrice: "0",
      purchaseDate: getCurrentDate(),
    })
    onSuccess()
  }

  const categories = ["Stocks", "Bonds", "Real Estate", "Crypto", "Mutual Funds", "Gold", "Other"]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="symbol">Symbol/Ticker</Label>
          <Input
            id="symbol"
            placeholder="e.g., RELIANCE"
            value={formData.symbol}
            onChange={(e) => handleChange("symbol", e.target.value)}
          />
          {errors.symbol && <p className="text-sm text-destructive">{errors.symbol}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g., Reliance Industries Ltd."
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="shares">Shares/Units</Label>
          <Input
            id="shares"
            type="number"
            placeholder="0.00"
            value={formData.shares}
            onChange={(e) => handleChange("shares", e.target.value)}
          />
          {errors.shares && <p className="text-sm text-destructive">{errors.shares}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Current Price (₹)</Label>
          <Input
            id="price"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
          {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
          <Input
            id="purchasePrice"
            type="number"
            placeholder="0.00"
            value={formData.purchasePrice}
            onChange={(e) => handleChange("purchasePrice", e.target.value)}
          />
          {errors.purchasePrice && <p className="text-sm text-destructive">{errors.purchasePrice}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => handleChange("purchaseDate", e.target.value)}
          />
          {errors.purchaseDate && <p className="text-sm text-destructive">{errors.purchaseDate}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Investment"}
        </Button>
      </div>
    </form>
  )
}
