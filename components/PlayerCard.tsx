/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { Player } from '@/types/player';
import { calculateAge, getBeltStyle, getTaekwondoDivision } from '@/lib/taekwondo';
import { Award, Scale, Building2, IdCard, Edit2, Trash2, User } from 'lucide-react';
import { Language, Translations } from '@/lib/translations';

interface PlayerCardProps {
  player: Player;
  onViewId: (player: Player) => void;
  onEdit: (player: Player) => void;
  onDelete: (player: Player) => void;
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

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onViewId,
  onEdit,
  onDelete,
  t,
  lang
}) => {
  const belt = getBeltStyle(player.belt_color);
  const age = calculateAge(player.date_of_birth);
  const division = getTaekwondoDivision(Number(player.weight), player.gender, player.date_of_birth);
  const displayBelt = lang === 'my' && BURMESE_BELTS[player.belt_color] ? BURMESE_BELTS[player.belt_color] : player.belt_color;

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Belt Stripe Accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
        style={{ backgroundColor: belt.barColor }}
      />

      <div className="space-y-3">
        {/* Header: Avatar, Name, Belt Tag */}
        <div className="flex items-start justify-between gap-2.5 pt-0.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-base overflow-hidden">
              {player.photo_url ? (
                <img
                  src={player.photo_url}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-slate-400" />
              )}
              {/* Gender dot */}
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white dark:border-slate-900 ${
                  player.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                }`}
                title={player.gender}
              />
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate">
                {player.name}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <Building2 className="w-3 h-3 flex-shrink-0" />
                <span className="font-medium truncate">{player.club_name}</span>
              </div>
            </div>
          </div>

          {/* Belt Tag */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold shadow-xs flex-shrink-0 ${belt.badgeBg} ${belt.badgeText} ${belt.borderColor}`}
          >
            <Award className="w-3 h-3" />
            <span>{displayBelt}</span>
          </div>
        </div>

        {/* Division, Weight & Age Specs Row */}
        <div className="flex items-center justify-between text-xs py-2 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">
              {division.category} {division.weightClass}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {age} {t.years} • {player.date_of_birth}
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-900 dark:text-white font-black text-xs bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
            <Scale className="w-3 h-3 text-amber-500" />
            <span>{Number(player.weight).toFixed(1)} kg</span>
          </div>
        </div>

        {/* Notes (if any) */}
        {player.notes && (
          <p className="text-[11px] text-slate-400 italic line-clamp-1">
            &ldquo;{player.notes}&rdquo;
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1">
        <button
          onClick={() => onViewId(player)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-colors"
          title={t.passId}
        >
          <IdCard className="w-3 h-3 text-red-600 dark:text-red-400" />
          <span>{t.passId}</span>
        </button>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onEdit(player)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={t.edit}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(player)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title={t.delete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
