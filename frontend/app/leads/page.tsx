"use client"

import { useState } from "react"
import { kanbanLeads, stages } from "@/lib/kanban-data"
import { KanbanColumn } from "@/components/kanban-column"
import { PriorityLeadsTable } from "@/components/priority-leads-table"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { AddLeadModal } from "@/components/add-lead-modal"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Plus } from "lucide-react"

export default function LeadsPage() {
  const [leads, setLeads] = useState(kanbanLeads)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)

  const moveCard = (cardId: string) => {
    const card = leads.find((l) => l.id === cardId)
    if (!card) return

    const currentStageIndex = stages.findIndex((s) => s.id === card.stage)
    if (currentStageIndex < stages.length - 1) {
      setLeads(leads.map((l) => (l.id === cardId ? { ...l, stage: stages[currentStageIndex + 1].id } : l)))
    }
  }

  const getLeadsByStage = (stageId: string) => leads.filter((l) => l.stage === stageId)

  return (
    <LayoutWrapper>
      <div className="space-y-8">
        {/* Header with View Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Sales Pipeline</h1>
            <p className="text-muted-foreground">Manage and track your leads through each stage</p>
          </div>

          {/* View Toggle & Add Lead Button */}
          <div className="flex gap-4 items-center">
            <Button
              onClick={() => setIsAddLeadOpen(true)}
              className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
            >
              <Plus size={18} className="mr-2" />
              Add Lead
            </Button>
            <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${
                  viewMode === "kanban" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid size={18} />
                Kanban
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${
                  viewMode === "list" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List size={18} />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Kanban View */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-4 gap-8">
            {stages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                title={stage.title}
                leads={getLeadsByStage(stage.id)}
                color={stage.color}
                onMoveCard={stage.id !== "closed" ? moveCard : undefined}
              />
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && <PriorityLeadsTable />}
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal isOpen={isAddLeadOpen} onOpenChange={setIsAddLeadOpen} />
    </LayoutWrapper>
  )
}
