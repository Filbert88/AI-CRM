"use client"

import { useLeads } from "@/hooks/use-api"
import { Flame, Eye, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const getPriorityStyles = (priority: string) => {
  const normalizedPriority = priority.toLowerCase()
  switch (normalizedPriority) {
    case "hot":
      return "bg-red-500/10 text-red-400"
    case "warm":
      return "bg-orange-500/10 text-orange-400"
    case "cold":
      return "bg-blue-500/10 text-blue-400"
    default:
      return "bg-gray-500/10 text-gray-400"
  }
}

const getInitials = (leadId: string) => {
  // Extract initials from lead_id like "LEAD-001" -> "L1"
  const parts = leadId.split("-")
  if (parts.length >= 2) {
    return parts[0][0] + parts[1].slice(-1)
  }
  return leadId.slice(0, 2).toUpperCase()
}

export function PriorityLeadsTable() {
  const { leads, loading, error } = useLeads()

  if (loading) {
    return (
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">High Priority Leads</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Lead</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Score</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Priority</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">AI Insight</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-6 w-8" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-48" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Skeleton className="h-6 w-6 rounded-lg ml-auto mr-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">High Priority Leads</h3>
        <div className="text-center py-12 text-red-400">
          {error}. Make sure the backend is running on port 8000.
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">High Priority Leads</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Lead</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Score</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Priority</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">AI Insight</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.lead_id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                      {getInitials(lead.lead_id)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{lead.lead_id}</p>
                      <p className="text-xs text-muted-foreground">{lead.industry} • {lead.channel}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{lead.score_details.score}</span>
                    {lead.score_details.score >= 70 && <Flame size={16} className="glow-red" />}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getPriorityStyles(lead.score_details.priority)}`}>
                    {lead.score_details.priority}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <p className="text-xs text-muted-foreground italic">
                    {lead.score_details.explanations.slice(0, 2).join(", ")}
                  </p>
                </td>
                <td className="py-4 px-4 text-center">
                  <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                    <Eye size={16} className="text-muted-foreground hover:text-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
