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
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-sm transition-colors">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800/80">
        {/* Total Athletes */}
        <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3 first:pt-0 first:px-0">
          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 flex-shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {total}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {maleCount}M • {femaleCount}F
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.totalAthletes}
            </div>
          </div>
        </div>

        {/* Participating Clubs */}
        <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 flex-shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {uniqueClubs}
            </span>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.activeTeams}
            </div>
          </div>
        </div>

        {/* Black / Poom Belts */}
        <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-amber-500 dark:text-yellow-400 flex-shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {blackBelts}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                ({total > 0 ? Math.round((blackBelts / total) * 100) : 0}%)
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.danPoomRanks}
            </div>
          </div>
        </div>

        {/* Avg Weight */}
        <div className="flex items-center justify-between gap-3 pt-2 sm:pt-0 sm:px-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 flex-shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {averageWeight}
                </span>
                <span className="text-xs font-semibold text-slate-400">kg</span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t.averageWeight}
              </div>
            </div>
          </div>

          {total === 0 && (
            <button
              onClick={onAddSampleData}
              className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{t.loadSampleRoster}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
