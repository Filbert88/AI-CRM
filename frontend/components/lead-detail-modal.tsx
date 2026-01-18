"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Flame, CheckCircle2, Clock, Building2, Users, Monitor, MessageSquare } from "lucide-react"
import type { LeadResponse } from "@/lib/api"

interface LeadDetailModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    lead: LeadResponse | null
}

export function LeadDetailModal({ isOpen, onOpenChange, lead }: LeadDetailModalProps) {
    if (!lead) return null

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case "hot": return "bg-red-500/20 text-red-400 border-red-500/30"
            case "warm": return "bg-orange-500/20 text-orange-400 border-orange-500/30"
            default: return "bg-blue-500/20 text-blue-400 border-blue-500/30"
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="glass-panel border-white/10 sm:max-w-[600px] text-foreground">
                <DialogHeader>
                    <div className="flex items-center justify-between mr-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                                {lead.lead_id.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <DialogTitle className="text-xl">{lead.lead_id}</DialogTitle>
                                <DialogDescription className="text-muted-foreground flex items-center gap-2 mt-1">
                                    <Building2 size={14} /> {lead.industry} • {lead.company_size} Employees
                                </DialogDescription>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold flex items-center justify-end gap-2">
                                {lead.score_details.score}
                                <Flame className={lead.score_details.score >= 70 ? "text-red-500 fill-red-500" : "text-muted-foreground"} />
                            </div>
                            <Badge variant="outline" className={getPriorityColor(lead.score_details.priority)}>
                                {lead.score_details.priority} Priority
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="bg-white/10 my-4" />

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Lead Details</h4>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Monitor size={16} className="text-indigo-400" />
                                <span>Channel: <span className="text-foreground">{lead.channel}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MessageSquare size={16} className="text-indigo-400" />
                                <span>Interactions: <span className="text-foreground">{lead.interaction_count}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock size={16} className="text-indigo-400" />
                                <span>Last Contact: <span className="text-foreground">{lead.last_interaction_days_ago} days ago</span></span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            {lead.has_requested_pricing && (
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
                                    <CheckCircle2 size={12} className="mr-1" /> Pricing Requested
                                </Badge>
                            )}
                            {lead.has_demo_request && (
                                <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20">
                                    <CheckCircle2 size={12} className="mr-1" /> Demo Requested
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Scoring Insights</h4>
                        <div className="bg-white/5 rounded-lg p-3 space-y-2">
                            {lead.score_details.explanations.map((explanation, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{explanation}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Separator className="bg-white/10 my-4" />

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Current Stage: <span className="uppercase font-semibold text-foreground">{lead.stage}</span></span>
                </div>
            </DialogContent>
        </Dialog>
    )
}
