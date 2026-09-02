'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Player } from '@/types/player';
import { DEMO_PLAYERS } from '@/lib/taekwondo';
import { supabase } from '@/lib/supabase';
import { Language } from '@/lib/translations';
import { PairedResultsView } from '@/components/PairedResultsView';
import { ArrowLeft, Shield, Sun, Moon } from 'lucide-react';

export default function ResultsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('my');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('tkd_theme') as 'light' | 'dark' | null;
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }

    const savedLang = localStorage.getItem('tkd_lang') as Language | null;
    if (savedLang) {
      setLang(savedLang);
    }

    async function loadData() {
      try {
        const { data, error } = await supabase.from('players').select('*');
        if (!error && data && data.length > 0) {
          setPlayers(data as Player[]);
        } else {
          const savedLocal = localStorage.getItem('tkd_local_players');
          setPlayers(savedLocal ? JSON.parse(savedLocal) : DEMO_PLAYERS);
        }
      } catch {
        setPlayers(DEMO_PLAYERS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('tkd_theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleToggleLanguage = (l: Language) => {
    setLang(l);
    localStorage.setItem('tkd_lang', l);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans selection:bg-red-600 selection:text-white transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{lang === 'my' ? 'ပင်မစာမျက်နှာသို့' : 'Back to App'}</span>
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                <h1 className="text-sm sm:text-base font-black uppercase text-slate-900 dark:text-white">
                  {lang === 'my' ? 'တွဲဆိုင်းရလဒ်များနှင့် ပွဲစဉ်ဇယား' : 'Paired Results & Match Sheet'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 text-xs font-bold">
                <button
                  onClick={() => handleToggleLanguage('en')}
                  className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleToggleLanguage('my')}
                  className={`px-2 py-1 rounded ${lang === 'my' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                >
                  မြန်မာ
                </button>
              </div>

              <button
                onClick={handleToggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading tournament match results...</p>
          </div>
        ) : (
          <PairedResultsView
            players={players}
            lang={lang}
            onNavigateToPairing={() => {
              window.location.href = '/';
            }}
          />
        )}
      </main>
    </div>
  );
}
