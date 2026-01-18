"use client"

import React from "react"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddLeadModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onLeadAdded?: () => void
}

export function AddLeadModal({ isOpen, onOpenChange, onLeadAdded }: AddLeadModalProps) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        leadName: "",
        industry: "",
        companySize: "",
        channel: "",
        interactionCount: "0",
        lastInteraction: "0",
        requestedPricing: false,
        requestedDemo: false,
    })

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const validateForm = () => {
        if (!formData.leadName.trim()) {
            toast({ title: "Validation Error", description: "Lead name is required", variant: "destructive" })
            return false
        }
        if (!formData.industry) {
            toast({ title: "Validation Error", description: "Industry is required", variant: "destructive" })
            return false
        }
        if (!formData.companySize) {
            toast({ title: "Validation Error", description: "Company size is required", variant: "destructive" })
            return false
        }
        if (!formData.channel) {
            toast({ title: "Validation Error", description: "Channel is required", variant: "destructive" })
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            const payload = {
                lead_id: formData.leadName,
                industry: formData.industry,
                company_size: parseInt(formData.companySize),
                channel: formData.channel,
                interaction_count: parseInt(formData.interactionCount),
                last_interaction_days_ago: parseInt(formData.lastInteraction),
                has_requested_pricing: formData.requestedPricing,
                has_demo_request: formData.requestedDemo,
            }

            const response = await fetch("http://localhost:8000/api/v1/leads/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error("Failed to create lead")
            }

            toast({
                title: "Success",
                description: "Lead scored & added successfully!",
            })

            // Reset form
            setFormData({
                leadName: "",
                industry: "",
                companySize: "",
                channel: "",
                interactionCount: "0",
                lastInteraction: "0",
                requestedPricing: false,
                requestedDemo: false,
            })

            onOpenChange(false)
            onLeadAdded?.()
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add lead",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md border-white/10 bg-zinc-900 flex flex-col h-full p-0">
                <SheetHeader className="px-6 pt-6 pb-4">
                    <SheetTitle className="text-foreground">Add New Lead</SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                        Fill in the lead details to score and add them to your pipeline
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>

                        <div className="space-y-2">
                            <Label htmlFor="leadName" className="text-sm text-foreground">
                                Lead Name *
                            </Label>
                            <Input
                                id="leadName"
                                placeholder="Enter lead name"
                                value={formData.leadName}
                                onChange={(e) => handleInputChange("leadName", e.target.value)}
                                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="industry" className="text-sm text-foreground">
                                Industry *
                            </Label>
                            <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                                    <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-white/10 max-h-[200px]">
                                    <SelectItem value="Technology" className="text-foreground">Technology</SelectItem>
                                    <SelectItem value="Finance" className="text-foreground">Finance</SelectItem>
                                    <SelectItem value="Healthcare" className="text-foreground">Healthcare</SelectItem>
                                    <SelectItem value="Retail" className="text-foreground">Retail</SelectItem>
                                    <SelectItem value="E-commerce" className="text-foreground">E-commerce</SelectItem>
                                    <SelectItem value="Manufacturing" className="text-foreground">Manufacturing</SelectItem>
                                    <SelectItem value="Education" className="text-foreground">Education</SelectItem>
                                    <SelectItem value="Consulting" className="text-foreground">Consulting</SelectItem>
                                    <SelectItem value="Real Estate" className="text-foreground">Real Estate</SelectItem>
                                    <SelectItem value="Logistics" className="text-foreground">Logistics</SelectItem>
                                    <SelectItem value="Media" className="text-foreground">Media</SelectItem>
                                    <SelectItem value="Insurance" className="text-foreground">Insurance</SelectItem>
                                    <SelectItem value="Agriculture" className="text-foreground">Agriculture</SelectItem>
                                    <SelectItem value="Construction" className="text-foreground">Construction</SelectItem>
                                    <SelectItem value="Hospitality" className="text-foreground">Hospitality</SelectItem>
                                    <SelectItem value="Legal" className="text-foreground">Legal</SelectItem>
                                    <SelectItem value="Non-profit" className="text-foreground">Non-profit</SelectItem>
                                    <SelectItem value="Transportation" className="text-foreground">Transportation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companySize" className="text-sm text-foreground">
                                Company Size *
                            </Label>
                            <Input
                                id="companySize"
                                type="number"
                                placeholder="e.g., 50"
                                value={formData.companySize}
                                onChange={(e) => handleInputChange("companySize", e.target.value)}
                                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="channel" className="text-sm text-foreground">
                                Channel *
                            </Label>
                            <Select value={formData.channel} onValueChange={(value) => handleInputChange("channel", value)}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                                    <SelectValue placeholder="Select channel" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-white/10">
                                    <SelectItem value="Website" className="text-foreground">Website</SelectItem>
                                    <SelectItem value="LinkedIn" className="text-foreground">LinkedIn</SelectItem>
                                    <SelectItem value="Referral" className="text-foreground">Referral</SelectItem>
                                    <SelectItem value="WhatsApp" className="text-foreground">WhatsApp</SelectItem>
                                    <SelectItem value="Trade Show" className="text-foreground">Trade Show</SelectItem>
                                    <SelectItem value="Email Campaign" className="text-foreground">Email Campaign</SelectItem>
                                    <SelectItem value="Social Media" className="text-foreground">Social Media</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Engagement Metrics Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Engagement Metrics</h3>

                        <div className="space-y-2">
                            <Label htmlFor="interactionCount" className="text-sm text-foreground">
                                Interaction Count
                            </Label>
                            <Input
                                id="interactionCount"
                                type="number"
                                placeholder="0"
                                value={formData.interactionCount}
                                onChange={(e) => handleInputChange("interactionCount", e.target.value)}
                                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastInteraction" className="text-sm text-foreground">
                                Last Interaction (Days Ago)
                            </Label>
                            <Input
                                id="lastInteraction"
                                type="number"
                                placeholder="0"
                                value={formData.lastInteraction}
                                onChange={(e) => handleInputChange("lastInteraction", e.target.value)}
                                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    {/* Intent Signals Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Intent Signals</h3>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <Label htmlFor="pricing" className="text-sm text-foreground cursor-pointer">
                                Requested Pricing?
                            </Label>
                            <Switch
                                id="pricing"
                                checked={formData.requestedPricing}
                                onCheckedChange={(checked) => handleInputChange("requestedPricing", checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <Label htmlFor="demo" className="text-sm text-foreground cursor-pointer">
                                Requested Demo?
                            </Label>
                            <Switch
                                id="demo"
                                checked={formData.requestedDemo}
                                onCheckedChange={(checked) => handleInputChange("requestedDemo", checked)}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 border-white/10 text-foreground hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Add Lead"
                            )}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
