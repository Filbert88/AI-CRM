"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const chartData = [
  { month: "Jan", leads: 120, closed: 24 },
  { month: "Feb", leads: 200, closed: 39 },
  { month: "Mar", leads: 290, closed: 58 },
  { month: "Apr", leads: 340, closed: 75 },
  { month: "May", leads: 420, closed: 92 },
  { month: "Jun", leads: 510, closed: 118 },
]

export default function AnalyticsPage() {
  return (
    <LayoutWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your sales performance and metrics</p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Lead Trends */}
          <div className="glass-panel p-8 col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-6">Lead Generation Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.3)" />
                <YAxis stroke="rgba(255,255,255,0.3)" />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Line type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Closed Deals */}
          <div className="glass-panel p-8 col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-6">Deals Closed</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.3)" />
                <YAxis stroke="rgba(255,255,255,0.3)" />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Bar dataKey="closed" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Total Leads", value: "2,140", trend: "+22%" },
            { label: "Conversion Rate", value: "18.2%", trend: "+5%" },
            { label: "Avg Deal Value", value: "$24,500", trend: "+15%" },
          ].map((metric) => (
            <div key={metric.label} className="glass-panel p-6">
              <p className="text-muted-foreground text-sm mb-2">{metric.label}</p>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                <span className="text-xs font-semibold text-emerald-400">{metric.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutWrapper>
  )
}
