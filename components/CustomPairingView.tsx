'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Player } from '@/types/player';
import { BracketData, BracketMatch, CustomBoutPair } from '@/types/bracket';
import { Language, Translations } from '@/lib/translations';
import { calculateAge, getBeltStyle, matchAgeDivision } from '@/lib/taekwondo';
import {
  generateSingleEliminationBracket,
  advanceBracketWinner
} from '@/lib/bracket';
import confetti from 'canvas-confetti';
import {
  Swords,
  Scale,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  ArrowLeftRight,
  Printer,
  FileSpreadsheet,
  Trophy
} from 'lucide-react';

interface CustomPairingViewProps {
  players: Player[];
  lang: Language;
  t: Translations;
  initialPairs?: CustomBoutPair[];
  initialTitle?: string;
  onOpenAddModal?: () => void;
}

const BURMESE_BELTS: Record<string, string> = {
  White: 'အဖြူ',
  Yellow: 'အဝါ',
  Green: 'အစိမ်း',
  Blue: 'အပြာ',
  Red: 'အနီ',
  Brown: 'အညို',
  Poom: 'ပူးမ်',
  Black: 'အနက်'
};

export const CustomPairingView: React.FC<CustomPairingViewProps> = ({
  players,
  lang,
  t,
  initialPairs,
  initialTitle
}) => {
  const [divisionTitle, setDivisionTitle] = useState(
    initialTitle || (lang === 'my' ? 'စိတ်ကြိုက် တွဲဆိုင်း ပွဲစဉ်များ' : 'Custom Exhibition Matchups')
  );

  const [bouts, setBouts] = useState<CustomBoutPair[]>([]);
  const [bracket, setBracket] = useState<BracketData | null>(null);

  // Map players by ID for fast lookup
  const playerMap = useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  // Generate bracket automatically when bouts change (if at least 2 fighters assigned)
  const syncBracketFromBouts = useCallback(
    (currentBouts: CustomBoutPair[], currentTitle: string) => {
      const validBouts = currentBouts.filter((b) => b.player1Id !== null || b.player2Id !== null);
      const assignedCount = currentBouts.reduce(
        (acc, b) => acc + (b.player1Id ? 1 : 0) + (b.player2Id ? 1 : 0),
        0
      );

      if (assignedCount >= 2 && validBouts.length > 0) {
        try {
          const b = generateSingleEliminationBracket(
            players,
            currentTitle.trim() || 'Custom Matchups',
            'custom',
            lang,
            validBouts
          );
          setBracket(b);
          localStorage.setItem(
            'tkd_custom_pairing',
            JSON.stringify({ pairs: currentBouts, divisionName: currentTitle })
          );
        } catch {
          // ignore
        }
      } else {
        setBracket(null);
      }
    },
    [players, lang]
  );

  // Load initialPairs or saved custom pairing from localStorage on mount
  useEffect(() => {
    if (initialPairs && initialPairs.length > 0) {
      setBouts(initialPairs);
      if (initialTitle) setDivisionTitle(initialTitle);
      syncBracketFromBouts(initialPairs, initialTitle || divisionTitle);
      return;
    }

    try {
      const saved = localStorage.getItem('tkd_custom_pairing');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pairs && Array.isArray(parsed.pairs) && parsed.pairs.length > 0) {
          setBouts(parsed.pairs);
          if (parsed.divisionName) setDivisionTitle(parsed.divisionName);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Default to 4 bouts (8 fighters) or 2 bouts
    const defaultCount = players.length >= 8 ? 4 : players.length >= 4 ? 2 : 1;
    const initialList: CustomBoutPair[] = [];
    for (let i = 0; i < defaultCount; i++) {
      initialList.push({ id: `bout-${i + 1}`, player1Id: null, player2Id: null });
    }
    setBouts(initialList);
  }, [initialPairs, initialTitle, players.length, syncBracketFromBouts, divisionTitle]);

  // Sync on initial load
  useEffect(() => {
    if (bouts.length > 0 && !bracket) {
      syncBracketFromBouts(bouts, divisionTitle);
    }
  }, [bouts, divisionTitle, bracket, syncBracketFromBouts]);

  // Selected player IDs across bouts
  const selectedPlayerIds = useMemo(() => {
    const set = new Set<string>();
    bouts.forEach((b) => {
      if (b.player1Id) set.add(b.player1Id);
      if (b.player2Id) set.add(b.player2Id);
    });
    return set;
  }, [bouts]);

  // Add Bout
  const handleAddBout = () => {
    const next = [...bouts, { id: `bout-${Date.now()}`, player1Id: null, player2Id: null }];
    setBouts(next);
    syncBracketFromBouts(next, divisionTitle);
  };

  // Remove Bout
  const handleRemoveBout = (index: number) => {
    if (bouts.length <= 1) return;
    const next = bouts.filter((_, i) => i !== index);
    setBouts(next);
    syncBracketFromBouts(next, divisionTitle);
  };

  // Change Fighter
  const handleFighterChange = (boutIndex: number, corner: 'player1Id' | 'player2Id', playerId: string | null) => {
    const next = [...bouts];
    next[boutIndex] = {
      ...next[boutIndex],
      [corner]: playerId === '' || playerId === 'BYE' ? null : playerId
    };
    setBouts(next);
    syncBracketFromBouts(next, divisionTitle);
  };

  // Swap Corners
  const handleSwapCorners = (boutIndex: number) => {
    const next = [...bouts];
    const bout = next[boutIndex];
    next[boutIndex] = {
      ...bout,
      player1Id: bout.player2Id,
      player2Id: bout.player1Id
    };
    setBouts(next);
    syncBracketFromBouts(next, divisionTitle);
  };

  // Set Bout Count
  const handleSetBoutCount = (count: number) => {
    let next: CustomBoutPair[] = [];
    if (bouts.length < count) {
      next = [...bouts];
      while (next.length < count) {
        next.push({ id: `bout-${next.length + 1}-${Date.now()}`, player1Id: null, player2Id: null });
      }
    } else {
      next = bouts.slice(0, count);
    }
    setBouts(next);
    syncBracketFromBouts(next, divisionTitle);
  };

  // Auto-Pair by Closest Weight
  const handleAutoPairByWeight = () => {
    const sorted = [...players].sort((a, b) => Number(a.weight) - Number(b.weight));
    const count = Math.max(bouts.length, Math.ceil(sorted.length / 2));
    const next: CustomBoutPair[] = [];

    let pIdx = 0;
    for (let i = 0; i < count; i++) {
      const p1 = sorted[pIdx++] ?? null;
      const p2 = sorted[pIdx++] ?? null;
      next.push({
        id: `bout-${i + 1}`,
        player1Id: p1 ? p1.id : null,
        player2Id: p2 ? p2.id : null
      });
    }

    setBouts(next);
    syncBracketFromBouts(next, divisionTitle);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
  };

  // Auto-Pair by Belt Rank
  const handleAutoPairByBelt = () => {
    const rankOrder: Record<string, number> = {
      Black: 8,
      Poom: 7,
      Brown: 6,
      Red: 5,
      Blue: 4,
      Green: 3,
      Yellow: 2,
      White: 1
    };

    const sorted = [...players].sort((a, b) => {
      const rA = rankOrder[a.belt_color] || 0;
      const rB = rankOrder[b.belt_color] || 0;
      if (rA !== rB) return rB - rA;
      return Number(b.weight) - Number(a.weight);
    });

    const count = Math.max(bouts.length, Math.ceil(sorted.length / 2));
    const next: CustomBoutPair[] = [];

    let pIdx = 0;
    for (let i = 0; i < count; i++) {
      const p1 = sorted[pIdx++] ?? null;
      const p2 = sorted[pIdx++] ?? null;
      next.push({
        id: `bout-${i + 1}`,
        player1Id: p1 ? p1.id : null,
        player2Id: p2 ? p2.id : null
      });
    }

    setBouts(next);
    syncBracketFromBouts(next, divisionTitle);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
  };

  // Quick helper to load an entire division into custom bouts
  const handleLoadDivisionBouts = (divName: string) => {
    if (!divName) return;
    const matched = players.filter((p) => matchAgeDivision(divName, p.date_of_birth));
    if (matched.length === 0) return;

    const sorted = [...matched].sort((a, b) => Number(a.weight) - Number(b.weight));
    const newBouts: CustomBoutPair[] = [];
    let pIdx = 0;
    let bIdx = 1;
    while (pIdx < sorted.length) {
      const p1 = sorted[pIdx++];
      const p2 = pIdx < sorted.length ? sorted[pIdx++] : null;
      newBouts.push({
        id: `bout-${bIdx++}`,
        player1Id: p1.id,
        player2Id: p2 ? p2.id : null
      });
    }

    const newTitle =
      lang === 'my' ? `${divName} စိတ်ကြိုက်တွဲဆိုင်း ပွဲစဉ်များ` : `${divName} Division Matchups`;
    setDivisionTitle(newTitle);
    setBouts(newBouts);
    syncBracketFromBouts(newBouts, newTitle);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  // Clear All
  const handleClearAll = () => {
    const next = bouts.map((b) => ({ ...b, player1Id: null, player2Id: null }));
    setBouts(next);
    setBracket(null);
    try {
      localStorage.removeItem('tkd_custom_pairing');
    } catch {
      // ignore
    }
  };

  // Pick Winner in Bracket
  const handlePickWinner = (match: BracketMatch, winnerPlayerId: string) => {
    if (!bracket) return;
    const updated = advanceBracketWinner(bracket, match.id, winnerPlayerId);
    setBracket(updated);
    if (updated.champion && updated.champion.id === winnerPlayerId) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Reset all match outcomes in bracket
  const handleResetMatches = () => {
    if (
      window.confirm(
        lang === 'my'
          ? 'ပွဲစဉ်ရလဒ်များအားလုံးကို အစမှ ပြန်လည်စတင်ရန် သေချာပါသလား?'
          : 'Reset all match outcomes in this custom bracket?'
      )
    ) {
      syncBracketFromBouts(bouts, divisionTitle);
    }
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Export CSV
  const handleExportCsv = () => {
    if (!bracket) return;
    const headers = [
      'Bout #',
      'Event / Division',
      'Hong (Red Corner)',
      'Hong Weight (kg)',
      'Hong Belt',
      'Hong Club',
      'Chong (Blue Corner)',
      'Chong Weight (kg)',
      'Chong Belt',
      'Chong Club',
      'Match Type'
    ];

    const r1Matches = bracket.rounds[0]?.matches || [];
    const rows = r1Matches.map((m, idx) => {
      const p1 = m.participant1.player;
      const p2 = m.participant2.player;
      return [
        `"Bout ${idx + 1}"`,
        `"${bracket.divisionName}"`,
        `"${p1?.name || (m.participant1.isBye ? 'BYE' : 'TBD')}"`,
        `"${p1?.weight || ''}"`,
        `"${p1?.belt_color || ''}"`,
        `"${p1?.club_name || ''}"`,
        `"${p2?.name || (m.participant2.isBye ? 'BYE' : 'TBD')}"`,
        `"${p2?.weight || ''}"`,
        `"${p2?.belt_color || ''}"`,
        `"${p2?.club_name || ''}"`,
        `"${m.isByeMatch ? 'BYE Auto-Advance' : 'Contested Bout'}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tkd_custom_pairings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAssignedFighters = bouts.reduce((acc, b) => {
    return acc + (b.player1Id ? 1 : 0) + (b.player2Id ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-4 print:space-y-3">
      {/* Top Header & Quick Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-500/20">
              <Swords className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-2">
                <span>{lang === 'my' ? 'စိတ်ကြိုက်တွဲဆိုင်း သတ်မှတ်ခြင်း' : 'Custom Match & Bracket Pairing'}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                  {totalAssignedFighters} {lang === 'my' ? 'ဦး ရွေးချယ်ပြီး' : 'fighters paired'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'my'
                  ? 'ကစားသမားအားလုံးထဲမှ မည်သည့် ဝိတ်တန်း၊ ခါးပတ်နှင့် အသက်အရွယ်မဆို မိမိစိတ်ကြိုက် တွဲပေးနိုင်ပါသည်။'
                  : 'Hand-pick match pairings across any athletes, belts, or weight categories.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handlePrint}
              disabled={!bracket}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors disabled:opacity-50"
              title="Print Official Fight Sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'my' ? 'ပရင့်ထုတ်မည်' : 'Print Sheet'}</span>
            </button>

            <button
              onClick={handleExportCsv}
              disabled={!bracket}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors disabled:opacity-50"
              title="Export CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleResetMatches}
              disabled={!bracket}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors disabled:opacity-50"
              title="Reset Matches"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'my' ? 'ပြန်စမည်' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Configuration Row: Event Title, Bout Presets & Smart Helpers */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Division Title Input */}
            <div className="md:col-span-6 space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                {lang === 'my' ? 'စိတ်ကြိုက် ပြိုင်ပွဲ / ဝိတ်တန်း အမည်' : 'Event / Matchup Title'}
              </label>
              <input
                type="text"
                value={divisionTitle}
                onChange={(e) => {
                  setDivisionTitle(e.target.value);
                  syncBracketFromBouts(bouts, e.target.value);
                }}
                placeholder={lang === 'my' ? 'ဥပမာ- ၅၀ ကီလို စိတ်ကြိုက်ပြိုင်ပွဲ' : 'e.g. Open Exhibition 50kg'}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
            </div>

            {/* Quick Bout Presets */}
            <div className="md:col-span-6 space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                {lang === 'my' ? 'တွဲဆိုင်း အရေအတွက် သတ်မှတ်ရန်' : 'Bout Presets (Bracket Size)'}
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: '1 Bout (2)', count: 1 },
                  { label: '2 Bouts (4)', count: 2 },
                  { label: '4 Bouts (8)', count: 4 },
                  { label: '8 Bouts (16)', count: 8 }
                ].map((item) => (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => handleSetBoutCount(item.count)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      bouts.length === item.count
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Auto-Assist Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleAutoPairByWeight}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 text-xs font-bold transition-colors shadow-2xs"
              >
                <Scale className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.autoPairWeight}</span>
              </button>

              <button
                type="button"
                onClick={handleAutoPairByBelt}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 text-xs font-bold transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>{t.autoPairBelt}</span>
              </button>

              {/* Load Division Preset */}
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {lang === 'my' ? '🥋 အသက်တန်း တွဲဆိုင်း:' : '🥋 Load Division:'}
                </span>
                <select
                  onChange={(e) => {
                    handleLoadDivisionBouts(e.target.value);
                    e.target.value = '';
                  }}
                  defaultValue=""
                  className="bg-transparent text-xs font-bold text-purple-600 dark:text-purple-400 focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    {lang === 'my' ? '-- ရွေးချယ်ပါ --' : '-- Choose --'}
                  </option>
                  <option value="U8">U8 (4 athletes)</option>
                  <option value="U10">U10 (5 athletes)</option>
                  <option value="U12">U12 (3 athletes)</option>
                  <option value="U14">U14 (4 athletes)</option>
                  <option value="U16">U16 (5 athletes)</option>
                  <option value="U18">U18 (2 athletes)</option>
                  <option value="Over 18">Over 18 (11 athletes)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-red-600 text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.clearBouts}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddBout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addBout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bouts List: Interactive Hong vs Chong Matcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase flex items-center gap-2">
            <span>{lang === 'my' ? 'တွဲဆိုင်းများ စီစဉ်ရန်' : 'Configure Bout Matchups'}</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {bouts.length} {lang === 'my' ? 'တွဲဆိုင်း' : 'bouts'}
            </span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            {lang === 'my' ? 'အနီထောင့် (ဟုန်း) နှင့် အပြာထောင့် (ချုန်း) ရွေးချယ်ပါ' : 'Pick Hong (Red) and Chong (Blue) for each bout'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {bouts.map((bout, idx) => {
            const p1 = bout.player1Id ? playerMap.get(bout.player1Id) : null;
            const p2 = bout.player2Id ? playerMap.get(bout.player2Id) : null;

            const p1Belt = p1 ? getBeltStyle(p1.belt_color) : null;
            const p2Belt = p2 ? getBeltStyle(p2.belt_color) : null;

            const weightDiff =
              p1 && p2 ? Math.abs(Number(p1.weight) - Number(p2.weight)).toFixed(1) : null;
            const isWeightGapHigh = weightDiff !== null && parseFloat(weightDiff) > 5.0;

            const sameClub =
              p1 && p2 && p1.club_name && p2.club_name && p1.club_name.toLowerCase() === p2.club_name.toLowerCase();

            return (
              <div
                key={bout.id || idx}
                className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm space-y-2.5 transition-all"
              >
                {/* Bout Title & Analysis Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-black">
                      {t.boutLabel(idx + 1)}
                    </span>
                    {weightDiff !== null && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                          isWeightGapHigh
                            ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        <Scale className="w-3 h-3" />
                        <span>Δ {weightDiff} kg {isWeightGapHigh ? '(Gap)' : '(Close)'}</span>
                      </span>
                    )}
                    {sameClub && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                        🛡️ Same Club ({p1?.club_name})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSwapCorners(idx)}
                      title={t.swapCorners}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                    {bouts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBout(idx)}
                        title={t.removeBout}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Matchup Grid: Red vs Blue Corners */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                  {/* Red Corner (HONG) */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border-l-4 border-l-red-500 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                        {t.redFighter}
                      </span>
                      {p1 && (
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {Number(p1.weight).toFixed(1)} kg
                        </span>
                      )}
                    </div>

                    <select
                      value={bout.player1Id || ''}
                      onChange={(e) => handleFighterChange(idx, 'player1Id', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="">{t.selectFighter}</option>
                      {players.map((p) => {
                        const isTaken = selectedPlayerIds.has(p.id) && bout.player1Id !== p.id;
                        const beltName =
                          lang === 'my' && BURMESE_BELTS[p.belt_color] ? BURMESE_BELTS[p.belt_color] : p.belt_color;
                        return (
                          <option key={p.id} value={p.id} disabled={isTaken}>
                            {p.name} ({p.weight}kg, {beltName}, {p.club_name}) {isTaken ? '— [Paired elsewhere]' : ''}
                          </option>
                        );
                      })}
                    </select>

                    {/* Quick Specs */}
                    {p1 && p1Belt && (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                        <span className="font-medium truncate">{p1.club_name}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${p1Belt.badgeBg} ${p1Belt.badgeText}`}
                          >
                            {lang === 'my' && BURMESE_BELTS[p1.belt_color] ? BURMESE_BELTS[p1.belt_color] : p1.belt_color}
                          </span>
                          <span>{calculateAge(p1.date_of_birth)} {t.years}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Blue Corner (CHONG) */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border-l-4 border-l-blue-500 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                        {t.blueFighter}
                      </span>
                      {p2 ? (
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {Number(p2.weight).toFixed(1)} kg
                        </span>
                      ) : (
                        bout.player2Id === null && bout.player1Id ? (
                          <span className="text-amber-500 font-bold text-[10px]">BYE (Pass)</span>
                        ) : null
                      )}
                    </div>

                    <select
                      value={bout.player2Id === null && bout.player1Id ? 'BYE' : bout.player2Id || ''}
                      onChange={(e) => handleFighterChange(idx, 'player2Id', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">{t.selectFighter}</option>
                      <option value="BYE" className="text-amber-600 font-bold">
                        {t.byeOption}
                      </option>
                      {players.map((p) => {
                        const isTaken = selectedPlayerIds.has(p.id) && bout.player2Id !== p.id;
                        const beltName =
                          lang === 'my' && BURMESE_BELTS[p.belt_color] ? BURMESE_BELTS[p.belt_color] : p.belt_color;
                        return (
                          <option key={p.id} value={p.id} disabled={isTaken}>
                            {p.name} ({p.weight}kg, {beltName}, {p.club_name}) {isTaken ? '— [Paired elsewhere]' : ''}
                          </option>
                        );
                      })}
                    </select>

                    {/* Quick Specs */}
                    {p2 && p2Belt ? (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                        <span className="font-medium truncate">{p2.club_name}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${p2Belt.badgeBg} ${p2Belt.badgeText}`}
                          >
                            {lang === 'my' && BURMESE_BELTS[p2.belt_color] ? BURMESE_BELTS[p2.belt_color] : p2.belt_color}
                          </span>
                          <span>{calculateAge(p2.date_of_birth)} {t.years}</span>
                        </div>
                      </div>
                    ) : (
                      bout.player2Id === null && bout.player1Id ? (
                        <div className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                          {lang === 'my' ? 'Red Fighter အလိုအလျောက် နောက်တစ်ဆင့် တက်ရောက်မည်' : 'Red fighter will automatically advance on BYE'}
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Bracket & Progression Tree */}
      {bracket && (
        <div className="space-y-4">
          {/* Championship Podium Card (Shown when Final is completed) */}
          {bracket.champion && (
            <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-amber-500/5 border border-amber-400/40 dark:border-amber-500/30 p-6 sm:p-8 shadow-xl text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-widest">
                <Trophy className="w-4 h-4 text-amber-500" />
                Tournament Podium & Winners
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase">
                {bracket.divisionName}
              </h3>
              <div className="inline-block p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 shadow-md">
                <div className="text-xs font-bold text-amber-600 uppercase">🏆 Gold Champion</div>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{bracket.champion.name}</div>
                <div className="text-xs text-slate-500">{bracket.champion.club_name} • {bracket.champion.weight}kg</div>
              </div>
            </div>
          )}

          {/* Interactive Bracket Rounds */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto">
            <div className="min-w-[650px]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-6">
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-white uppercase flex items-center gap-2">
                    <span>{bracket.divisionName}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      Single Elimination
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.selectedAthletesCount(bracket.totalCompetitors, bracket.byeCount)}
                  </p>
                </div>
              </div>

              {/* Rounds Flow */}
              <div className="grid grid-flow-col auto-cols-[280px] gap-6">
                {bracket.rounds.map((round) => {
                  return (
                    <div key={round.roundIndex} className="space-y-4">
                      {/* Round Header */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center font-black text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                        {round.name}
                      </div>

                      {/* Matches in Round */}
                      <div className="flex flex-col justify-around h-full gap-4">
                        {round.matches.map((match) => {
                          const isByeAdvanced = match.status === 'bye_advanced';

                          return (
                            <div
                              key={match.id}
                              className="bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 shadow-xs space-y-2 relative"
                            >
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                <span>{match.id}</span>
                                {isByeAdvanced && (
                                  <span className="text-[10px] text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                                    BYE PASS
                                  </span>
                                )}
                              </div>

                              {/* Participant 1: Hong (Red) */}
                              <div
                                onClick={() => {
                                  if (!isByeAdvanced && match.participant1.player && match.participant2.player && match.status !== 'completed') {
                                    handlePickWinner(match, match.participant1.player.id);
                                  }
                                }}
                                className={`p-2 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                                  match.winnerId === match.participant1.player?.id
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 font-black'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-500 text-white">
                                    HONG
                                  </span>
                                  <span className="font-bold text-slate-900 dark:text-white truncate">
                                    {match.participant1.player?.name || (match.participant1.isBye ? 'BYE' : 'TBD')}
                                  </span>
                                </div>
                                {match.winnerId === match.participant1.player?.id && (
                                  <span className="text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                                    WIN
                                  </span>
                                )}
                              </div>

                              {/* Participant 2: Chong (Blue) */}
                              <div
                                onClick={() => {
                                  if (!isByeAdvanced && match.participant1.player && match.participant2.player && match.status !== 'completed') {
                                    handlePickWinner(match, match.participant2.player.id);
                                  }
                                }}
                                className={`p-2 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                                  match.winnerId === match.participant2.player?.id
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 font-black'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-600 text-white">
                                    CHONG
                                  </span>
                                  <span className="font-bold text-slate-900 dark:text-white truncate">
                                    {match.participant2.player?.name || (match.participant2.isBye ? 'BYE' : 'TBD')}
                                  </span>
                                </div>
                                {match.winnerId === match.participant2.player?.id && (
                                  <span className="text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                                    WIN
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helper text if not enough athletes */}
      {totalAssignedFighters < 2 && (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Swords className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
            {lang === 'my' ? 'တွဲဆိုင်းစတင်ရန် ကစားသမား အနည်းဆုံး ၂ ဦး ရွေးချယ်ပါ' : 'Select at least 2 athletes to generate custom matches'}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {lang === 'my'
              ? 'အထက်ပါ တွဲဆိုင်းများတွင် ကစားသမားများကို ရွေးချယ်ပါ သို့မဟုတ် "ဝိတ်အနီးစပ်ဆုံး အလိုအလျောက်တွဲမည်" ခလုတ်ကို နှိပ်ပါ။'
              : 'Pick competitors in the bouts above or click "Auto-Pair by Closest Weight" to quickly match fighters.'}
          </p>
        </div>
      )}
    </div>
  );
};
