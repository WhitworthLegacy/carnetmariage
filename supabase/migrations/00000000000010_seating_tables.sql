-- Seating tables for the table plan feature
CREATE TABLE IF NOT EXISTS seating_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 8,
  shape TEXT NOT NULL DEFAULT 'round', -- 'round', 'rectangle', 'long'
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_seating_tables_wedding ON seating_tables(wedding_id);

-- Enable RLS
ALTER TABLE seating_tables ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can manage tables for their own weddings
CREATE POLICY "Users can manage their seating tables" ON seating_tables
  FOR ALL USING (
    wedding_id IN (SELECT id FROM weddings WHERE owner_id = auth.uid())
  );

-- Add table_id column to guests for assignments
ALTER TABLE guests ADD COLUMN IF NOT EXISTS table_id UUID REFERENCES seating_tables(id) ON DELETE SET NULL;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_guests_table ON guests(table_id);
