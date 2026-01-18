"use client"

import { useState } from "react"

export function AIConfigTab() {
  const [engagement, setEngagement] = useState(60)
  const [recency, setRecency] = useState(75)
  const [autoArchive, setAutoArchive] = useState(false)

  return (
    <div className="space-y-8">
      {/* Scoring Configuration */}
      <div className="glass-panel p-8">
        <h3 className="text-lg font-semibold text-foreground mb-6">Lead Scoring Configuration</h3>

        {/* Engagement Weight */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">Engagement Weight</label>
            <span className="text-sm font-semibold text-indigo-400">{engagement}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={engagement}
            onChange={(e) => setEngagement(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-muted-foreground mt-2">How much engagement impacts lead scoring</p>
        </div>

        {/* Recency Weight */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">Recency Weight</label>
            <span className="text-sm font-semibold text-indigo-400">{recency}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={recency}
            onChange={(e) => setRecency(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-muted-foreground mt-2">How much recent activity impacts lead scoring</p>
        </div>
      </div>

      {/* Auto-Archive */}
      <div className="glass-panel p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground text-sm">Auto-Archive Cold Leads</p>
            <p className="text-xs text-muted-foreground mt-1">
              Automatically archive leads with no activity for 30 days
            </p>
          </div>
          <button
            onClick={() => setAutoArchive(!autoArchive)}
            className={`w-10 h-6 rounded-full transition-all ${autoArchive ? "bg-emerald-500" : "bg-white/10"}`}
          />
        </div>
      </div>

      {/* Save Button */}
      <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg transition-all font-medium">
        Save Configuration
      </button>
    </div>
  )
}
