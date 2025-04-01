import type React from "react"
import { Chivo } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "@/components/wealth/layout"
import { DataProvider } from "@/components/wealth/data-provider"

// Load Chivo font with all necessary weights
const chivo = Chivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-chivo",
})

export const metadata = {
  title: "W.E.A.L.T.H Dashboard",
  description: "Web-based Expense and Account Ledger for Tracking Habits",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${chivo.variable}`} suppressHydrationWarning>
      <body className={chivo.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          <DataProvider>
            <Layout>{children}</Layout>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'