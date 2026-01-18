"use client"

import { useState } from "react"

export function NotificationsTab() {
  const [notifications, setNotifications] = useState({
    email: true,
    leadUpdates: true,
    actionReminders: true,
    weeklyReport: false,
  })

  const toggleNotification = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="glass-panel p-8 space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>

      {[
        { key: "email", label: "Email Notifications", description: "Receive important updates via email" },
        { key: "leadUpdates", label: "Lead Updates", description: "Get notified when lead status changes" },
        { key: "actionReminders", label: "Action Reminders", description: "Reminders for recommended actions" },
        { key: "weeklyReport", label: "Weekly Report", description: "Receive weekly sales report" },
      ].map((item) => (
        <div
          key={item.key}
          className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors"
        >
          <div>
            <p className="font-medium text-foreground text-sm">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
          <button
            onClick={() => toggleNotification(item.key)}
            className={`w-10 h-6 rounded-full transition-all ${
              notifications[item.key as keyof typeof notifications] ? "bg-emerald-500" : "bg-white/10"
            }`}
          />
        </div>
      ))}
    </div>
  )
}
