-- Add website and type columns to venues
ALTER TABLE venues
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS type text;

-- Comment
COMMENT ON COLUMN venues.website IS 'Venue website URL';
COMMENT ON COLUMN venues.type IS 'Venue type: Salle, Château, Domaine, Hôtel, Restaurant, etc.';
