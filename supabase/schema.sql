-- =========================================================
-- TAEKWONDO TOURNAMENT DATABASE SCHEMA
-- Table: public.players
-- Description: Stores registered tournament athletes
-- =========================================================

-- Create players table if not exists
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    weight NUMERIC(5,2) NOT NULL, -- in Kilograms (e.g. 58.40)
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    belt_color TEXT NOT NULL, -- White, Yellow, Green, Blue, Red, Black, Poom, etc.
    club_name TEXT NOT NULL,
    contact_number TEXT,
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid collision
DROP POLICY IF EXISTS "Allow public read access" ON public.players;
DROP POLICY IF EXISTS "Allow public insert access" ON public.players;
DROP POLICY IF EXISTS "Allow public update access" ON public.players;
DROP POLICY IF EXISTS "Allow public delete access" ON public.players;

-- Tournament Open Policies (allows anonymous/public client to read and manage athletes)
CREATE POLICY "Allow public read access" 
    ON public.players FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert access" 
    ON public.players FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update access" 
    ON public.players FOR UPDATE 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow public delete access" 
    ON public.players FOR DELETE 
    USING (true);

-- Create index for fast searching
CREATE INDEX IF NOT EXISTS idx_players_name ON public.players USING gin (to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_players_club ON public.players (club_name);
CREATE INDEX IF NOT EXISTS idx_players_belt ON public.players (belt_color);
CREATE INDEX IF NOT EXISTS idx_players_gender ON public.players (gender);

-- Optional: Initial Demo Competitors (can be safely run multiple times)
INSERT INTO public.players (name, date_of_birth, weight, gender, belt_color, club_name, notes)
VALUES 
    ('Aung Thu', '2002-05-14', 58.00, 'Male', 'Black', 'Yangon Tigers TKD', 'Flyweight specialist, 1st Dan'),
    ('Su Myat Noe', '2004-11-20', 49.20, 'Female', 'Black', 'Golden Dragon Dojang', 'National Junior Gold medalist'),
    ('Min Thant', '2006-03-08', 63.50, 'Male', 'Red', 'Mandalay Warriors', 'Bantamweight contender'),
    ('Hnin Yu Wai', '2008-09-12', 46.00, 'Female', 'Blue', 'Taunggyi Stars TKD', 'Cadet division competitor'),
    ('Kyaw Zin Lat', '2001-01-25', 74.80, 'Male', 'Black', 'Naypyidaw Phoenix', 'Welterweight heavyweight striker'),
    ('Lin Htet', '2007-07-19', 55.40, 'Male', 'Green', 'Apex Martial Arts Club', 'First time tournament entrant')
ON CONFLICT DO NOTHING;
