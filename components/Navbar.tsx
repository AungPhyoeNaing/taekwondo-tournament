'use client';

import React from 'react';
import { Shield, UserPlus, Database, Trophy, FileSpreadsheet, RefreshCw, Sun, Moon, Users, Swords, FileText } from 'lucide-react';
import { SupabaseHealthStatus } from '@/lib/supabase';
import { Language, Translations } from '@/lib/translations';
import Link from 'next/link';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenSetupModal: () => void;
  onExportCsv: () => void;
  health: SupabaseHealthStatus | null;
  checkingHealth: boolean;
  onRefresh: () => void;
  totalPlayers: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  lang: Language;
  onToggleLanguage: (l: Language) => void;
  t: Translations;
  activeTab: 'roster' | 'bracket';
  onSelectTab: (tab: 'roster' | 'bracket') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenSetupModal,
  onExportCsv,
  health,
  checkingHealth,
  onRefresh,
  totalPlayers,
  theme,
  onToggleTheme,
  lang,
  onToggleLanguage,
  t,
  activeTab,
  onSelectTab
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 shadow-sm text-white font-black text-lg flex-shrink-0">
              <Shield className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-950"></span>
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase truncate">
                  {lang === 'my' ? 'တိုက်ကွမ်ဒို' : 'TKD'} <span className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">{lang === 'my' ? 'ပြိုင်ပွဲ' : 'Tournament'}</span>
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100/80 dark:bg-red-950/80 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-300 uppercase tracking-wider">
                  <Trophy className="w-2.5 h-2.5 text-amber-500" /> {t.wtOfficial}
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                {totalPlayers} {t.fightersListed} • Phoenix Cup
              </p>
            </div>
          </div>

          {/* Center Segmented Navigation Tabs */}
          <div className="flex items-center bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl p-1 text-xs font-bold shadow-inner">
            <button
              onClick={() => onSelectTab('roster')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'roster'
                  ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm font-black'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.rosterNav}</span>
            </button>
            <button
              onClick={() => onSelectTab('bracket')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'bracket'
                  ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm font-black'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{t.bracketNav}</span>
            </button>
            <Link
              href="/results"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">{t.resultsNav}</span>
            </Link>
          </div>

          {/* Action buttons, Utilities & Register CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 text-xs font-bold">
              <button
                onClick={() => onToggleLanguage('en')}
                className={`px-2 py-1 rounded-md transition-all ${
                  lang === 'en'
                    ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm font-black'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => onToggleLanguage('my')}
                className={`px-2 py-1 rounded-md transition-all ${
                  lang === 'my'
                    ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm font-black'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="မြန်မာ"
              >
                မြန်မာ
              </button>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Database setup */}
            <button
              onClick={onOpenSetupModal}
              title="Supabase Database Setup & Schema"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Refresh status */}
            <button
              onClick={onRefresh}
              disabled={checkingHealth}
              title={`${health?.tableExists ? t.supabaseLive : t.supabaseSetup} • Click to refresh`}
              className={`p-2 rounded-lg border transition-all ${
                health?.connected && health?.tableExists
                  ? 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-600 hover:bg-amber-100'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${checkingHealth ? 'animate-spin text-red-500' : ''}`} />
            </button>

            {/* Export CSV button (Desktop) */}
            <button
              onClick={onExportCsv}
              title={t.exportCsv}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>CSV</span>
            </button>

            {/* Register Athlete CTA */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-sm shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.registerAthlete}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
