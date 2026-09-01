'use client';

import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, X, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { SupabaseHealthStatus } from '@/lib/supabase';
import { Language, Translations } from '@/lib/translations';

interface DatabaseSetupBannerProps {
  isOpen: boolean;
  onClose: () => void;
  health: SupabaseHealthStatus | null;
  onRetry: () => void;
  onLoadDemoData: () => void;
  t: Translations;
  lang: Language;
}

export const DatabaseSetupModal: React.FC<DatabaseSetupBannerProps> = ({
  isOpen,
  onClose,
  health,
  onRetry,
  onLoadDemoData,
  t
}) => {
  const [copied, setCopied] = useState(false);
  const [retrying, setRetrying] = useState(false);

  if (!isOpen) return null;

  const sqlCode = `-- 1. Create players table
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

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- 3. Allow public tournament access
CREATE POLICY "Allow public read access" ON public.players FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.players FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete access" ON public.players FOR DELETE USING (true);

-- 4. Initial Seed Data
INSERT INTO public.players (name, date_of_birth, weight, gender, belt_color, club_name, notes)
VALUES 
    ('Aung Thu', '2002-05-14', 58.00, 'Male', 'Black', 'Yangon Tigers TKD', 'Flyweight specialist, 1st Dan'),
    ('Su Myat Noe', '2004-11-20', 49.20, 'Female', 'Black', 'Golden Dragon Dojang', 'National Junior Gold medalist'),
    ('Min Thant', '2006-03-08', 63.50, 'Male', 'Red', 'Mandalay Warriors', 'Bantamweight contender'),
    ('Hnin Yu Wai', '2008-09-12', 46.00, 'Female', 'Blue', 'Taunggyi Stars TKD', 'Cadet division competitor'),
    ('Kyaw Zin Lat', '2001-01-25', 74.80, 'Male', 'Black', 'Naypyidaw Phoenix', 'Welterweight heavyweight striker'),
    ('Lin Htet', '2007-07-19', 55.40, 'Male', 'Green', 'Apex Martial Arts Club', 'First time tournament entrant');`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleRetry = async () => {
    setRetrying(true);
    await onRetry();
    setTimeout(() => setRetrying(false), 800);
  };

  const projectId = 'uihtvjizdjtsmhtasjqf';
  const supabaseSqlUrl = `https://supabase.com/dashboard/project/${projectId}/sql`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${health?.tableExists ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                {t.setupModalTitle}
                {health?.tableExists ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Table Active
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Action Required
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connected to Project: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{projectId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {health?.tableExists ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Your Supabase `players` table is live!
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300/90 leading-relaxed">
                Database queries, athlete registrations, searches, and updates are saving directly to your Supabase PostgreSQL cloud database.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> Table `players` not found in Supabase
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                Your anon key connects successfully to your Supabase instance, but the PostgreSQL table <code className="bg-amber-200/60 dark:bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-100 font-mono">public.players</code> has not been created yet. Follow the 2-step setup below to activate live database storage!
              </p>
            </div>
          )}

          {/* Step 1 & 2 */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">Quick 2-Step Setup</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href={supabaseSqlUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-500/50 transition-all"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-red-600 dark:group-hover:text-red-400">
                    {t.step1}
                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.step1Desc}</div>
                </div>
              </a>

              <button
                onClick={copyToClipboard}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  copied 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300'
                    : 'bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/70 border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-200 hover:border-red-400 dark:hover:border-red-600'
                }`}
              >
                <div className="text-left">
                  <div className="font-bold flex items-center gap-1.5">
                    {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-red-600 dark:text-red-400" />}
                    {copied ? t.copied : t.step2}
                  </div>
                  <div className="text-xs opacity-80 mt-0.5">{t.step2Desc}</div>
                </div>
              </button>
            </div>

            {/* Code Box */}
            <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                <span>supabase/schema.sql</span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-slate-300 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-52 leading-relaxed">
                <code>{sqlCode}</code>
              </pre>
            </div>
          </div>

          {/* Test & Demo Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onLoadDemoData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              {t.useDemoLocally}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>{retrying ? t.checkingTable : t.testConnection}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
