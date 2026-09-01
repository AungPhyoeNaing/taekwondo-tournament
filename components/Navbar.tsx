'use client';

import React from 'react';
import { Shield, UserPlus, Database, Trophy, FileSpreadsheet, RefreshCw, Sun, Moon } from 'lucide-react';
import { SupabaseHealthStatus } from '@/lib/supabase';

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
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 shadow-md shadow-red-500/20 text-white font-black text-xl">
              <Shield className="w-7 h-7" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  TKD <span className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">Tournament</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800/50 text-red-700 dark:text-red-300 uppercase tracking-wider">
                  <Trophy className="w-3 h-3 text-amber-500" /> WT Official
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Athlete Registry & Search Portal • <span className="text-slate-700 dark:text-slate-200 font-bold">{totalPlayers}</span> fighters listed
              </p>
            </div>
          </div>

          {/* Action buttons & Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-white transition-all shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Database status pill */}
            <button
              onClick={onOpenSetupModal}
              title="Click to view Supabase SQL setup instructions"
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                health?.connected && health?.tableExists
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                  : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {health?.tableExists ? 'Supabase Live' : 'Supabase Setup'}
              </span>
              <span className="md:hidden">DB</span>
            </button>

            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={checkingHealth}
              title="Refresh database"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${checkingHealth ? 'animate-spin text-red-500' : ''}`} />
            </button>

            {/* Export CSV button */}
            <button
              onClick={onExportCsv}
              title="Export Athletes to CSV"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Export CSV
            </button>

            {/* Register Athlete CTA */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Athlete</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
