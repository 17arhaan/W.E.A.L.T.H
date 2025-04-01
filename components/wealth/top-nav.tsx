"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Profile01 from "./profile-01"
import { usePathname } from "next/navigation"

export default function TopNav() {
  const pathname = usePathname()

  // Get the page title based on the current path
  const getPageTitle = () => {
    const path = pathname.split("/")[1]
    if (!path) return "Dashboard"

    return path.charAt(0).toUpperCase() + path.slice(1)
  }

  return (
    <nav className="px-6 flex items-center justify-between bg-black h-full">
      <div className="text-base font-medium text-white">{getPageTitle()}</div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
              <span className="text-xs font-medium text-white">U</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[280px] sm:w-80 bg-zinc-950 border-zinc-900 rounded-lg shadow-md"
          >
            <Profile01 />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

