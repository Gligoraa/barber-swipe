-- Add columns needed for Google Places import
ALTER TABLE public.barbershops
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS price_level INTEGER,
  ADD COLUMN IF NOT EXISTS google_place_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS user_ratings_total INTEGER;

-- Create index for fast city filtering
CREATE INDEX IF NOT EXISTS idx_barbershops_city ON public.barbershops(city);

-- Create index for upsert performance on google_place_id
CREATE INDEX IF NOT EXISTS idx_barbershops_google_place_id ON public.barbershops(google_place_id);
