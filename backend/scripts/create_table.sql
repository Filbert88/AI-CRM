-- SQL Script to create the leads table in Supabase
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor)

-- Create the leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id TEXT NOT NULL UNIQUE,
    industry TEXT NOT NULL,
    company_size INTEGER NOT NULL CHECK (company_size >= 1),
    channel TEXT NOT NULL,
    interaction_count INTEGER NOT NULL DEFAULT 0 CHECK (interaction_count >= 0),
    last_interaction_days_ago INTEGER NOT NULL DEFAULT 0 CHECK (last_interaction_days_ago >= 0),
    has_requested_pricing BOOLEAN NOT NULL DEFAULT false,
    has_demo_request BOOLEAN NOT NULL DEFAULT false,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    priority TEXT NOT NULL CHECK (priority IN ('Hot', 'Warm', 'Cold')),
    explanations TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on score for faster sorting
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);

-- Create an index on priority for faster filtering
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on leads" ON leads
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant permissions to authenticated and anon users
GRANT ALL ON leads TO anon;
GRANT ALL ON leads TO authenticated;
