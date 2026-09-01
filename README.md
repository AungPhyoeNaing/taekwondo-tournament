# 🥋 Taekwondo Tournament Athlete Database & Weigh-In Search Portal

A full-stack tournament management web application built with **Next.js (App Router)**, **Tailwind CSS**, and **Supabase PostgreSQL**. Designed for quick athlete lookups, real-time weigh-in verification, official World Taekwondo (WT) division classification, credential badge printing, and 1-click deployment to **Vercel** (free tier).

---

## ⚡ Key Features

- 🔍 **Instant Player Search**: Real-time searching across Athlete Names, Clubs, and Belt ranks.
- 📋 **Athlete Registration (User Input)**: Add and edit competitors with Name, Date of Birth, Weight (kg), Gender, Belt Color, Club, Phone, and Notes.
- ⚖️ **World Taekwondo (WT) Weight Division Auto-Calculator**: Automatically calculates age and maps fighters to official WT Olympic & Championship weight classes (Fin, Fly, Bantam, Feather, Light, Welter, Middle, Heavy) across Cadet, Junior, Senior, and Ultra divisions.
- 🗂️ **Multi-Filter & Sort Engine**: Filter by Gender, Belt rank chips, Age category, Representing Club, and Weight range (kg). Sort by Name, Weight, Age, Club, or Registration date.
- 🪪 **Digital Athlete Credential & Weigh-In Pass**: Official tournament ID pass modal with QR/barcode stamp, printable with 1-click via standard paper print styles.
- 📊 **Tournament Metrics**: Real-time stats on total fighters, participating clubs, gender ratio, and belt rank distribution.
- 📥 **Export to CSV**: Download the complete tournament roster in CSV format for official draw sheets and bracket generation.
- 🗄️ **Supabase Cloud Database**: Stores player data in your Supabase PostgreSQL database with Row Level Security (RLS). Includes a friendly in-app setup banner and fallback demo mode.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
The `.env.local` file is already configured with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://uihtvjizdjtsmhtasjqf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpaHR2aml6ZGp0c21odGFzanFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjE0MjcsImV4cCI6MjEwMzgzNzQyN30.zSr4f8-nWOLsHXAGge0uUlNy7zmo9qBUbjjN7JGZY3Q
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase 10-Second Table Setup

The application is pre-connected to your Supabase project (`uihtvjizdjtsmhtasjqf`). To create the `players` table in your database:

1. Open your **Supabase Dashboard**:  
   👉 [https://supabase.com/dashboard/project/uihtvjizdjtsmhtasjqf/sql](https://supabase.com/dashboard/project/uihtvjizdjtsmhtasjqf/sql)
2. Copy the SQL script located in [`supabase/schema.sql`](./supabase/schema.sql) (or click the **"Database Setup"** button in the website navbar).
3. Paste it into the SQL Editor and click **"Run"**.
4. Return to the website and click **"Test Supabase Connection"**!

```sql
-- Create players table
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    weight NUMERIC(5,2) NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    belt_color TEXT NOT NULL,
    club_name TEXT NOT NULL,
    contact_number TEXT,
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Allow tournament access
CREATE POLICY "Allow public read access" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.players FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete access" ON public.players FOR DELETE USING (true);
```

---

## 🌐 Deploy to Vercel (Free)

Deploying this website to Vercel takes less than 2 minutes:

1. Push this repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Taekwondo Tournament portal"
   # Push to your GitHub repo
   ```

2. Go to [https://vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://uihtvjizdjtsmhtasjqf.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpaHR2aml6ZGp0c21odGFzanFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjE0MjcsImV4cCI6MjEwMzgzNzQyN30.zSr4f8-nWOLsHXAGge0uUlNy7zmo9qBUbjjN7JGZY3Q`
5. Click **"Deploy"**!

---

## 🥋 Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS with custom martial arts theme
- **Database**: Supabase PostgreSQL with `@supabase/supabase-js`
- **Icons**: Lucide React
- **Celebration FX**: `canvas-confetti`
- **Hosting**: Vercel (100% Free Tier Compatible)
