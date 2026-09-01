'use client';

import React from 'react';
import { Users, Building2, Award, Scale, Flame } from 'lucide-react';
import { Player } from '@/types/player';
import { Translations } from '@/lib/translations';

interface TournamentStatsProps {
  players: Player[];
  onAddSampleData: () => void;
  t: Translations;
}

export const TournamentStats: React.FC<TournamentStatsProps> = ({
  players,
  onAddSampleData,
  t
}) => {
  const total = players.length;
  const uniqueClubs = new Set(players.map((p) => p.club_name.trim())).size;
  const maleCount = players.filter((p) => p.gender === 'Male').length;
  const femaleCount = players.filter((p) => p.gender === 'Female').length;
  const blackBelts = players.filter(
    (p) => p.belt_color.toLowerCase() === 'black' || p.belt_color.toLowerCase() === 'poom'
  ).length;

  const averageWeight = total > 0
    ? (players.reduce((sum, p) => sum + Number(p.weight), 0) / total).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Athletes */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm dark:shadow-lg transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.totalAthletes}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {total}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="text-blue-600 dark:text-blue-400 font-bold">{maleCount} M</span>
          <span>•</span>
          <span className="text-pink-600 dark:text-pink-400 font-bold">{femaleCount} F</span>
        </div>
      </div>

      {/* Participating Clubs */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm dark:shadow-lg transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.activeTeams}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {uniqueClubs}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {uniqueClubs} clubs registered
        </div>
      </div>

      {/* Black / Poom Belts */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm dark:shadow-lg transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.danPoomRanks}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {blackBelts}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-amber-500 dark:text-yellow-400">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {total > 0 ? Math.round((blackBelts / total) * 100) : 0}% {t.eliteBlackBelts}
        </div>
      </div>

      {/* Avg Weight & Quick Action */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm dark:shadow-lg flex flex-col justify-between transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.averageWeight}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {averageWeight} <span className="text-sm font-semibold text-slate-400">kg</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400">
            <Scale className="w-5 h-5" />
          </div>
        </div>
        {total === 0 ? (
          <button
            onClick={onAddSampleData}
            className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{t.loadSampleRoster}</span>
          </button>
        ) : (
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span>{t.weighInActive}</span>
          </div>
        )}
      </div>
    </div>
  );
};
