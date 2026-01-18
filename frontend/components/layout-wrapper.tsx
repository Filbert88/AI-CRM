"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { TopHeader } from "./top-header"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopHeader />
      <main className="ml-64 mt-16 p-8">{children}</main>
    </div>
  )
}
