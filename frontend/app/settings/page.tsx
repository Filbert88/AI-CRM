"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { SettingsTabs } from "@/components/settings-tabs"

export default function SettingsPage() {
  return (
    <LayoutWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Settings Tabs */}
        <SettingsTabs />
      </div>
    </LayoutWrapper>
  )
}
