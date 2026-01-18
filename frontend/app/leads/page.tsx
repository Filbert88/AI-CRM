"use client"

import { useState, useEffect } from "react"
import { KanbanColumn } from "@/components/kanban-column"
import { PriorityLeadsTable } from "@/components/priority-leads-table"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { AddLeadModal } from "@/components/add-lead-modal"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Plus, Loader2, RefreshCw } from "lucide-react"
import { getPipelineLeads, updateLeadStage, type PipelineLead, type Stage } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { KanbanCard } from "@/components/kanban-card"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"

const stages: { id: Stage; title: string; color: string }[] = [
  { id: "new", title: "New", color: "from-blue-500 to-blue-600" },
  { id: "meeting", title: "Arranged Meeting", color: "from-purple-500 to-purple-600" },
  { id: "negotiation", title: "Negotiation", color: "from-orange-500 to-orange-600" },
  { id: "closed", title: "Closed", color: "from-emerald-500 to-emerald-600" },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState<PipelineLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)
  const { toast } = useToast()

  // DnD State
  const [activeId, setActiveId] = useState<string | null>(null)
  const [originalStage, setOriginalStage] = useState<Stage | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPipelineLeads()
      setLeads(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const getLeadsByStage = (stageId: Stage) => leads.filter((l) => l.stage === stageId)

  const handleLeadAdded = () => {
    fetchLeads()
  }

  // DnD Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeLead = leads.find((l) => l.id === active.id)
    if (activeLead) {
      setActiveId(active.id as string)
      setOriginalStage(activeLead.stage)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the active lead
    const activeLead = leads.find((l) => l.id === activeId)
    if (!activeLead) return

    // Find new stage
    let newStage: Stage | null = null

    // If over is a column
    if (stages.some((s) => s.id === overId)) {
      newStage = overId as Stage
    }
    // If over is another card
    else {
      const overLead = leads.find((l) => l.id === overId)
      if (overLead) {
        newStage = overLead.stage
      }
    }

    // If stage changed, update state immediately (optimistic UI)
    if (newStage && newStage !== activeLead.stage) {
      setLeads((prev) =>
        prev.map((l) => (l.id === activeId ? { ...l, stage: newStage! } : l))
      )
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active } = event
    const activeId = active.id as string
    const activeLead = leads.find((l) => l.id === activeId)

    setActiveId(null)

    if (!activeLead || !originalStage) return

    // Verify if stage actually changed
    if (activeLead.stage !== originalStage) {
      try {
        await updateLeadStage(activeId, activeLead.stage)
        toast({
          title: "Stage Updated",
          description: `Moved ${activeLead.name} to ${stages.find((s) => s.id === activeLead.stage)?.title}`,
        })
      } catch (err) {
        // Rollback
        setLeads((prev) =>
          prev.map((l) => (l.id === activeId ? { ...l, stage: originalStage } : l))
        )
        toast({
          title: "Error",
          description: "Failed to update stage. Please try again.",
          variant: "destructive",
        })
      }
    }

    setOriginalStage(null)
  }

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null

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
              onClick={fetchLeads}
              variant="outline"
              size="icon"
              className="border-white/10 hover:bg-white/5"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </Button>
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
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${viewMode === "kanban" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <LayoutGrid size={18} />
                Kanban
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${viewMode === "list" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <List size={18} />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading pipeline...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="glass-panel p-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchLeads} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Kanban View */}
        {!loading && !error && viewMode === "kanban" && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-4 gap-8">
              {stages.map((stage) => (
                <KanbanColumn
                  key={stage.id}
                  id={stage.id}
                  title={stage.title}
                  leads={getLeadsByStage(stage.id)}
                  color={stage.color}
                // We don't need manual onMoveCard anymore since we have DnD
                // But we can keep it if we want hybrid, though DnD is better.
                />
              ))}
            </div>

            <DragOverlay>
              {activeLead ? (
                <div className="opacity-80 rotate-2">
                  <KanbanCard
                    id={`${activeLead.id}-overlay`}
                    name={activeLead.name}
                    company={activeLead.company}
                    score={activeLead.score}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {/* List View */}
        {!loading && !error && viewMode === "list" && <PriorityLeadsTable />}
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal isOpen={isAddLeadOpen} onOpenChange={setIsAddLeadOpen} onLeadAdded={handleLeadAdded} />
    </LayoutWrapper>
  )
}
