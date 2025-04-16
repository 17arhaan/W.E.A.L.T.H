"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinance } from "@/context/finance-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { AddBudgetForm } from "@/components/forms/add-budget-form"
import { EditBudgetForm } from "@/components/forms/edit-budget-form"
import type { BudgetCategory } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function BudgetOverview() {
  const { budgets, deleteBudget } = useFinance()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null)

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const overallPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0

  const handleDeleteClick = (id: string) => {
    setBudgetToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete)
      setBudgetToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Budgets</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Budget
            </>
          )}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Budget</CardTitle>
            <CardDescription>Create a new budget to track your spending</CardDescription>
          </CardHeader>
          <CardContent>
            <AddBudgetForm onSuccess={() => setShowAddForm(false)} />
          </CardContent>
        </Card>
      )}

      {editingBudget && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Budget Category</CardTitle>
            <CardDescription>Update your budget category</CardDescription>
          </CardHeader>
          <CardContent>
            <EditBudgetForm
              category={editingBudget}
              onSuccess={() => setEditingBudget(null)}
              onCancel={() => setEditingBudget(null)}
            />
          </CardContent>
        </Card>
      )}

      {budgets.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Overview</CardTitle>
              <CardDescription>Your overall budget status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Overall Budget</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(totalSpent)} / {formatCurrency(totalAllocated)}
                  </span>
                </div>
                <Progress value={overallPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{overallPercentage}% used</span>
                  <span>{100 - overallPercentage}% remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {budgets.map((budget) => {
              const percentage = budget.allocated > 0 ? Math.round((budget.spent / budget.allocated) * 100) : 0
              const isOverBudget = percentage > 100

              return (
                <Card key={budget.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{budget.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingBudget(budget)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(budget.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <span className={`text-xs ${isOverBudget ? "text-wealth-red" : "text-muted-foreground"}`}>
                      {isOverBudget ? "Over budget" : `${100 - percentage}% remaining`}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{formatCurrency(budget.spent)}</span>
                        <span className="text-sm font-medium">of {formatCurrency(budget.allocated)}</span>
                      </div>
                      <Progress
                        value={percentage > 100 ? 100 : percentage}
                        className={`h-2 ${isOverBudget ? "bg-red-950" : ""}`}
                        indicatorClassName={budget.color}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      ) : (
        <EmptyState
          title="No budgets yet"
          description="Add your first budget to start tracking your spending"
          icon="budget"
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the budget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
