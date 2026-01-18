"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { useDashboardSummary, useLeads } from "@/hooks/use-api"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Loader2 } from "lucide-react"

export default function AnalyticsPage() {
  const { summary, loading: summaryLoading, error: summaryError } = useDashboardSummary()
  const { leads, loading: leadsLoading, error: leadsError } = useLeads()

  const loading = summaryLoading || leadsLoading
  const error = summaryError || leadsError

  // Priority distribution data for pie chart
  const priorityData = summary ? [
    { name: "Hot", value: summary.hot_leads, color: "#ef4444" },
    { name: "Warm", value: summary.warm_leads, color: "#f97316" },
    { name: "Cold", value: summary.cold_leads, color: "#3b82f6" },
  ] : []

  // Industry distribution from leads
  const industryMap = leads.reduce((acc, lead) => {
    acc[lead.industry] = (acc[lead.industry] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const industryData = Object.entries(industryMap)
    .map(([name, count]) => ({ name, leads: count }))
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 8) // Top 8 industries

  // Channel distribution
  const channelMap = leads.reduce((acc, lead) => {
    acc[lead.channel] = (acc[lead.channel] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const channelData = Object.entries(channelMap)
    .map(([name, count]) => ({ name, leads: count }))
    .sort((a, b) => b.leads - a.leads)

  // Calculate metrics
  const totalLeads = summary?.total_leads || 0
  const avgScore = leads.length > 0
    ? Math.round(leads.reduce((sum, l) => sum + l.score_details.score, 0) / leads.length)
    : 0
  const hotLeadRate = totalLeads > 0
    ? ((summary?.hot_leads || 0) / totalLeads * 100).toFixed(1)
    : "0"
  const closedLeads = leads.filter(l => l.stage === "closed").length
  const conversionRate = totalLeads > 0
    ? ((closedLeads / totalLeads) * 100).toFixed(1)
    : "0"

  return (
    <LayoutWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your sales performance with real-time metrics</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading analytics...</span>
          </div>
        ) : error ? (
          <div className="glass-panel p-8 text-center">
            <p className="text-red-400">{error}. Make sure the backend is running on port 8000.</p>
          </div>
        ) : (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-4 gap-6">
              <div className="glass-panel p-6">
                <p className="text-muted-foreground text-sm mb-2">Total Leads</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-foreground">{totalLeads}</span>
                </div>
              </div>
              <div className="glass-panel p-6">
                <p className="text-muted-foreground text-sm mb-2">Average Score</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-foreground">{avgScore}</span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div className="glass-panel p-6">
                <p className="text-muted-foreground text-sm mb-2">Hot Lead Rate</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-red-400">{hotLeadRate}%</span>
                </div>
              </div>
              <div className="glass-panel p-6">
                <p className="text-muted-foreground text-sm mb-2">Conversion Rate</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-emerald-400">{conversionRate}%</span>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* Priority Distribution */}
              <div className="glass-panel p-8">
                <h3 className="text-lg font-semibold text-foreground mb-6">Lead Priority Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Leads by Industry */}
              <div className="glass-panel p-8">
                <h3 className="text-lg font-semibold text-foreground mb-6">Leads by Industry</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={industryData} layout="vertical">
                    <CartesianGrid stroke="rgba(255,255,255,0.1)" horizontal={false} />
                    <XAxis type="number" stroke="rgba(255,255,255,0.3)" />
                    <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.3)" width={100} />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="leads" fill="#6366f1" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Leads by Channel */}
              <div className="glass-panel p-8 col-span-2">
                <h3 className="text-lg font-semibold text-foreground mb-6">Leads by Acquisition Channel</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={channelData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                    <YAxis stroke="rgba(255,255,255,0.3)" />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="leads" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </LayoutWrapper>
  )
}
