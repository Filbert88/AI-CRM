"use client"

import { KanbanCard } from "./kanban-card"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

interface Lead {
  id: string
  name: string
  company: string
  score: number
  stage: string
}

interface KanbanColumnProps {
  id: string
  title: string
  leads: Lead[]
  color: string
  onMoveCard?: (cardId: string) => void
}

export function KanbanColumn({ id, title, leads, color, onMoveCard }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: id,
  })

  return (
    <div className="flex flex-col gap-4">
      <div className={`h-1 w-full rounded-full bg-gradient-to-r ${color}`}></div>
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        {title}
        <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-muted-foreground">{leads.length}</span>
      </h3>
      <SortableContext id={id} items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="space-y-3 min-h-64 rounded-lg p-2 transition-colors hover:bg-white/5">
          {leads.map((lead) => (
            <KanbanCard
              key={lead.id}
              id={lead.id}
              name={lead.name}
              company={lead.company}
              score={lead.score}
              onMove={onMoveCard ? () => onMoveCard(lead.id) : undefined}
            />
          ))}
          {leads.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center py-8">Drop here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
