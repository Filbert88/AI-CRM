"use client"

import { GripVertical, ArrowRight } from "lucide-react"

interface KanbanCardProps {
  name: string
  company: string
  score: number
  onMove?: () => void
}

export function KanbanCard({ name, company, score, onMove }: KanbanCardProps) {
  return (
    <div className="glass-panel p-4 group hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="font-medium text-foreground text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{company}</p>
        </div>
        <GripVertical
          size={16}
          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-400">Score: {score}</span>
        </div>
        {onMove && (
          <button
            onClick={onMove}
            className="p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <ArrowRight size={14} className="text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}
