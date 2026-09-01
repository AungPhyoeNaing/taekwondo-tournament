'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Player } from '@/types/player';
import { BracketData } from '@/types/bracket';
import { DEMO_PLAYERS, getBeltStyle } from '@/lib/taekwondo';
import { generateSingleEliminationBracket } from '@/lib/bracket';
import { Language, translations } from '@/lib/translations';
import {
  Printer,
  FileSpreadsheet,
  ArrowLeft,
  Shield,
  Search,
  Sun,
  Moon,
  Swords,
  Users,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ResultsPage() {
  const [bracket, setBracket] = useState<BracketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('my');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');

  const t = translations[lang];

  // Initialize theme, language & bracket from localStorage
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

    // Load active bracket
    const savedBracket = localStorage.getItem('tkd_active_bracket');
    if (savedBracket) {
      try {
        const parsed = JSON.parse(savedBracket);
        if (parsed && parsed.rounds && parsed.rounds.length > 0) {
          setBracket(parsed);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }
    }

    // Fallback: load local players or demo players to generate bracket
    let playersPool: Player[] = DEMO_PLAYERS;
    const savedPlayers = localStorage.getItem('tkd_local_players');
    if (savedPlayers) {
      try {
        const parsed = JSON.parse(savedPlayers);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          playersPool = parsed;
        }
      } catch {
        // ignore
      }
    }

    if (playersPool.length >= 2) {
      const generated = generateSingleEliminationBracket(
        playersPool,
        lang === 'my' ? 'အားလုံးပါဝင်သော အဆင့် (Open Tournament)' : 'Open Tournament Division',
        'random',
        savedLang || 'my'
      );
      setBracket(generated);
      localStorage.setItem('tkd_active_bracket', JSON.stringify(generated));
    }
    setLoading(false);
  }, [lang]);

  // Handle Theme Toggle
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('tkd_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle Language Toggle
  const handleToggleLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('tkd_lang', newLang);
  };

  // Print Initial Match Sheet
  const handlePrint = () => {
    window.print();
  };

  // Get initial round matches ONLY (Round 1 - No semi, quarter, finals)
  const initialMatches = useMemo(() => {
    if (!bracket || !bracket.rounds || bracket.rounds.length === 0) return [];
    return bracket.rounds[0].matches;
  }, [bracket]);

  // Initial draw metrics
  const initialStats = useMemo(() => {
    if (!bracket) return { totalInitialBouts: 0, contestedBouts: 0, byeBouts: 0 };
    let contested = 0;
    let bye = 0;

    initialMatches.forEach((m) => {
      if (m.isByeMatch) {
        bye++;
      } else {
        contested++;
      }
    });

    return {
      totalInitialBouts: initialMatches.length,
      contestedBouts: contested,
      byeBouts: bye
    };
  }, [bracket, initialMatches]);

  // Export Initial Pairing to CSV
  const handleExportCsv = () => {
    if (!bracket) return;

    const headers = [
      'Bout #',
      'Division',
      'Hong Seed',
      'Hong Athlete (Red)',
      'Hong Club',
      'Hong Belt',
      'Hong Weight (kg)',
      'Chong Seed',
      'Chong Athlete (Blue)',
      'Chong Club',
      'Chong Belt',
      'Chong Weight (kg)',
      'Pairing Status'
    ];

    const rows = initialMatches.map((m, idx) => {
      const p1 = m.participant1.player;
      const p2 = m.participant2.player;
      const pairingStatus = m.isByeMatch
        ? 'BYE (Auto-Advance to Round 2)'
        : 'Round 1 Contested Bout';

      return [
        `"Bout ${idx + 1} (${m.id})"`,
        `"${bracket.divisionName}"`,
        `"${m.participant1.seed || ''}"`,
        `"${p1?.name || (m.participant1.isBye ? 'BYE' : 'TBD')}"`,
        `"${p1?.club_name || ''}"`,
        `"${p1?.belt_color || ''}"`,
        `"${p1?.weight || ''}"`,
        `"${m.participant2.seed || ''}"`,
        `"${p2?.name || (m.participant2.isBye ? 'BYE' : 'TBD')}"`,
        `"${p2?.club_name || ''}"`,
        `"${p2?.belt_color || ''}"`,
        `"${p2?.weight || ''}"`,
        `"${pairingStatus}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tkd_initial_pairing_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered initial matches
  const filteredMatches = useMemo(() => {
    if (!initialMatches) return [];
    if (!searchQuery.trim()) return initialMatches;

    const q = searchQuery.toLowerCase().trim();
    return initialMatches.filter((m) => {
      const p1Match =
        m.participant1.player?.name.toLowerCase().includes(q) ||
        m.participant1.player?.club_name.toLowerCase().includes(q) ||
        m.participant1.player?.belt_color.toLowerCase().includes(q);
      const p2Match =
        m.participant2.player?.name.toLowerCase().includes(q) ||
        m.participant2.player?.club_name.toLowerCase().includes(q) ||
        m.participant2.player?.belt_color.toLowerCase().includes(q);
      const idMatch = m.id.toLowerCase().includes(q);
      return p1Match || p2Match || idMatch;
    });
  }, [initialMatches, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans selection:bg-red-600 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/80 backdrop-blur-md transition-colors print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Back Button & Title */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all shadow-sm"
                title="Back to Tournament Portal"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                    {t.resultsNav}
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800/50 text-red-700 dark:text-red-300 uppercase tracking-wider">
                    WT Initial Draw
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t.resultsSubtitle}
                </p>
              </div>
            </div>

            {/* Language Switcher, Theme & Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Language Selector */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs font-bold">
                <button
                  onClick={() => handleToggleLanguage('en')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    lang === 'en'
                      ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm font-black'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleToggleLanguage('my')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    lang === 'my'
                      ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm font-black'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  မြန်မာ
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={handleToggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-white transition-all shadow-sm"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>

              {/* Back to Bracket Draw Link */}
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <Swords className="w-4 h-4 text-red-500" />
                <span className="hidden sm:inline">{t.backToBracket}</span>
              </Link>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title={t.printResults}
              >
                <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <span className="hidden md:inline">{t.printResults}</span>
              </button>

              {/* Export CSV Button */}
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-500/20 transition-all hover:scale-[1.02]"
                title={t.exportResultsCsv}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline">{t.exportResultsCsv}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Printable Header */}
        <div className="hidden print:block text-center border-b pb-4 mb-4">
          <h1 className="text-2xl font-black uppercase">WORLD TAEKWONDO CHAMPIONSHIP</h1>
          <h2 className="text-lg font-bold">{bracket?.divisionName || 'Initial Pairing Table'}</h2>
          <p className="text-xs text-slate-600">
            Official Round 1 Initial Draw Sheet (Single Elimination with Byes) • Date: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Division Summary & Initial Pairing Metrics Card */}
        {bracket && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm transition-colors print:border-none print:shadow-none print:p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 uppercase tracking-wide">
                    Round 1 Initial Draw
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                    Single Elimination with Byes
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  {bracket.divisionName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.selectedAthletesCount(bracket.totalCompetitors, bracket.byeCount)}
                </p>
              </div>

              {/* Status Metric Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Users className="w-4 h-4 text-slate-500" />
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[10px] uppercase">
                      {lang === 'my' ? 'ကစားသမား' : 'Competitors'}
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {bracket.totalCompetitors}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[10px] uppercase">
                      {lang === 'my' ? 'ပထမအဆင့် တွဲဆိုင်း' : 'Initial Bouts'}
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {initialStats.totalInitialBouts}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800/50">
                  <Swords className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <span className="text-blue-700 dark:text-blue-300 font-semibold block text-[10px] uppercase">
                      {lang === 'my' ? 'ယှဉ်ပြိုင်ရမည့်ပွဲ' : 'Contested Bouts'}
                    </span>
                    <span className="text-sm font-black text-blue-800 dark:text-blue-200">
                      {initialStats.contestedBouts}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/50">
                  <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="text-amber-700 dark:text-amber-300 font-semibold block text-[10px] uppercase">
                      {lang === 'my' ? 'တိုက်ရိုက်တက် Byes' : 'Byes (Auto-Pass)'}
                    </span>
                    <span className="text-sm font-black text-amber-800 dark:text-amber-200">
                      {initialStats.byeBouts}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar (Hidden when printing) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              {lang === 'my'
                ? `ပထမအဆင့် တွဲဆိုင်း ${filteredMatches.length} ပွဲ ပြသနေပါသည်`
                : `Showing ${filteredMatches.length} Round 1 initial pairings`}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search athlete, club or bout #..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>
        </div>

        {/* The Initial Pair Result Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading initial pairing table...</p>
          </div>
        ) : !bracket || filteredMatches.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Swords className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.noResultsYet}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">{t.noResultsDesc}</p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Swords className="w-4 h-4" /> {t.backToBracket}
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm overflow-hidden">
            {/* Desktop & Tablet Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[11px] font-black tracking-wide">
                    <th className="py-3 px-3 w-16 text-center">{t.bout} #</th>
                    <th className="py-3 px-4 w-5/12 text-rose-600 dark:text-rose-400 font-black">
                      🔴 HONG / ဟုန်း (အနီထောင့်)
                    </th>
                    <th className="py-3 px-2 w-12 text-center text-slate-400">VS</th>
                    <th className="py-3 px-4 w-5/12 text-blue-600 dark:text-blue-400 font-black">
                      🔵 CHONG / ချုန်း (အပြာထောင့်)
                    </th>
                    <th className="py-3 px-4 w-44 text-right">{t.pairingType}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredMatches.map((match, idx) => {
                    const p1 = match.participant1.player;
                    const p2 = match.participant2.player;
                    const belt1 = p1 ? getBeltStyle(p1.belt_color) : null;
                    const belt2 = p2 ? getBeltStyle(p2.belt_color) : null;
                    const isByeMatch = match.isByeMatch;

                    return (
                      <tr
                        key={match.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Bout Number */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200">
                            {idx + 1}
                          </span>
                        </td>

                        {/* Hong Athlete */}
                        <td className="py-3.5 px-4">
                          {p1 ? (
                            <div className="flex items-center gap-3">
                              {belt1 && (
                                <div
                                  className="w-1.5 h-9 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: belt1.barColor }}
                                  title={belt1.name}
                                />
                              )}
                              <div className="min-w-0">
                                <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                  <span className="truncate">{p1.name}</span>
                                  {match.participant1.seed && (
                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                      Seed #{match.participant1.seed}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                  <span className="font-medium">{p1.club_name}</span>
                                  <span className="mx-1.5">•</span>
                                  <span className="font-semibold">{p1.weight} kg</span>
                                  <span className="mx-1.5">•</span>
                                  <span className="font-medium text-slate-600 dark:text-slate-300">{p1.belt_color}</span>
                                </div>
                              </div>
                            </div>
                          ) : match.participant1.isBye ? (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-black text-xs">
                              BYE (တိုက်ရိုက်တက်)
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">TBD</span>
                          )}
                        </td>

                        {/* VS */}
                        <td className="py-3.5 px-2 text-center">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-400">
                            VS
                          </span>
                        </td>

                        {/* Chong Athlete */}
                        <td className="py-3.5 px-4">
                          {p2 ? (
                            <div className="flex items-center gap-3">
                              {belt2 && (
                                <div
                                  className="w-1.5 h-9 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: belt2.barColor }}
                                  title={belt2.name}
                                />
                              )}
                              <div className="min-w-0">
                                <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                  <span className="truncate">{p2.name}</span>
                                  {match.participant2.seed && (
                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                      Seed #{match.participant2.seed}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                  <span className="font-medium">{p2.club_name}</span>
                                  <span className="mx-1.5">•</span>
                                  <span className="font-semibold">{p2.weight} kg</span>
                                  <span className="mx-1.5">•</span>
                                  <span className="font-medium text-slate-600 dark:text-slate-300">{p2.belt_color}</span>
                                </div>
                              </div>
                            </div>
                          ) : match.participant2.isBye ? (
                            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-extrabold text-xs">
                              <Shield className="w-4 h-4 text-amber-500" />
                              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/50">
                                BYE (ပြိုင်ဘက်မရှိ)
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">TBD</span>
                          )}
                        </td>

                        {/* Pairing Status */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {isByeMatch ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50">
                              <Shield className="w-3.5 h-3.5 text-amber-600" />
                              {t.byeMatch}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                              <Swords className="w-3.5 h-3.5 text-blue-500" />
                              {t.regularMatch}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="sm:hidden space-y-3">
              {filteredMatches.map((match, idx) => {
                const p1 = match.participant1.player;
                const p2 = match.participant2.player;
                const isByeMatch = match.isByeMatch;

                return (
                  <div
                    key={match.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between font-extrabold pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-slate-900 dark:text-white">
                        {t.bout} #{idx + 1}
                      </span>
                      {isByeMatch ? (
                        <span className="text-amber-600 dark:text-amber-400 font-black flex items-center gap-1">
                          <Shield className="w-3 h-3" /> {t.byeMatch}
                        </span>
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 font-black flex items-center gap-1">
                          <Swords className="w-3 h-3" /> {t.regularMatch}
                        </span>
                      )}
                    </div>

                    {/* Hong */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500 text-white">
                        HONG
                      </span>
                      <div className="text-right ml-2 truncate">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {p1 ? p1.name : 'BYE'}
                        </div>
                        {p1 && (
                          <div className="text-[11px] text-slate-500 truncate">
                            {p1.club_name} • {p1.weight}kg
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chong */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white">
                        CHONG
                      </span>
                      <div className="text-right ml-2 truncate">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {p2 ? p2.name : 'BYE'}
                        </div>
                        {p2 && (
                          <div className="text-[11px] text-slate-500 truncate">
                            {p2.club_name} • {p2.weight}kg
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
