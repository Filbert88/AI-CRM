"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, TrendingUp, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/leads", label: "Leads", icon: Users },
    { href: "/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-background border-r border-white/5 flex flex-col p-6 z-50">
      {/* Logo */}
      <Link href="/dashboard" className="mb-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            AI CRM
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? "active-nav bg-white/5 text-indigo-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all w-full"
      >
        <LogOut size={20} />
        <span className="text-sm font-medium">Sign Out</span>
      </button>
    </aside>
  )
}
