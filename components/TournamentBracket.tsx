'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Player } from '@/types/player';
import { BracketData, BracketMatch, DrawMode } from '@/types/bracket';
import {
  generateSingleEliminationBracket,
  advanceBracketWinner,
  resetBracketMatch,
  groupPlayersByDivision,
  calculateBracketPowerOfTwo
} from '@/lib/bracket';
import { getBeltStyle } from '@/lib/taekwondo';
import { Language, Translations } from '@/lib/translations';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import {
  Trophy,
  Shuffle,
  RotateCcw,
  Printer,
  CheckCircle2,
  Users,
  Swords,
  ChevronRight,
  Shield,
  HelpCircle,
  Play,
  FileText
} from 'lucide-react';

interface TournamentBracketProps {
  players: Player[];
  lang: Language;
  t: Translations;
  onOpenAddModal: () => void;
  preselectedDivision?: string | null;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({
  players,
  lang,
  t,
  onOpenAddModal,
  preselectedDivision
}) => {
  // Divisions grouped
  const divisionGroups = useMemo(() => groupPlayersByDivision(players), [players]);
  const divisionKeys = useMemo(() => Object.keys(divisionGroups).sort(), [divisionGroups]);

  // Selection states
  const [selectedDivision, setSelectedDivision] = useState<string>(
    preselectedDivision || (divisionKeys.length > 0 ? divisionKeys[0] : 'ALL')
  );
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [drawMode, setDrawMode] = useState<DrawMode>('random');
  const [bracket, setBracket] = useState<BracketData | null>(null);
  const [showCustomSelector, setShowCustomSelector] = useState(false);

  // Initialize selected players when division changes
  useEffect(() => {
    if (selectedDivision === 'ALL') {
      setSelectedPlayerIds(players.map((p) => p.id));
    } else if (divisionGroups[selectedDivision]) {
      setSelectedPlayerIds(divisionGroups[selectedDivision].map((p) => p.id));
    } else if (divisionKeys.length > 0) {
      setSelectedDivision(divisionKeys[0]);
      setSelectedPlayerIds(divisionGroups[divisionKeys[0]]?.map((p) => p.id) || []);
    } else {
      setSelectedPlayerIds(players.map((p) => p.id));
    }
  }, [selectedDivision, divisionGroups, divisionKeys, players]);

  // Selected player objects
  const activeCompetitors = useMemo(() => {
    return players.filter((p) => selectedPlayerIds.includes(p.id));
  }, [players, selectedPlayerIds]);

  // Bracket sizing info
  const bracketCalc = useMemo(() => {
    return calculateBracketPowerOfTwo(activeCompetitors.length);
  }, [activeCompetitors.length]);

  // Generate Bracket
  const handleGenerateBracket = useCallback(() => {
    if (activeCompetitors.length < 2) return;
    const divName =
      selectedDivision === 'ALL'
        ? lang === 'my'
          ? 'အားလုံးပါဝင်သော အဆင့် (Open Tournament)'
          : 'Open Tournament Division'
        : selectedDivision;

    const newBracket = generateSingleEliminationBracket(activeCompetitors, divName, drawMode, lang);
    setBracket(newBracket);
  }, [activeCompetitors, selectedDivision, drawMode, lang]);

  // Auto-generate bracket on initial load if players exist and no bracket is set
  useEffect(() => {
    if (!bracket && activeCompetitors.length >= 2) {
      // First check if a bracket was previously saved in localStorage
      const saved = localStorage.getItem('tkd_active_bracket');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.rounds && parsed.rounds.length > 0) {
            setBracket(parsed);
            return;
          }
        } catch {
          // ignore
        }
      }
      handleGenerateBracket();
    }
  }, [bracket, activeCompetitors.length, handleGenerateBracket]);

  // Persist bracket to localStorage for live sync with Results page
  useEffect(() => {
    if (bracket) {
      localStorage.setItem('tkd_active_bracket', JSON.stringify(bracket));
    }
  }, [bracket]);

  // Toggle player selection
  const handleTogglePlayer = (id: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  // Select all or clear
  const handleSelectAll = () => setSelectedPlayerIds(players.map((p) => p.id));
  const handleClearSelection = () => setSelectedPlayerIds([]);

  // Advance winner
  const handlePickWinner = (match: BracketMatch, winnerId: string) => {
    if (!bracket || match.status === 'bye_advanced') return;
    const updated = advanceBracketWinner(bracket, match.id, winnerId);
    setBracket(updated);

    // If final round has a winner, trigger confetti!
    if (updated.champion) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Reset a specific match
  const handleResetMatch = (matchId: string) => {
    if (!bracket) return;
    const updated = resetBracketMatch(bracket, matchId);
    setBracket(updated);
  };

  // Reset entire bracket
  const handleResetEntireBracket = () => {
    if (window.confirm(lang === 'my' ? 'ပွဲစဉ်ရလဒ်များအားလုံးကို အစမှ ပြန်လည်စတင်ရန် သေချာပါသလား?' : 'Reset all match results in this bracket?')) {
      handleGenerateBracket();
    }
  };

  // Auto simulate random winners for demonstration / testing
  const handleSimulateRandomResults = () => {
    if (!bracket) return;
    let current = { ...bracket };
    for (const round of current.rounds) {
      for (const match of round.matches) {
        if (match.status === 'pending' && match.participant1.player && match.participant2.player) {
          const randomWinner = Math.random() > 0.5 ? match.participant1.player.id : match.participant2.player.id;
          current = advanceBracketWinner(current, match.id, randomWinner);
        }
      }
    }
    setBracket(current);
    if (current.champion) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Print bracket
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Configuration & Controls Card (Hidden during printing) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm transition-colors print:hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 uppercase tracking-wide">
                World Taekwondo Rules
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                Single Elimination with Byes
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              {t.bracketTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.bracketSubtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGenerateBracket}
              disabled={activeCompetitors.length < 2}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
            >
              <Shuffle className="w-4 h-4" />
              {t.generateDraw}
            </button>

            <button
              onClick={handlePrint}
              disabled={!bracket}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors disabled:opacity-50"
              title={t.printBracket}
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline">{t.printBracket}</span>
            </button>

            <button
              onClick={handleResetEntireBracket}
              disabled={!bracket}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors disabled:opacity-50"
              title={t.resetBracket}
            >
              <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline">{t.resetBracket}</span>
            </button>

            <button
              onClick={handleSimulateRandomResults}
              disabled={!bracket || !!bracket.champion}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 font-bold text-xs transition-colors disabled:opacity-50"
              title="Quick Auto-Simulate (For demo & testing)"
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Auto-Run Demo</span>
            </button>

            <Link
              href="/results"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-transform hover:scale-[1.02] shadow-sm"
              title={t.viewResultsBtn}
            >
              <FileText className="w-4 h-4 text-amber-400 dark:text-amber-600" />
              <span>{t.viewResultsBtn}</span>
            </Link>
          </div>
        </div>

        {/* Division Selector & Draw Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          {/* Division Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.selectDivision}
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            >
              <option value="ALL">
                🏆 {t.allAthletes} ({players.length} {lang === 'my' ? 'ဦး' : 'athletes'})
              </option>
              {divisionKeys.map((key) => (
                <option key={key} value={key}>
                  🥋 {key} ({divisionGroups[key].length} {lang === 'my' ? 'ဦး' : 'athletes'})
                </option>
              ))}
            </select>
          </div>

          {/* Seeding & Draw Mode */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.drawMode}
            </label>
            <select
              value={drawMode}
              onChange={(e) => setDrawMode(e.target.value as DrawMode)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            >
              <option value="random">🎲 {t.drawRandom}</option>
              <option value="seeded">🥋 {t.drawSeeded}</option>
              <option value="club-separated">🛡️ {t.drawClubSeparated}</option>
            </select>
          </div>

          {/* Player Selection toggle */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <button
              onClick={() => setShowCustomSelector(!showCustomSelector)}
              className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-red-600 dark:text-red-400" />
                {lang === 'my' ? 'ကစားသမား တစ်ဦးချင်း ရွေးချယ်ရန်' : 'Customize Athletes List'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 text-[11px] font-black">
                {activeCompetitors.length} / {players.length}
              </span>
            </button>
          </div>
        </div>

        {/* Custom Athlete Checklist (Collapsible) */}
        {showCustomSelector && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'my' ? 'ယှဉ်ပြိုင်မည့် ကစားသမားများကို အမှန်ခြစ် ရွေးချယ်ပါ:' : 'Select athletes to include in this draw:'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                >
                  {lang === 'my' ? 'အားလုံးရွေးမည်' : 'Select All'}
                </button>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <button
                  onClick={handleClearSelection}
                  className="text-xs font-bold text-slate-500 hover:underline"
                >
                  {lang === 'my' ? 'အားလုံးဖြုတ်မည်' : 'Clear'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {players.map((player) => {
                const isSelected = selectedPlayerIds.includes(player.id);
                const beltStyle = getBeltStyle(player.belt_color);
                return (
                  <label
                    key={player.id}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-red-500/50 shadow-sm'
                        : 'bg-slate-100/50 dark:bg-slate-900/50 border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTogglePlayer(player.id)}
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 dark:border-slate-700"
                    />
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: beltStyle.barColor }}
                    />
                    <div className="flex-1 truncate">
                      <span className="font-bold text-slate-900 dark:text-white truncate block">
                        {player.name}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                        {player.club_name} • {player.weight}kg
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Single Elimination with Byes Summary Pill */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Shield className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span>
              {t.selectedAthletesCount(activeCompetitors.length, bracketCalc.byeCount)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.autoAdvanceNotice}</span>
          </div>
        </div>
      </div>

      {/* Warning if less than 2 competitors */}
      {activeCompetitors.length < 2 && (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Swords className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t.notEnoughAthletes}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {lang === 'my'
              ? 'တွဲဆိုင်းပြုလုပ်ရန် အနည်းဆုံး ကစားသမား ၂ ဦး လိုအပ်ပါသည်။ အထက်ပါ စစ်ထုတ်မှုမှ ကစားသမားများ ရွေးချယ်ပါ သို့မဟုတ် ကစားသမားသစ် စာရင်းသွင်းပါ။'
              : 'Please select at least 2 athletes or register new fighters into the tournament database.'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-sm"
          >
            {t.registerAthlete}
          </button>
        </div>
      )}

      {/* Championship Podium Card (Shown when Final is completed) */}
      {bracket && bracket.champion && (
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-red-500/10 to-amber-500/5 border border-amber-400/40 dark:border-amber-500/30 p-6 sm:p-8 shadow-xl transition-all">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-widest">
              <Trophy className="w-4 h-4 text-amber-500" />
              Tournament Podium & Winners
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              {bracket.divisionName}
            </h3>

            {/* Podium grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
              {/* 2nd Place: Runner-up (Silver) */}
              <div className="order-2 md:order-1 p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-400 flex items-center justify-center text-slate-700 dark:text-slate-300 font-black text-lg shadow-sm">
                  🥈 2
                </div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  {t.runnerUp}
                </div>
                <div className="font-extrabold text-base text-slate-900 dark:text-white">
                  {bracket.runnerUp?.name || 'TBD'}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {bracket.runnerUp?.club_name}
                </div>
              </div>

              {/* 1st Place: Champion (Gold) */}
              <div className="order-1 md:order-2 p-6 rounded-2xl bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900/90 border-2 border-amber-400 dark:border-amber-500 shadow-lg scale-105 flex flex-col items-center justify-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-yellow-200 flex items-center justify-center text-amber-950 font-black text-2xl shadow-md">
                  🥇 1
                </div>
                <div className="text-xs font-black text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  {t.champion}
                </div>
                <div className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                  {bracket.champion.name}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  {bracket.champion.club_name} • {bracket.champion.weight}kg
                </div>
                <div className="pt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-950">
                    GOLD MEDALIST
                  </span>
                </div>
              </div>

              {/* 3rd Place: Bronze Medalists (Joint 3rd in WT) */}
              <div className="order-3 md:order-3 p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-amber-700/30 dark:border-amber-700/40 shadow-sm flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-700 flex items-center justify-center text-amber-800 dark:text-amber-300 font-black text-lg shadow-sm">
                  🥉 3
                </div>
                <div className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  {t.bronze}
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white text-center">
                  {bracket.bronzeMedalists.length > 0
                    ? bracket.bronzeMedalists.map((b) => b.name).join(' & ')
                    : 'Joint 3rd Place'}
                </div>
                <div className="text-xs text-slate-500 font-medium text-center">
                  {bracket.bronzeMedalists.map((b) => b.club_name).filter(Boolean).join(', ') || 'Semifinalists'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Bracket Tree Display */}
      {bracket && activeCompetitors.length >= 2 && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-7 shadow-sm overflow-hidden transition-colors">
          {/* Printable Header */}
          <div className="hidden print:block text-center border-b pb-4 mb-4">
            <h1 className="text-2xl font-black uppercase">WORLD TAEKWONDO CHAMPIONSHIP</h1>
            <h2 className="text-lg font-bold">{bracket.divisionName} - Single Elimination with Byes Draw</h2>
            <p className="text-xs text-slate-600">
              Total Competitors: {bracket.totalCompetitors} • Byes: {bracket.byeCount} • Date: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Interactive Bracket Columns */}
          <div className="overflow-x-auto pb-4 pt-1">
            <div className="flex items-stretch gap-6 sm:gap-8 min-w-max">
              {bracket.rounds.map((round, rIndex) => {
                const isFinal = rIndex === bracket.rounds.length - 1;
                return (
                  <div
                    key={round.roundIndex}
                    className="w-72 sm:w-80 flex-shrink-0 flex flex-col"
                  >
                    {/* Round Header */}
                    <div className="mb-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                          {round.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                          {round.matches.length} {round.matches.length === 1 ? 'match' : 'matches'}
                        </span>
                      </div>
                    </div>

                    {/* Matches List */}
                    <div className="flex-1 flex flex-col justify-around gap-6">
                      {round.matches.map((match) => {
                        const isCompleted = match.status === 'completed';
                        const isByeAdvanced = match.status === 'bye_advanced';

                        return (
                          <div
                            key={match.id}
                            className={`relative rounded-2xl border transition-all shadow-sm ${
                              isFinal
                                ? 'border-amber-400/80 dark:border-amber-500/60 bg-gradient-to-b from-amber-50/20 to-transparent'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40'
                            }`}
                          >
                            {/* Match Header Bar */}
                            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-t-2xl border-b border-slate-200 dark:border-slate-800 text-[11px]">
                              <span className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                {isFinal ? '🏆 Championship Match' : match.id}
                              </span>

                              {isByeAdvanced && (
                                <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1 text-[10px]">
                                  <Shield className="w-3 h-3" /> {t.byeAdvanced}
                                </span>
                              )}

                              {isCompleted && !isByeAdvanced && (
                                <button
                                  onClick={() => handleResetMatch(match.id)}
                                  className="text-[10px] text-slate-500 hover:text-red-500 font-bold underline transition-colors print:hidden"
                                >
                                  {lang === 'my' ? 'ပြန်ပြင်မည်' : 'Undo'}
                                </button>
                              )}
                            </div>

                            {/* Contestants Container */}
                            <div className="p-2.5 space-y-2">
                              {/* Participant 1: Hong (Red Corner) */}
                              <ParticipantCard
                                participant={match.participant1}
                                isWinner={match.winnerId === match.participant1.player?.id}
                                canPickWinner={
                                  !isByeAdvanced &&
                                  !!match.participant1.player &&
                                  !!match.participant2.player &&
                                  match.status !== 'completed'
                                }
                                onPickWinner={() => {
                                  if (match.participant1.player) {
                                    handlePickWinner(match, match.participant1.player.id);
                                  }
                                }}
                                corner="hong"
                                t={t}
                                lang={lang}
                              />

                              {/* VS separator */}
                              <div className="relative flex items-center justify-center my-0.5">
                                <div className="absolute inset-0 flex items-center">
                                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                                </div>
                                <span className="relative px-2 bg-slate-50 dark:bg-slate-950 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                  VS
                                </span>
                              </div>

                              {/* Participant 2: Chong (Blue Corner) */}
                              <ParticipantCard
                                participant={match.participant2}
                                isWinner={match.winnerId === match.participant2.player?.id}
                                canPickWinner={
                                  !isByeAdvanced &&
                                  !!match.participant1.player &&
                                  !!match.participant2.player &&
                                  match.status !== 'completed'
                                }
                                onPickWinner={() => {
                                  if (match.participant2.player) {
                                    handlePickWinner(match, match.participant2.player.id);
                                  }
                                }}
                                corner="chong"
                                t={t}
                                lang={lang}
                              />
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
      )}
    </div>
  );
};

interface ParticipantCardProps {
  participant: {
    player: Player | null;
    isBye: boolean;
    seed?: number;
    score?: number | string;
  };
  isWinner: boolean;
  canPickWinner: boolean;
  onPickWinner: () => void;
  corner: 'hong' | 'chong';
  t: Translations;
  lang: Language;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  isWinner,
  canPickWinner,
  onPickWinner,
  corner,
  t,
  lang
}) => {
  const isBye = participant.isBye;
  const player = participant.player;
  const beltStyle = player ? getBeltStyle(player.belt_color) : null;

  const isHong = corner === 'hong';
  const cornerLabel = isHong ? t.hongCorner : t.chongCorner;
  const cornerBadgeColor = isHong
    ? 'bg-rose-500 text-white'
    : 'bg-blue-600 text-white';

  if (isBye) {
    return (
      <div className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900/40 text-slate-400 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-500">
            {t.bye}
          </span>
          <span className="font-semibold italic text-slate-500 dark:text-slate-400 text-xs">
            {lang === 'my' ? 'ပြိုင်ဘက်မရှိ (Auto-Pass)' : 'No Opponent (Bye)'}
          </span>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-slate-400 text-xs">
        <div className="flex items-center gap-2">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${cornerBadgeColor}`}>
            {isHong ? 'HONG' : 'CHONG'}
          </span>
          <span className="italic text-slate-400 text-xs">
            {lang === 'my' ? 'အနိုင်ရသူ စောင့်ဆိုင်းနေသည် (TBD)' : 'Awaiting Winner (TBD)'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        if (canPickWinner) onPickWinner();
      }}
      className={`group relative flex items-center justify-between p-2.5 rounded-xl border transition-all ${
        canPickWinner ? 'cursor-pointer hover:border-red-400 dark:hover:border-red-500 hover:shadow-md' : ''
      } ${
        isWinner
          ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500/80 dark:border-emerald-500/80 ring-2 ring-emerald-500/30'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Corner & Seed Indicator */}
        <div className="flex flex-col items-center flex-shrink-0">
          <span title={cornerLabel} className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${cornerBadgeColor}`}>
            {isHong ? 'HONG' : 'CHONG'}
          </span>
          {participant.seed && (
            <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 mt-0.5">
              #{participant.seed}
            </span>
          )}
        </div>

        {/* Belt Stripe */}
        {beltStyle && (
          <div
            className="w-1.5 h-8 rounded-full flex-shrink-0"
            style={{ backgroundColor: beltStyle.barColor }}
            title={beltStyle.name}
          />
        )}

        {/* Player Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xs text-slate-900 dark:text-white truncate block">
              {player.name}
            </span>
            {isWinner && (
              <span className="flex-shrink-0 flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-500 text-white uppercase">
                <CheckCircle2 className="w-2.5 h-2.5" />
                WIN
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
            <span className="truncate">{player.club_name}</span>
            <span>•</span>
            <span className="font-semibold">{player.weight}kg</span>
          </div>
        </div>
      </div>

      {/* Action / Winner selection button */}
      {canPickWinner && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPickWinner();
          }}
          className="ml-2 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase transition-all flex items-center gap-1 flex-shrink-0 print:hidden"
        >
          <span>{t.selectWinner}</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
