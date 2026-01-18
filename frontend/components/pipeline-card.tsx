import { TrendingUp, TrendingDown, Flame } from "lucide-react"

interface PipelineCardProps {
  label: string
  value: number
  trend: string
  color: string
  bgColor: string
  glowClass: string
}

export function PipelineCard({ label, value, trend, color, bgColor, glowClass }: PipelineCardProps) {
  const isPositive = trend.startsWith("+")

  return (
    <div className="glass-panel p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
        {label === "Hot Leads" && <Flame size={18} className={glowClass} />}
      </div>

      <div className="flex items-baseline gap-3">
        <span className={`text-4xl font-bold ${color}`}>{value}</span>
        <span className={`text-xs font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? <TrendingUp size={14} className="inline" /> : <TrendingDown size={14} className="inline" />}{" "}
          {trend}
        </span>
      </div>

      {/* Mock sparkline */}
      <svg className="w-full h-12 mt-2" viewBox="0 0 100 40" preserveAspectRatio="none">
        <polyline
          points="0,30 10,25 20,28 30,20 40,15 50,22 60,18 70,25 80,20 90,15 100,10"
          fill="none"
          stroke={color.replace("text-", "")}
          strokeWidth="2"
          className="opacity-50"
        />
      </svg>
    </div>
  )
}
