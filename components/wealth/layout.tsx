"use client"

import type { ReactNode } from "react"
import Sidebar from "./sidebar"
import TopNav from "./top-nav"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Content from "./content"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="w-full flex flex-1 flex-col">
        <header className="h-14 border-b border-zinc-900">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-black">{pathname === "/dashboard" ? <Content /> : children}</main>
      </div>
    </div>
  )
}

