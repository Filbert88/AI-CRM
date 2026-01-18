ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'new' 
CHECK (stage IN ('new', 'meeting', 'negotiation', 'closed'));

CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
