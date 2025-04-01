"use client"

import { useState } from "react"
import { useData } from "./data-provider"
import { Wallet, Plus, QrCode, ArrowUpRight, CreditCard } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import AddAccountForm from "./add-account-form"
import type { Account, AccountType } from "@/lib/types"

export default function AccountsPage() {
  const { accounts, isLoading, error } = useData()
  const [showAddForm, setShowAddForm] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-gray-900 dark:border-t-white border-gray-200 dark:border-gray-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading accounts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Unable to load accounts</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (showAddForm) {
    return (
      <div className="p-4 sm:p-6">
        <AddAccountForm onClose={() => setShowAddForm(false)} />
      </div>
    )
  }

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case "savings":
        return <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      case "checking":
        return <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case "investment":
        return <ArrowUpRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      case "investment":
        return <ArrowUpRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      case "debt":
        return <CreditCard className="w-5 h-5 text-red-600 dark:text-red-400" />
      default:
        return <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getAccountColor = (type: AccountType) => {
    switch (type) {
      case "savings":
        return "bg-emerald-100 dark:bg-emerald-900/30"
      case "checking":
        return "bg-blue-100 dark:bg-blue-900/30"
      case "investment":
        return "bg-purple-100 dark:bg-purple-900/30"
      case "debt":
        return "bg-red-100 dark:bg-red-900/30"
      default:
        return "bg-gray-100 dark:bg-zinc-700"
    }
  }

  // Calculate total balance
  const totalBalance = accounts.reduce((total, account) => {
    return account.type === "debt" ? total - account.balance : total + account.balance
  }, 0)

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Accounts</h1>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Account</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 mb-6">
        <h2 className="text-base font-medium text-gray-900 dark:text-white mb-2">Total Balance</h2>
        <p className="text-2xl font-medium text-gray-900 dark:text-white">{formatCurrency(totalBalance)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-zinc-800 rounded-lg p-8 text-center">
            <div className="bg-gray-100 dark:bg-zinc-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No accounts yet</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Add your first account to get started</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Account</span>
            </button>
          </div>
        ) : (
          accounts.map((account: Account) => (
            <div
              key={account.id}
              className="bg-white dark:bg-zinc-800 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-md ${getAccountColor(account.type)}`}>{getAccountIcon(account.type)}</div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">{account.title}</h3>
                  {account.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{account.description}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{account.type}</span>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatCurrency(account.balance)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

