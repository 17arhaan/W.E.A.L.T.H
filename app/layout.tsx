import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { FinanceProvider } from "@/context/finance-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "W.E.A.L.T.H | Finance Tracker",
  description: "Web-based Expense and Account Ledger for Tracking Habits"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <FinanceProvider>{children}</FinanceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}