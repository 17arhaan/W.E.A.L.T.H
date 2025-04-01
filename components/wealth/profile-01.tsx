import type React from "react"
import { LogOut, MoveUpRight, Settings, CreditCard, FileText } from "lucide-react"
import Link from "next/link"

interface MenuItem {
  label: string
  value?: string
  href: string
  icon?: React.ReactNode
  external?: boolean
}

interface Profile01Props {
  name?: string
  role?: string
  subscription?: string
}

export default function Profile01({
  name = "User",
  role = "Account Owner",
  subscription = "Free Plan",
}: Profile01Props) {
  const menuItems: MenuItem[] = [
    {
      label: "Subscription",
      value: subscription,
      href: "/settings/subscription",
      icon: <CreditCard className="w-4 h-4" />,
      external: false,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      label: "Terms & Policies",
      href: "/terms",
      icon: <FileText className="w-4 h-4" />,
      external: true,
    },
  ]

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative px-4 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600 dark:text-gray-300">{name.charAt(0)}</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-zinc-800" />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-base font-medium text-gray-900 dark:text-white">{name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
            </div>
          </div>
          <div className="h-px bg-gray-100 dark:bg-zinc-800 my-3" />
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-2 
                                    hover:bg-gray-50 dark:hover:bg-zinc-800/50 
                                    rounded-md transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</span>
                </div>
                <div className="flex items-center">
                  {item.value && <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{item.value}</span>}
                  {item.external && <MoveUpRight className="w-4 h-4" />}
                </div>
              </Link>
            ))}

            <button
              type="button"
              className="w-full flex items-center justify-between p-2 
                                hover:bg-gray-50 dark:hover:bg-zinc-800/50 
                                rounded-md transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

