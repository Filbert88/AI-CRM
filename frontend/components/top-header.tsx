"use client"

import { Search, Bell, ChevronDown } from "lucide-react"

export function TopHeader() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-background/80 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-8 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search with CMD+K..."
            className="glass-input w-full pl-10 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Bell size={20} className="text-muted-foreground hover:text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown */}
        <button className="flex items-center gap-3 pl-3 pr-2 py-2 hover:bg-white/5 rounded-lg transition-colors group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">JD</span>
          </div>
          <ChevronDown size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>
    </header>
  )
}
