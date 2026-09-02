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

-- Initial Competitors Seed Data
INSERT INTO public.players (name, date_of_birth, weight, gender, belt_color, club_name, notes)
VALUES 
    ('May Pachi Khit', '2013-10-31', 42.80, 'Female', 'White', 'Phoenix', NULL),
    ('May Phoe Mon', '2016-12-01', 43.80, 'Female', 'White', 'Phoenix', NULL),
    ('Kyal Sin Lin Lae', '2006-05-16', 52.00, 'Female', 'White', 'Phoenix', NULL),
    ('Thura Aung', '1999-05-11', 62.00, 'Male', 'Green', 'Phoenix', NULL),
    ('Hein Htet Zaw', '2005-12-23', 51.50, 'Male', 'White', 'Phoenix', NULL),
    ('Poe Kyi Phyu Khant', '2021-03-11', 27.00, 'Female', 'White', 'Phoenix', NULL),
    ('Thiri Han', '2010-05-14', 48.20, 'Female', 'White', 'Phoenix', NULL),
    ('Myat Thiri', '2013-05-23', 39.80, 'Female', 'White', 'Phoenix', NULL),
    ('Htet Su Yati Lin', '2011-02-22', 41.80, 'Female', 'White', 'Phoenix', NULL),
    ('Kyaw Zin Htet', '2013-10-28', 37.50, 'Male', 'White', 'Phoenix', NULL),
    ('Myint Myat Hein', '2012-11-04', 64.50, 'Male', 'White', 'Phoenix', NULL),
    ('Myat Bhone Khant', '2016-11-03', 28.90, 'Male', 'Green', 'Phoenix', NULL),
    ('Shwe Yaung Hlaing', '2016-04-27', 57.00, 'Male', 'White', 'Phoenix', NULL),
    ('Shin Thant Hlaing', '2016-04-27', 37.00, 'Male', 'White', 'Phoenix', NULL),
    ('May Phyo Thant', '2004-02-20', 43.80, 'Female', 'White', 'Phoenix', NULL),
    ('Yati Hmue Kyaw', '2011-06-08', 43.00, 'Female', 'White', 'Phoenix', NULL),
    ('Lin Thuta Min', '2018-08-29', 16.00, 'Male', 'White', 'Phoenix', NULL),
    ('Win Lae Shwe Yi', '2012-03-21', 41.00, 'Female', 'Green', 'Phoenix', NULL),
    ('Yaung Zin', '2005-08-31', 49.20, 'Male', 'Green', 'Phoenix', NULL),
    ('Theint Kyi PhyuKoKo', '2003-10-31', 51.50, 'Female', 'Green', 'Phoenix', NULL),
    ('Pyae Phyo Thaw', '2003-12-05', 68.50, 'Male', 'Yellow', 'Phoenix', NULL),
    ('Akaya Moe Thar', '2021-07-25', 14.10, 'Male', 'White', 'Phoenix', NULL),
    ('Sai Noom Han Hleng', '2006-12-02', 60.00, 'Male', 'Yellow', 'Phoenix', NULL),
    ('Myint Myat Thazin', '2003-01-23', 54.00, 'Female', 'Green', 'Phoenix', NULL),
    ('Aung Myo Khant', '2010-01-10', 61.00, 'Male', 'White', 'Phoenix', NULL),
    ('Khaing Thazin Thin', '2016-01-04', 38.00, 'Female', 'White', 'Phoenix', NULL),
    ('Khin Shin Thant', '2010-10-07', 52.00, 'Female', 'White', 'Phoenix', NULL),
    ('Kaung Khant Hein', '2005-01-01', 57.70, 'Male', 'Green', 'Phoenix', 'Birth Year 2005 (Age 21)'),
    ('Way Yan Hein', '2018-12-12', 38.00, 'Male', 'White', 'Phoenix', NULL),
    ('Eaindray Min Thu', '2014-08-24', 35.45, 'Female', 'White', 'Phoenix', NULL),
    ('Kay Zin Lin', '2008-08-18', 59.00, 'Female', 'White', 'Phoenix', NULL),
    ('Su Su Naing', '2007-10-10', 42.45, 'Female', 'White', 'Phoenix', NULL),
    ('Nan Cherry Ko', '2007-04-02', 42.60, 'Female', 'White', 'Phoenix', NULL),
    ('Hannadi Myo Thein', '2012-08-16', 36.50, 'Female', 'Green', 'Phoenix', NULL)
ON CONFLICT DO NOTHING;

