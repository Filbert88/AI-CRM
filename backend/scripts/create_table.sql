-- SQL Script to create the leads table in Supabase
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor)

-- Create the leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, 
    lead_id TEXT NOT NULL, 
    industry TEXT NOT NULL,
    company_size INTEGER NOT NULL CHECK (company_size >= 1),
    channel TEXT NOT NULL,
    interaction_count INTEGER NOT NULL DEFAULT 0 CHECK (interaction_count >= 0),
    last_interaction_days_ago INTEGER NOT NULL DEFAULT 0 CHECK (last_interaction_days_ago >= 0),
    has_requested_pricing BOOLEAN NOT NULL DEFAULT false,
    has_demo_request BOOLEAN NOT NULL DEFAULT false,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    priority TEXT NOT NULL CHECK (priority IN ('Hot', 'Warm', 'Cold')),
    stage TEXT NOT NULL DEFAULT 'new' CHECK (stage IN ('new', 'meeting', 'negotiation', 'closed', 'rejected')),
    explanations TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_lead_owner UNIQUE (lead_id, owner_id)
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads(owner_id);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leads" ON leads
    FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own leads" ON leads
    FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own leads" ON leads
    FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own leads" ON leads
    FOR DELETE
    USING (auth.uid() = owner_id);

GRANT ALL ON leads TO authenticated;
GRANT ALL ON leads TO anon; 
