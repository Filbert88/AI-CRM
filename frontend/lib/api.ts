/**
 * API Service for communicating with the FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Types matching backend schemas
export type Stage = "new" | "meeting" | "negotiation" | "closed";

export interface ScoringResult {
    score: number;
    priority: "Hot" | "Warm" | "Cold";
    explanations: string[];
}

export interface LeadInput {
    lead_id: string;
    industry: string;
    company_size: number;
    channel: string;
    interaction_count: number;
    last_interaction_days_ago: number;
    has_requested_pricing: boolean;
    has_demo_request: boolean;
    stage?: Stage;
}

export interface LeadResponse extends LeadInput {
    stage: Stage;
    score_details: ScoringResult;
}

// Pipeline lead format for Kanban board
export interface PipelineLead {
    id: string;
    name: string;
    company: string;
    score: number;
    stage: Stage;
}

export interface DashboardSummary {
    total_leads: number;
    hot_leads: number;
    warm_leads: number;
    cold_leads: number;
}

export interface ActionItem {
    id: string;
    action_text: string;
    is_done: boolean;
    lead_id: string;
}

// API Functions

/**
 * Get all leads sorted by score
 */
export async function getLeads(): Promise<LeadResponse[]> {
    const response = await fetch(`${API_BASE_URL}/dashboard/leads`);
    if (!response.ok) {
        throw new Error("Failed to fetch leads");
    }
    return response.json();
}

/**
 * Get leads formatted for the pipeline Kanban board
 */
export async function getPipelineLeads(): Promise<PipelineLead[]> {
    const leads = await getLeads();
    return leads.map(lead => ({
        id: lead.lead_id,
        name: lead.lead_id,
        company: lead.industry,
        score: lead.score_details.score,
        stage: lead.stage || "new",
    }));
}

/**
 * Update a lead's pipeline stage
 */
export async function updateLeadStage(leadId: string, stage: Stage): Promise<LeadResponse> {
    const response = await fetch(`${API_BASE_URL}/leads/${encodeURIComponent(leadId)}/stage`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ stage }),
    });
    if (!response.ok) {
        throw new Error("Failed to update lead stage");
    }
    return response.json();
}

/**
 * Get dashboard summary (lead counts by priority)
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
    if (!response.ok) {
        throw new Error("Failed to fetch dashboard summary");
    }
    return response.json();
}

/**
 * Get action items for sales reps
 */
export async function getActions(): Promise<ActionItem[]> {
    const response = await fetch(`${API_BASE_URL}/dashboard/actions`);
    if (!response.ok) {
        throw new Error("Failed to fetch actions");
    }
    return response.json();
}

/**
 * Score a lead (stateless - doesn't save)
 */
export async function scoreLead(lead: LeadInput): Promise<ScoringResult> {
    const response = await fetch(`${API_BASE_URL}/leads/score`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
    });
    if (!response.ok) {
        throw new Error("Failed to score lead");
    }
    return response.json();
}

/**
 * Create a new lead (scores and saves)
 */
export async function createLead(lead: LeadInput): Promise<LeadResponse> {
    const response = await fetch(`${API_BASE_URL}/leads/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
    });
    if (!response.ok) {
        throw new Error("Failed to create lead");
    }
    return response.json();
}
