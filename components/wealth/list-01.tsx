"use client"

import { cn } from "@/lib/utils"
import { ArrowUpRight, Wallet, QrCode, Plus, ArrowRight, CreditCard } from "lucide-react"
import type { Account } from "@/lib/types"
import { useState } from "react"
import AddAccountForm from "./add-account-form"
import { formatCurrency } from "@/lib/utils"

interface List01Props {
  accounts?: Account[]
  className?: string
}

export default function List01({ accounts = [], className }: List01Props) {
  const [showAddForm, setShowAddForm] = useState(false)

  if (showAddForm) {
    return <AddAccountForm onClose={() => setShowAddForm(false)} className={className} />
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className={cn("w-full max-w-xl mx-auto", className)}>
        <div className="text-center py-8">
          <div className="bg-zinc-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <Wallet className="w-5 h-5 text-brand-400" />
          </div>
          <h3 className="text-sm font-medium text-white mb-1">No accounts yet</h3>
          <p className="text-xs text-gray-400 mb-4">Add your first account to get started</p>
          <button type="button" onClick={() => setShowAddForm(true)} className="btn-primary">
            <Plus className="w-3 h-3 mr-1" />
            <span>Add Account</span>
          </button>
        </div>
      </div>
    )
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "savings":
        return <Wallet className="w-3.5 h-3.5 text-success-500" />
      case "checking":
        return <QrCode className="w-3.5 h-3.5 text-brand-400" />
      case "investment":
        return <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
      case "debt":
        return <CreditCard className="w-3.5 h-3.5 text-danger-500" />
      default:
        return <Wallet className="w-3.5 h-3.5 text-gray-400" />
    }
  }

  const getAccountColor = (type: string) => {
    switch (type) {
      case "savings":
        return "bg-success-500/20"
      case "checking":
        return "bg-brand-500/20"
      case "investment":
        return "bg-purple-500/20"
      case "debt":
        return "bg-danger-500/20"
      default:
        return "bg-zinc-800"
    }
  }

  return (
    <div className={cn("w-full max-w-xl mx-auto", className)}>
      <div className="space-y-1">
        {accounts.map((account) => (
          <div
            key={account.id}
            className={cn(
              "group flex items-center justify-between",
              "p-2 rounded-md",
              "hover:bg-zinc-800 transition-all duration-300",
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-md", getAccountColor(account.type))}>
                {getAccountIcon(account.type)}
              </div>
              <div>
                <h3 className="text-xs font-medium text-white">{account.title}</h3>
                {account.description && <p className="text-[11px] text-gray-400">{account.description}</p>}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-medium text-white">{formatCurrency(account.balance)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setShowAddForm(true)} className="btn-primary">
          <Plus className="w-3 h-3 mr-1" />
          <span>Add</span>
        </button>
        <button type="button" className="btn-minimal flex-1">
          <span>View All</span>
          <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </div>
    </div>
  )
}

