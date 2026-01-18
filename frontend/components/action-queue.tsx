"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface Action {
  id: number
  title: string
  description: string
  priority: string
}

interface ActionQueueProps {
  actions: Action[]
}

export function ActionQueue({ actions: initialActions }: ActionQueueProps) {
  const [actions, setActions] = useState(initialActions)

  const markDone = (id: number) => {
    setActions(actions.filter((a) => a.id !== id))
  }

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Recommended Actions</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        <AnimatePresence>
          {actions.map((action) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="glass-panel p-4 min-w-72 flex flex-col justify-between group hover:bg-white/10 transition-colors"
            >
              <div>
                <p className="font-medium text-foreground text-sm mb-1">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <button
                onClick={() => markDone(action.id)}
                className="mt-4 self-start p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <CheckCircle2 size={20} className="text-emerald-400 hover:text-emerald-300" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
