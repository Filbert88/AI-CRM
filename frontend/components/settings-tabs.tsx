"use client"

import { useState } from "react"
import { User, Bell, Zap } from "lucide-react"
import { AccountTab } from "./settings/account-tab"
import { NotificationsTab } from "./settings/notifications-tab"
import { AIConfigTab } from "./settings/ai-config-tab"

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("account")

  const tabs = [
    { id: "account", label: "My Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "ai", label: "AI Configuration", icon: Zap },
  ]

  return (
    <div className="grid grid-cols-5 gap-8">
      {/* Sidebar Tabs */}
      <div className="col-span-1">
        <nav className="space-y-2 sticky top-24">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-white/10 text-indigo-400 border-l-2 border-indigo-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="col-span-4">
        {activeTab === "account" && <AccountTab />}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "ai" && <AIConfigTab />}
      </div>
    </div>
  )
}
