"use client"

import type React from "react"
import { BarChart2, Receipt, CreditCard, Wallet, Menu, Home, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string
    icon: any
    children: React.ReactNode
  }) {
    const isActive = pathname === href

    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-300 ${
          isActive ? "bg-zinc-900 text-white font-medium" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
        }`}
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-black shadow-sm"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-400" />
      </button>
      <nav
        className={`
          fixed inset-y-0 left-0 z-[70] w-56 bg-black transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:w-56 border-r border-zinc-900
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          <Link href="/dashboard" className="h-14 px-4 flex items-center border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 bg-white rounded-md">
                <span className="text-black font-bold text-xs">W</span>
              </div>
              <span className="text-base font-medium text-white">W.E.A.L.T.H</span>
            </div>
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              <NavItem href="/dashboard" icon={Home}>
                Dashboard
              </NavItem>
              <NavItem href="/analytics" icon={BarChart2}>
                Analytics
              </NavItem>
              <NavItem href="/transactions" icon={Wallet}>
                Transactions
              </NavItem>
              <NavItem href="/accounts" icon={CreditCard}>
                Accounts
              </NavItem>
              <NavItem href="/goals" icon={Receipt}>
                Goals
              </NavItem>
              <NavItem href="/budget-optimizer" icon={TrendingUp}>
                Budget Optimizer
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

