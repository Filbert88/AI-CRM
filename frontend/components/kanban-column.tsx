"use client"

import { KanbanCard } from "./kanban-card"

interface Lead {
  id: string
  name: string
  company: string
  score: number
  stage: string
}

interface KanbanColumnProps {
  title: string
  leads: Lead[]
  color: string
  onMoveCard?: (cardId: string) => void
}

export function KanbanColumn({ title, leads, color, onMoveCard }: KanbanColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className={`h-1 w-full rounded-full bg-gradient-to-r ${color}`}></div>
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        {title}
        <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-muted-foreground">{leads.length}</span>
      </h3>
      <div className="space-y-3 min-h-64">
        {leads.map((lead) => (
          <KanbanCard
            key={lead.id}
            name={lead.name}
            company={lead.company}
            score={lead.score}
            onMove={onMoveCard ? () => onMoveCard(lead.id) : undefined}
          />
        ))}
        {leads.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No leads</p>}
      </div>
    </div>
  )
}
