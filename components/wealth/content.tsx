"use client"

import { useState } from "react"
import { useData } from "./data-provider"
import { formatCurrency } from "@/lib/utils"
import { Plus, ArrowRight, ArrowUpRight, ArrowDownLeft, CreditCard, Wallet, TrendingUp } from "lucide-react"
import { AddAccountForm, AddTransactionForm, ImportDataForm } from "./forms"

export default function Content() {
  const { totalBalance, accounts, recentTransactions, isLoading, error } = useData()

  const [showAddAccountForm, setShowAddAccountForm] = useState(false)
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false)
  const [showImportDataForm, setShowImportDataForm] = useState(false)

  if (showAddAccountForm) {
    return <AddAccountForm onClose={() => setShowAddAccountForm(false)} />
  }

  if (showAddTransactionForm) {
    return <AddTransactionForm onClose={() => setShowAddTransactionForm(false)} />
  }

  if (showImportDataForm) {
    return <ImportDataForm onClose={() => setShowImportDataForm(false)} />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-white border-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-sm text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="bg-red-900/20 text-red-400 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-medium text-white mb-2">Unable to load data</h2>
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Check if we have any data at all
  const hasNoData = accounts.length === 0 && recentTransactions.length === 0 && totalBalance === 0

  if (hasNoData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="bg-zinc-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-medium text-white mb-2">Welcome to W.E.A.L.T.H</h2>
          <p className="text-sm text-gray-400 mb-6">
            Get started by adding your accounts, transactions, and financial goals to track your financial health.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setShowAddAccountForm(true)} className="btn-primary">
              Add Account
            </button>
            <button onClick={() => setShowImportDataForm(true)} className="btn-minimal">
              Import Data
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "savings":
        return <Wallet className="w-5 h-5 text-emerald-500" />
      case "checking":
        return <CreditCard className="w-5 h-5 text-blue-500" />
      case "investment":
        return <TrendingUp className="w-5 h-5 text-purple-500" />
      case "debt":
        return <CreditCard className="w-5 h-5 text-red-500" />
      default:
        return <Wallet className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Accounts Section */}
      <div className="bg-zinc-950 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-zinc-900">
          <h2 className="text-base font-medium text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Accounts
          </h2>
        </div>

        <div className="p-4 border-b border-zinc-900">
          <div className="text-sm text-gray-400">Total Balance</div>
          <div className="text-3xl font-bold text-white mt-1">{formatCurrency(totalBalance)}</div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          <div className="text-sm font-medium text-gray-400 px-4 pt-4 pb-2">Your Accounts</div>
          {accounts.map((account) => (
            <div key={account.id} className="account-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-zinc-900 flex items-center justify-center">
                  {getAccountIcon(account.type)}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{account.title}</div>
                  <div className="text-xs text-gray-400">{account.description}</div>
                </div>
              </div>
              <div className="text-right text-white font-medium">{formatCurrency(account.balance)}</div>
            </div>
          ))}
        </div>

        <div className="p-3 grid grid-cols-4 gap-2">
          <button
            onClick={() => setShowAddAccountForm(true)}
            className="flex items-center justify-center gap-1 bg-white text-black rounded-md py-2 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          <button className="flex items-center justify-center gap-1 bg-zinc-900 text-white rounded-md py-2 font-medium text-sm">
            Send
          </button>
          <button className="flex items-center justify-center gap-1 bg-zinc-900 text-white rounded-md py-2 font-medium text-sm">
            Top-up
          </button>
          <button className="flex items-center justify-center gap-1 bg-zinc-900 text-white rounded-md py-2 font-medium text-sm">
            More
          </button>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-zinc-950 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-zinc-900">
          <h2 className="text-base font-medium text-white flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Recent Transactions
          </h2>
        </div>

        <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
          <div className="text-sm font-medium text-white">Recent Activity</div>
          <div className="text-xs text-gray-400">This Month</div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {recentTransactions.map((transaction) => {
            const date = new Date(transaction.timestamp)
            const isToday = new Date().toDateString() === date.toDateString()
            const isYesterday = new Date(Date.now() - 86400000).toDateString() === date.toDateString()

            const dateDisplay = isToday
              ? "Today"
              : isYesterday
                ? "Yesterday"
                : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

            const timeDisplay = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

            return (
              <div key={transaction.id} className="transaction-item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-zinc-900 flex items-center justify-center">
                    {transaction.type === "incoming" ? (
                      <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{transaction.title}</div>
                    <div className="text-xs text-gray-400">
                      {dateDisplay}, {timeDisplay}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-right font-medium ${transaction.type === "incoming" ? "transaction-positive" : "transaction-negative"}`}
                >
                  {transaction.type === "incoming" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-3">
          <button className="w-full flex items-center justify-center gap-1 bg-zinc-900 text-white rounded-md py-2 font-medium text-sm">
            View All Transactions
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  )
}

