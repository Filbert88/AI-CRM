"use client"

import { useState } from "react"
import { useDashboardSummary, useActions } from "@/hooks/use-api"
import { PipelineCard } from "@/components/pipeline-card"
import { ActionQueue } from "@/components/action-queue"
import { PriorityLeadsTable } from "@/components/priority-leads-table"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddLeadModal } from "@/components/add-lead-modal"

export default function DashboardPage() {
  const { summary, loading: summaryLoading, error: summaryError } = useDashboardSummary()
  const { actions, loading: actionsLoading, error: actionsError } = useActions()
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)

  // Transform summary to pipeline metrics format
  const pipelineMetrics = summary
    ? [
      {
        id: "hot",
        label: "Hot Leads",
        value: summary.hot_leads,
        trend: "",
        glowClass: "glow-red",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      },
      {
        id: "warm",
        label: "Warm Leads",
        value: summary.warm_leads,
        trend: "",
        glowClass: "glow-orange",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
      },
      {
        id: "cold",
        label: "Cold Leads",
        value: summary.cold_leads,
        trend: "",
        glowClass: "glow-blue",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
    ]
    : []

  // Transform actions to expected format
  const formattedActions = actions.map((action, index) => ({
    id: index + 1,
    title: action.action_text.split(" - ")[0] || action.action_text,
    description: action.action_text.split(" - ")[1] || action.lead_id,
    priority: action.is_done ? "low" : "high",
  }))

  return (
    <LayoutWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sales Dashboard</h1>
          <p className="text-muted-foreground">Your AI-powered sales intelligence at a glance</p>
        </div>

        {/* Pipeline Summary */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Pipeline Summary</h2>
          {summaryLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : summaryError ? (
            <div className="text-center py-8 text-red-400">
              {summaryError}. Make sure the backend is running on port 8000.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {pipelineMetrics.map((metric) => (
                <PipelineCard key={metric.id} {...metric} />
              ))}
            </div>
          )}
        </div>

        {/* Action Queue */}
        {actionsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : actionsError ? (
          <div className="glass-panel p-6 text-center text-red-400">{actionsError}</div>
        ) : (
          <ActionQueue actions={formattedActions} />
        )}

        {/* Priority Leads */}
        <PriorityLeadsTable />
      </div>
      <Button
        onClick={() => setIsAddLeadOpen(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full p-0 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 shadow-lg"
      >
        <Plus size={24} />
      </Button>

      {/* Add Lead Modal */}
      <AddLeadModal isOpen={isAddLeadOpen} onOpenChange={setIsAddLeadOpen} />
    </LayoutWrapper>
  )
}
