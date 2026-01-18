"use client"

import { GripVertical, ArrowRight } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface KanbanCardProps {
  id: string
  name: string
  company: string
  score: number
  onMove?: () => void
}

export function KanbanCard({ id, name, company, score, onMove }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="glass-panel p-4 group hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing touch-none"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="font-medium text-foreground text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{company}</p>
        </div>
        <GripVertical
          size={16}
          className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-400">Score: {score}</span>
        </div>
        {onMove && (
          <button
            onClick={(e) => {
              e.stopPropagation() // Prevent drag start when clicking button
              onMove()
            }}
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
            className="p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            <ArrowRight size={14} className="text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}
