'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Player } from '@/types/player';
import { BracketData, CustomBoutPair } from '@/types/bracket';
import { Language } from '@/lib/translations';
import { generateSingleEliminationBracket } from '@/lib/bracket';
import {
  Printer,
  FileSpreadsheet,
  ArrowLeft,
  Trophy,
  Swords,
  Search,
  CheckCircle2,
  Users,
  FileText
} from 'lucide-react';

interface PairedResultsViewProps {
  players: Player[];
  lang: Language;
  onNavigateToPairing?: () => void;
}

export const PairedResultsView: React.FC<PairedResultsViewProps> = ({
  players,
  lang,
  onNavigateToPairing
}) => {
  const [bouts, setBouts] = useState<CustomBoutPair[]>([]);
  const [divisionTitle, setDivisionTitle] = useState('Custom Exhibition Matchups');
  const [bracket, setBracket] = useState<BracketData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'both' | 'table' | 'bracket'>('both');

  // Fast player lookup
  const playerMap = useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  // Load saved pairing and bracket data from localStorage
  useEffect(() => {
    try {
      const savedPairing = localStorage.getItem('tkd_custom_pairing');
      let loadedBouts: CustomBoutPair[] = [];
      let loadedTitle = lang === 'my' ? 'စိတ်ကြိုက် တွဲဆိုင်း ပွဲစဉ်များ' : 'Custom Exhibition Matchups';

      if (savedPairing) {
        const parsed = JSON.parse(savedPairing);
        if (parsed.pairs && Array.isArray(parsed.pairs)) {
          loadedBouts = parsed.pairs;
          setBouts(parsed.pairs);
        }
        if (parsed.divisionName) {
          loadedTitle = parsed.divisionName;
          setDivisionTitle(parsed.divisionName);
        }
      }

      const savedBracket = localStorage.getItem('tkd_custom_bracket');
      if (savedBracket) {
        const parsedB = JSON.parse(savedBracket);
        if (parsedB && parsedB.rounds) {
          setBracket(parsedB);
          return;
        }
      }

      // If bracket not cached yet, generate from bouts
      const validBouts = loadedBouts.filter((b) => b.player1Id !== null || b.player2Id !== null);
      if (validBouts.length > 0) {
        const generated = generateSingleEliminationBracket(
          players,
          loadedTitle,
          'custom',
          lang,
          validBouts
        );
        setBracket(generated);
      }
    } catch {
      // ignore
    }
  }, [players, lang]);

  // Valid bouts with at least one fighter
  const validBouts = useMemo(() => {
    return bouts.filter((b) => b.player1Id !== null || b.player2Id !== null);
  }, [bouts]);

  // Map match outcome by participant IDs from bracket
  const matchOutcomes = useMemo(() => {
    const map = new Map<string, { winnerPlayerId?: string; isBye?: boolean; status: string }>();
    if (!bracket) return map;

    bracket.rounds.forEach((round) => {
      round.matches.forEach((m) => {
        const p1Id = m.participant1.player?.id;
        const p2Id = m.participant2.player?.id;
        if (p1Id) {
          map.set(p1Id, {
            winnerPlayerId: m.winnerId && m.winnerId !== 'bye' ? m.winnerId : undefined,
            isBye: m.participant2.isBye,
            status: m.status
          });
        }
        if (p2Id) {
          map.set(p2Id, {
            winnerPlayerId: m.winnerId && m.winnerId !== 'bye' ? m.winnerId : undefined,
            isBye: m.participant1.isBye,
            status: m.status
          });
        }
      });
    });
    return map;
  }, [bracket]);

  // Filter bouts based on search query
  const filteredBouts = useMemo(() => {
    if (!searchQuery.trim()) return validBouts;
    const q = searchQuery.toLowerCase();
    return validBouts.filter((b) => {
      const p1 = b.player1Id ? playerMap.get(b.player1Id) : null;
      const p2 = b.player2Id ? playerMap.get(b.player2Id) : null;
      return (
        p1?.name.toLowerCase().includes(q) ||
        p1?.club_name.toLowerCase().includes(q) ||
        p2?.name.toLowerCase().includes(q) ||
        p2?.club_name.toLowerCase().includes(q)
      );
    });
  }, [validBouts, searchQuery, playerMap]);

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  // Export CSV Action
  const handleExportCsv = () => {
    if (validBouts.length === 0) return;

    const headers = [
      'Bout #',
      'Division',
      'Corner Hong (Red)',
      'Hong Weight (kg)',
      'Hong Belt',
      'Hong Club',
      'Corner Chong (Blue)',
      'Chong Weight (kg)',
      'Chong Belt',
      'Chong Club',
      'Weight Delta (kg)',
      'Status / Winner'
    ];

    const rows = validBouts.map((b, idx) => {
      const p1 = b.player1Id ? playerMap.get(b.player1Id) : null;
      const p2 = b.player2Id ? playerMap.get(b.player2Id) : null;
      const w1 = p1 ? Number(p1.weight) : 0;
      const w2 = p2 ? Number(p2.weight) : 0;
      const delta = p1 && p2 ? Math.abs(w1 - w2).toFixed(1) : '0.0';

      const outcome = p1 ? matchOutcomes.get(p1.id) : undefined;
      let statusStr = 'Pending / Scheduled';
      if (outcome?.isBye) {
        statusStr = 'BYE Advanced';
      } else if (outcome?.winnerPlayerId) {
        const winner = playerMap.get(outcome.winnerPlayerId);
        statusStr = `Winner: ${winner?.name || outcome.winnerPlayerId}`;
      }

      return [
        `Bout ${idx + 1}`,
        `"${divisionTitle.replace(/"/g, '""')}"`,
        `"${p1 ? p1.name.replace(/"/g, '""') : 'Unassigned'}"`,
        p1 ? p1.weight : '',
        p1 ? p1.belt_color : '',
        `"${p1 ? p1.club_name.replace(/"/g, '""') : ''}"`,
        `"${p2 ? p2.name.replace(/"/g, '""') : b.player1Id ? 'BYE' : 'Unassigned'}"`,
        p2 ? p2.weight : '',
        p2 ? p2.belt_color : '',
        `"${p2 ? p2.club_name.replace(/"/g, '""') : ''}"`,
        delta,
        `"${statusStr.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tkd_paired_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalAssignedAthletes = validBouts.reduce(
    (acc, b) => acc + (b.player1Id ? 1 : 0) + (b.player2Id ? 1 : 0),
    0
  );

  const completedMatchesCount = useMemo(() => {
    if (!bracket) return 0;
    return bracket.rounds.flatMap((r) => r.matches).filter((m) => m.status === 'completed').length;
  }, [bracket]);

  const champion = bracket?.champion;

  return (
    <div className="space-y-5 print:space-y-3">
      {/* Official Print Header (Visible only when printed) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-3 mb-4 text-center">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-950">
              WORLD TAEKWONDO TOURNAMENT
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              Official Match Schedule & Paired Results Sheet
            </p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold text-slate-900">{divisionTitle}</p>
            <p className="text-slate-500">{new Date().toLocaleDateString('en-GB')} • Phoenix Cup</p>
          </div>
        </div>
      </div>

      {/* Top Banner & Action Controls (Hidden when printing) */}
      <div className="print:hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'my' ? 'တရားဝင် တွဲဆိုင်းရလဒ်' : 'Official Match Sheet'}</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {divisionTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'my'
                ? 'စိတ်ကြိုက် တွဲဆိုင်းထားသော ပွဲစဉ်များ၊ ဟုန်း/ချုန်း ထောင့်များနှင့် ပြိုင်ပွဲရလဒ် ဇယား'
                : 'Comprehensive bout schedule, Hong/Chong corners, weight comparisons, and tournament bracket progression'}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {onNavigateToPairing && (
              <button
                onClick={onNavigateToPairing}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === 'my' ? 'တွဲဆိုင်း ပြင်မည်' : 'Edit Pairings'}</span>
              </button>
            )}

            <button
              onClick={handleExportCsv}
              disabled={validBouts.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors disabled:opacity-40"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'my' ? 'CSV ထုတ်ယူမည်' : 'Export CSV'}</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={validBouts.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105 disabled:opacity-40"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'my' ? '🖨️ ပရင့်ထုတ်မည်' : 'Print Match Sheet'}</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400 font-bold text-[11px] block">
              {lang === 'my' ? 'စုစုပေါင်း တွဲဆိုင်း' : 'Total Bouts'}
            </span>
            <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <Swords className="w-4 h-4 text-purple-500" />
              <span>{validBouts.length}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400 font-bold text-[11px] block">
              {lang === 'my' ? 'ယှဉ်ပြိုင်မည့် ကစားသမား' : 'Competitors'}
            </span>
            <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>{totalAssignedAthletes}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400 font-bold text-[11px] block">
              {lang === 'my' ? 'ပြီးဆုံးပြီး ပွဲစဉ်များ' : 'Matches Decided'}
            </span>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{completedMatchesCount}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400 font-bold text-[11px] block">
              {lang === 'my' ? 'ပြိုင်ပွဲ ရွှေတံဆိပ်ရှင်' : 'Champion'}
            </span>
            <div className="text-sm font-black text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1 truncate">
              <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="truncate">{champion ? champion.name : lang === 'my' ? 'ဆုံးဖြတ်ဆဲ' : 'TBD'}</span>
            </div>
          </div>
        </div>

        {/* View Switcher & Search Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'both'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-black'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'my' ? 'အားလုံး (ဇယား + မဲခွဲပုံ)' : 'All (Table + Bracket)'}
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-black'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'my' ? 'ပွဲစဉ်ဇယား (Bout Sheet)' : 'Bout Sheet Table'}
            </button>
            <button
              onClick={() => setViewMode('bracket')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'bracket'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-black'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'my' ? 'မဲခွဲအဆင့်ဆင့်ပုံ (Bracket)' : 'Bracket Tree'}
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'my' ? 'ကစားသမား / ကလပ် ရှာရန်...' : 'Search fighter or club...'}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Champion Podium Banner if crowned */}
      {champion && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 rounded-3xl p-5 text-slate-950 shadow-lg border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/90 shadow-md flex items-center justify-center text-amber-600">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-950/80">
                {lang === 'my' ? 'ပြိုင်ပွဲ ရွှေတံဆိပ်ဆုရှင် (Champion)' : 'Tournament Champion'}
              </span>
              <h3 className="text-xl font-black">{champion.name}</h3>
              <p className="text-xs font-bold text-amber-900">
                {champion.club_name} • {champion.weight}kg • {champion.belt_color} Belt
              </p>
            </div>
          </div>
          <span className="px-4 py-1.5 rounded-xl bg-slate-950 text-amber-300 font-extrabold text-xs shadow-sm">
            🥇 Gold Medalist
          </span>
        </div>
      )}

      {/* Empty State if no bouts */}
      {validBouts.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Swords className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {lang === 'my' ? 'တွဲဆိုင်းရလဒ် မရှိသေးပါ' : 'No Paired Matchups Created Yet'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'my'
                ? 'စိတ်ကြိုက်တွဲဆိုင်း Tab သို့မဟုတ် ကစားသမားများ စစ်ထုတ်မှုမှတစ်ဆင့် တွဲဆိုင်းများ စတင်ဖန်တီးနိုင်ပါသည်။'
                : 'Head to the Custom Pairing tab or use the Roster filters to generate your first match sheet.'}
            </p>
          </div>
          {onNavigateToPairing && (
            <button
              onClick={onNavigateToPairing}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-transform hover:scale-105"
            >
              {lang === 'my' ? '🎯 တွဲဆိုင်း စတင်ပြုလုပ်မည်' : 'Create Custom Pairings'}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* SECTION 1: Official Match Schedule Table (Shown in 'both' or 'table') */}
          {(viewMode === 'both' || viewMode === 'table') && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-3 transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {lang === 'my' ? 'တရားဝင် ပွဲစဉ်ဇယား (Official Bout Schedule)' : 'Official Bout Schedule & Match Sheet'}
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {filteredBouts.length} {lang === 'my' ? 'ပွဲ' : 'bouts'}
                </span>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse print:border print:border-slate-900">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider print:bg-slate-100 print:text-black print:border-b-2 print:border-black">
                      <th className="py-2.5 px-3"># Bout</th>
                      <th className="py-2.5 px-3 text-red-600 dark:text-red-400 print:text-black">🔴 Hong (Red Corner)</th>
                      <th className="py-2.5 px-3 text-blue-600 dark:text-blue-400 print:text-black">🔵 Chong (Blue Corner)</th>
                      <th className="py-2.5 px-2 text-center">Δ Weight</th>
                      <th className="py-2.5 px-3 text-center">Match Status / Winner</th>
                      <th className="py-2.5 px-2 text-center hidden print:table-cell">R1</th>
                      <th className="py-2.5 px-2 text-center hidden print:table-cell">R2</th>
                      <th className="py-2.5 px-2 text-center hidden print:table-cell">R3</th>
                      <th className="py-2.5 px-3 hidden print:table-cell">Judge Sign</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium print:divide-slate-900">
                    {filteredBouts.map((b, idx) => {
                      const p1 = b.player1Id ? playerMap.get(b.player1Id) : null;
                      const p2 = b.player2Id ? playerMap.get(b.player2Id) : null;
                      const w1 = p1 ? Number(p1.weight) : 0;
                      const w2 = p2 ? Number(p2.weight) : 0;
                      const delta = p1 && p2 ? Math.abs(w1 - w2).toFixed(1) : '0.0';

                      const outcome = p1 ? matchOutcomes.get(p1.id) : undefined;
                      const winnerPlayer = outcome?.winnerPlayerId
                        ? playerMap.get(outcome.winnerPlayerId)
                        : null;

                      return (
                        <tr
                          key={b.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors print:border-b print:border-slate-800"
                        >
                          {/* Bout # */}
                          <td className="py-3 px-3 font-black text-slate-800 dark:text-slate-200 print:text-black">
                            Bout {idx + 1}
                          </td>

                          {/* Hong (Red Corner) */}
                          <td className="py-3 px-3">
                            {p1 ? (
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white print:text-black">
                                  <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0 print:border print:border-black" />
                                  <span>{p1.name}</span>
                                  {winnerPlayer?.id === p1.id && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-extrabold text-[10px] print:border print:border-black">
                                      🥇 Winner
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-700 flex items-center gap-2">
                                  <span>{p1.weight}kg</span>
                                  <span>•</span>
                                  <span className="font-semibold">{p1.belt_color}</span>
                                  <span>•</span>
                                  <span className="truncate">{p1.club_name}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Unassigned</span>
                            )}
                          </td>

                          {/* Chong (Blue Corner) */}
                          <td className="py-3 px-3">
                            {p2 ? (
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white print:text-black">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 print:border print:border-black" />
                                  <span>{p2.name}</span>
                                  {winnerPlayer?.id === p2.id && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-extrabold text-[10px] print:border print:border-black">
                                      🥇 Winner
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-700 flex items-center gap-2">
                                  <span>{p2.weight}kg</span>
                                  <span>•</span>
                                  <span className="font-semibold">{p2.belt_color}</span>
                                  <span>•</span>
                                  <span className="truncate">{p2.club_name}</span>
                                </div>
                              </div>
                            ) : b.player1Id ? (
                              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 print:text-black font-bold">
                                <span>🛡️ BYE (တိုက်ရိုက်တက်)</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Unassigned</span>
                            )}
                          </td>

                          {/* Delta Weight */}
                          <td className="py-3 px-2 text-center font-mono text-xs">
                            {p1 && p2 ? (
                              <span
                                className={`px-2 py-0.5 rounded-md font-bold ${
                                  Number(delta) > 5
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 print:bg-transparent print:text-black'
                                    : 'text-slate-600 dark:text-slate-300 print:text-black'
                                }`}
                              >
                                {delta} kg
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          {/* Status / Winner */}
                          <td className="py-3 px-3 text-center">
                            {outcome?.isBye ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold print:border-black print:text-black">
                                🛡️ Bye Advanced
                              </span>
                            ) : winnerPlayer ? (
                              <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold flex items-center justify-center gap-1 print:border-black print:text-black">
                                <Trophy className="w-3 h-3 text-amber-500" />
                                <span>{winnerPlayer.name} Won</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold print:text-black">
                                ⏳ Ready to Fight
                              </span>
                            )}
                          </td>

                          {/* Print Only Score Box Columns */}
                          <td className="py-3 px-2 text-center hidden print:table-cell text-slate-400">____</td>
                          <td className="py-3 px-2 text-center hidden print:table-cell text-slate-400">____</td>
                          <td className="py-3 px-2 text-center hidden print:table-cell text-slate-400">____</td>
                          <td className="py-3 px-3 hidden print:table-cell text-slate-400">__________</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 2: Single Elimination Bracket Progression (Shown in 'both' or 'bracket') */}
          {(viewMode === 'both' || viewMode === 'bracket') && bracket && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 transition-colors print:break-before-page">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-100 dark:purple-950 text-purple-600 dark:text-purple-400">
                    <Trophy className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white print:text-black">
                    {lang === 'my' ? 'တိုက်ရိုက်ပြိုင်ပွဲ မဲခွဲပုံ (Tournament Elimination Bracket)' : 'Tournament Elimination Bracket'}
                  </h3>
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 print:text-black">
                  {bracket.rounds.length} {lang === 'my' ? 'အဆင့်' : 'Rounds'}
                </span>
              </div>

              {/* Bracket Tree Container */}
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-6 sm:gap-10 items-start min-w-[700px] justify-between p-2">
                  {bracket.rounds.map((round) => (
                    <div
                      key={round.roundIndex}
                      className="flex-1 flex flex-col space-y-5"
                    >
                      <div className="text-center pb-2 border-b border-slate-200 dark:border-slate-800 print:border-black">
                        <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 print:text-black">
                          {round.name}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-bold">
                          {round.matches.length} {round.matches.length === 1 ? 'Match' : 'Matches'}
                        </span>
                      </div>

                      <div className="flex flex-col justify-around flex-1 space-y-6">
                        {round.matches.map((match) => {
                          const p1 = match.participant1.player;
                          const p2 = match.participant2.player;
                          const p1IsWinner = match.winnerId === p1?.id;
                          const p2IsWinner = match.winnerId === p2?.id;

                          return (
                            <div
                              key={match.id}
                              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 shadow-xs overflow-hidden print:border-black print:bg-white"
                            >
                              {/* Match Header */}
                              <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900 text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between print:bg-slate-100 print:text-black">
                                <span>{match.id}</span>
                                {match.status === 'completed' && (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-black print:text-black">
                                    ✓ Decided
                                  </span>
                                )}
                              </div>

                              {/* Participant 1 (Hong / Red) */}
                              <div
                                className={`p-2.5 flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 print:border-black ${
                                  p1IsWinner ? 'bg-amber-50/80 dark:bg-amber-950/30 print:bg-slate-100' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p
                                      className={`text-xs truncate ${
                                        p1IsWinner
                                          ? 'font-black text-amber-900 dark:text-amber-200 print:text-black'
                                          : 'font-bold text-slate-800 dark:text-slate-200 print:text-black'
                                      }`}
                                    >
                                      {p1 ? p1.name : match.participant1.isBye ? 'BYE' : 'TBD'}
                                    </p>
                                    {p1 && (
                                      <p className="text-[10px] text-slate-400 print:text-slate-700 truncate">
                                        {p1.weight}kg • {p1.club_name}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {p1IsWinner && (
                                  <Trophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                )}
                              </div>

                              {/* Participant 2 (Chong / Blue) */}
                              <div
                                className={`p-2.5 flex items-center justify-between gap-2 ${
                                  p2IsWinner ? 'bg-amber-50/80 dark:bg-amber-950/30 print:bg-slate-100' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p
                                      className={`text-xs truncate ${
                                        p2IsWinner
                                          ? 'font-black text-amber-900 dark:text-amber-200 print:text-black'
                                          : 'font-bold text-slate-800 dark:text-slate-200 print:text-black'
                                      }`}
                                    >
                                      {p2 ? p2.name : match.participant2.isBye ? 'BYE (Advanced)' : 'TBD'}
                                    </p>
                                    {p2 && (
                                      <p className="text-[10px] text-slate-400 print:text-slate-700 truncate">
                                        {p2.weight}kg • {p2.club_name}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {p2IsWinner && (
                                  <Trophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Official Tournament Sign-Off Box (Always visible at bottom & when printing) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 print:border-black print:bg-white">
            <h4 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider print:text-black">
              {lang === 'my' ? 'တရားဝင် အတည်ပြုချက်နှင့် လက်မှတ်များ' : 'Official Verification & Sign-Off'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 print:text-black">
                  {lang === 'my' ? 'ခုံသမာဓိ ဒိုင်လူကြီး လက်မှတ်' : 'Chief Referee Signature'}
                </p>
                <div className="border-b border-slate-400 dark:border-slate-600 print:border-black h-10" />
                <p className="text-[10px] text-slate-400 print:text-black">Name: ________________________</p>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 print:text-black">
                  {lang === 'my' ? 'ပြိုင်ပွဲကျင်းပရေး ကော်မတီ လက်မှတ်' : 'Tournament Director Signature'}
                </p>
                <div className="border-b border-slate-400 dark:border-slate-600 print:border-black h-10" />
                <p className="text-[10px] text-slate-400 print:text-black">Name: ________________________</p>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 print:text-black">
                  {lang === 'my' ? 'ရက်စွဲနှင့် တရားဝင် တံဆိပ်တုံး' : 'Date & Official Seal'}
                </p>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 print:border-black rounded-xl h-16 flex items-center justify-center text-[10px] text-slate-400 print:text-black">
                  {lang === 'my' ? '[ တရားဝင် တံဆိပ်တုံး ]' : '[ Official Seal Here ]'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
