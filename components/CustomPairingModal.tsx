'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Player } from '@/types/player';
import { CustomBoutPair } from '@/types/bracket';
import { Language, Translations } from '@/lib/translations';
import { calculateAge, getBeltStyle } from '@/lib/taekwondo';
import {
  X,
  Swords,
  Plus,
  Trash2,
  ArrowLeftRight,
  Scale,
  Sparkles,
  Shield,
  RotateCcw
} from 'lucide-react';

interface CustomPairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  initialCustomPairs?: CustomBoutPair[];
  initialDivisionName?: string;
  onApplyCustomPairing: (pairs: CustomBoutPair[], divisionName: string) => void;
  t: Translations;
  lang: Language;
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

export const CustomPairingModal: React.FC<CustomPairingModalProps> = ({
  isOpen,
  onClose,
  players,
  initialCustomPairs,
  initialDivisionName,
  onApplyCustomPairing,
  t,
  lang
}) => {
  const [divisionTitle, setDivisionTitle] = useState(
    initialDivisionName || (lang === 'my' ? 'စိတ်ကြိုက် တွဲဆိုင်း ပွဲစဉ်များ' : 'Custom Exhibition Matchups')
  );

  const [bouts, setBouts] = useState<CustomBoutPair[]>([]);

  // Initialize bouts when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialCustomPairs && initialCustomPairs.length > 0) {
        setBouts(initialCustomPairs);
      } else {
        // Default to 4 bouts (8-player bracket) or 2 bouts if few players
        const defaultBoutCount = players.length >= 8 ? 4 : players.length >= 4 ? 2 : 1;
        const initialList: CustomBoutPair[] = [];
        for (let i = 0; i < defaultBoutCount; i++) {
          initialList.push({
            id: `bout-${i + 1}`,
            player1Id: null,
            player2Id: null
          });
        }
        setBouts(initialList);
      }
      if (initialDivisionName) {
        setDivisionTitle(initialDivisionName);
      }
    }
  }, [isOpen, initialCustomPairs, initialDivisionName, players.length, lang]);

  // Map players by ID for fast lookup
  const playerMap = useMemo(() => {
    const map = new Map<string, Player>();
    players.forEach((p) => map.set(p.id, p));
    return map;
  }, [players]);

  // Set of all selected player IDs across bouts to prevent duplicates
  const selectedPlayerIds = useMemo(() => {
    const set = new Set<string>();
    bouts.forEach((b) => {
      if (b.player1Id) set.add(b.player1Id);
      if (b.player2Id) set.add(b.player2Id);
    });
    return set;
  }, [bouts]);

  if (!isOpen) return null;

  // Add a new empty bout
  const handleAddBout = () => {
    const nextId = `bout-${Date.now()}`;
    setBouts((prev) => [...prev, { id: nextId, player1Id: null, player2Id: null }]);
  };

  // Remove a bout
  const handleRemoveBout = (index: number) => {
    if (bouts.length <= 1) return;
    setBouts((prev) => prev.filter((_, i) => i !== index));
  };

  // Change a fighter in a bout
  const handleFighterChange = (boutIndex: number, corner: 'player1Id' | 'player2Id', playerId: string | null) => {
    setBouts((prev) => {
      const updated = [...prev];
      updated[boutIndex] = {
        ...updated[boutIndex],
        [corner]: playerId === '' || playerId === 'BYE' ? null : playerId
      };
      return updated;
    });
  };

  // Swap Red and Blue fighters in a bout
  const handleSwapCorners = (boutIndex: number) => {
    setBouts((prev) => {
      const updated = [...prev];
      const bout = updated[boutIndex];
      updated[boutIndex] = {
        ...bout,
        player1Id: bout.player2Id,
        player2Id: bout.player1Id
      };
      return updated;
    });
  };

  // Preset bout counts (1, 2, 4, 8 bouts)
  const handleSetBoutCount = (count: number) => {
    setBouts((prev) => {
      if (prev.length === count) return prev;
      if (prev.length < count) {
        const next = [...prev];
        while (next.length < count) {
          next.push({ id: `bout-${next.length + 1}-${Date.now()}`, player1Id: null, player2Id: null });
        }
        return next;
      } else {
        return prev.slice(0, count);
      }
    });
  };

  // Smart Auto-Pairing by Closest Weight
  const handleAutoPairByWeight = () => {
    const sorted = [...players].sort((a, b) => Number(a.weight) - Number(b.weight));
    const newBouts: CustomBoutPair[] = [];
    const boutCount = Math.max(bouts.length, Math.ceil(sorted.length / 2));

    let pIdx = 0;
    for (let i = 0; i < boutCount; i++) {
      const p1 = sorted[pIdx++] ?? null;
      const p2 = sorted[pIdx++] ?? null;
      newBouts.push({
        id: `bout-${i + 1}`,
        player1Id: p1 ? p1.id : null,
        player2Id: p2 ? p2.id : null
      });
    }

    setBouts(newBouts);
  };

  // Smart Auto-Pairing by Belt Rank
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

    const newBouts: CustomBoutPair[] = [];
    const boutCount = Math.max(bouts.length, Math.ceil(sorted.length / 2));

    let pIdx = 0;
    for (let i = 0; i < boutCount; i++) {
      const p1 = sorted[pIdx++] ?? null;
      const p2 = sorted[pIdx++] ?? null;
      newBouts.push({
        id: `bout-${i + 1}`,
        player1Id: p1 ? p1.id : null,
        player2Id: p2 ? p2.id : null
      });
    }

    setBouts(newBouts);
  };

  // Clear all bouts
  const handleClearAll = () => {
    setBouts((prev) =>
      prev.map((b) => ({
        ...b,
        player1Id: null,
        player2Id: null
      }))
    );
  };

  // Validation: count total assigned fighters
  const totalAssignedFighters = bouts.reduce((acc, b) => {
    return acc + (b.player1Id ? 1 : 0) + (b.player2Id ? 1 : 0);
  }, 0);

  const handleApply = () => {
    if (totalAssignedFighters < 2) {
      alert(
        lang === 'my'
          ? 'တွဲဆိုင်း အတည်ပြုရန် အနည်းဆုံး ကစားသမား ၂ ဦး ရွေးချယ်ပေးပါ'
          : 'Please pair at least 2 athletes to generate a tournament bracket.'
      );
      return;
    }

    // Filter out bouts that are completely empty (both fighters null)
    const validBouts = bouts.filter((b) => b.player1Id !== null || b.player2Id !== null);
    if (validBouts.length === 0) return;

    onApplyCustomPairing(validBouts, divisionTitle.trim() || 'Custom Matchups');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/90 flex items-start justify-between gap-3 bg-gradient-to-r from-red-50/50 via-slate-50/30 to-transparent dark:from-red-950/20 dark:via-slate-900 dark:to-transparent flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-600 text-white shadow-sm shadow-red-500/30">
                <Swords className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  {t.customPairingTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.customPairingSubtitle}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Custom Division Name & Quick Assist Buttons */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Custom Division Title Input */}
            <div className="md:col-span-6 space-y-1">
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                {t.divisionTitleLabel}
              </label>
              <input
                type="text"
                value={divisionTitle}
                onChange={(e) => setDivisionTitle(e.target.value)}
                placeholder={lang === 'my' ? 'ဥပမာ- ၅၀ ကီလို စိတ်ကြိုက်ပြိုင်ပွဲ' : 'e.g. Open Exhibition 50kg'}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
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
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Helper Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleAutoPairByWeight}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 text-xs font-bold transition-colors shadow-2xs"
              >
                <Scale className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.autoPairWeight}</span>
              </button>

              <button
                type="button"
                onClick={handleAutoPairByBelt}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 text-xs font-bold transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>{t.autoPairBelt}</span>
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-red-600 text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.clearBouts}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddBout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addBout}</span>
            </button>
          </div>
        </div>

        {/* Bouts List (Scrollable Area) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
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
                className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm space-y-3 transition-all"
              >
                {/* Bout Header */}
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
                        <span>
                          Δ {weightDiff} kg {isWeightGapHigh ? '(Large Gap)' : '(Close)'}
                        </span>
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

                {/* Matchup Grid: Red Corner vs Blue Corner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                  {/* Red Corner (HONG) */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border-l-4 border-l-red-500 border border-slate-200 dark:border-slate-800 space-y-2">
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
                        const beltName = lang === 'my' && BURMESE_BELTS[p.belt_color] ? BURMESE_BELTS[p.belt_color] : p.belt_color;
                        return (
                          <option key={p.id} value={p.id} disabled={isTaken}>
                            {p.name} ({p.weight}kg, {beltName}, {p.club_name}) {isTaken ? '— [Paired elsewhere]' : ''}
                          </option>
                        );
                      })}
                    </select>

                    {/* Fighter quick info badge */}
                    {p1 && p1Belt && (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                        <span className="font-medium">{p1.club_name}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${p1Belt.badgeBg} ${p1Belt.badgeText}`}
                          >
                            {lang === 'my' && BURMESE_BELTS[p1.belt_color] ? BURMESE_BELTS[p1.belt_color] : p1.belt_color}
                          </span>
                          <span>{calculateAge(p1.date_of_birth)} {t.years}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Blue Corner (CHONG) */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border-l-4 border-l-blue-500 border border-slate-200 dark:border-slate-800 space-y-2">
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
                        const beltName = lang === 'my' && BURMESE_BELTS[p.belt_color] ? BURMESE_BELTS[p.belt_color] : p.belt_color;
                        return (
                          <option key={p.id} value={p.id} disabled={isTaken}>
                            {p.name} ({p.weight}kg, {beltName}, {p.club_name}) {isTaken ? '— [Paired elsewhere]' : ''}
                          </option>
                        );
                      })}
                    </select>

                    {/* Fighter quick info badge */}
                    {p2 && p2Belt ? (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                        <span className="font-medium">{p2.club_name}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${p2Belt.badgeBg} ${p2Belt.badgeText}`}
                          >
                            {lang === 'my' && BURMESE_BELTS[p2.belt_color] ? BURMESE_BELTS[p2.belt_color] : p2.belt_color}
                          </span>
                          <span>{calculateAge(p2.date_of_birth)} {t.years}</span>
                        </div>
                      </div>
                    ) : (
                      bout.player2Id === null && bout.player1Id ? (
                        <div className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                          {lang === 'my' ? 'Red Fighter အလိုအလျောက် နောက်တစ်ဆင့် တက်ရောက်မည်' : 'Red fighter will automatically advance to Round 2'}
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <Shield className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>
              {lang === 'my'
                ? `ကစားသမား ${totalAssignedFighters} ဦး / တွဲဆိုင်း ${bouts.length} ပွဲ ရွေးချယ်ပြီး`
                : `${totalAssignedFighters} athletes paired across ${bouts.length} bouts`}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              {t.cancel}
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={totalAssignedFighters < 2}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
            >
              <Swords className="w-4 h-4" />
              <span>{t.applyCustomPairing}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
