/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { Player } from '@/types/player';
import { calculateAge, getBeltStyle, getTaekwondoDivision } from '@/lib/taekwondo';
import { Award, Calendar, Scale, Building2, IdCard, Edit2, Trash2, User } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onViewId: (player: Player) => void;
  onEdit: (player: Player) => void;
  onDelete: (player: Player) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onViewId,
  onEdit,
  onDelete
}) => {
  const belt = getBeltStyle(player.belt_color);
  const age = calculateAge(player.date_of_birth);
  const division = getTaekwondoDivision(Number(player.weight), player.gender, player.date_of_birth);

  return (
    <div className="group relative bg-white dark:bg-slate-900/90 hover:bg-slate-50/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md dark:shadow-black/20 dark:hover:shadow-2xl dark:hover:shadow-red-950/20 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Belt Stripe Accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 transition-all group-hover:h-2"
        style={{ backgroundColor: belt.barColor }}
      />

      <div>
        {/* Header: Avatar, Name, Belt Tag */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-lg overflow-hidden group-hover:scale-105 transition-transform">
              {player.photo_url ? (
                <img
                  src={player.photo_url}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-slate-400 dark:text-slate-400" />
              )}
              {/* Gender dot */}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                  player.gender === 'Male' ? 'bg-blue-500' : player.gender === 'Female' ? 'bg-pink-500' : 'bg-purple-500'
                }`}
                title={player.gender}
              />
            </div>

            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                {player.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">{player.club_name}</span>
              </div>
            </div>
          </div>

          {/* Belt Tag */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold shadow-sm ${belt.badgeBg} ${belt.badgeText} ${belt.borderColor}`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{player.belt_color}</span>
          </div>
        </div>

        {/* Division & Weight Badge */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300">
              {division.divisionName}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {division.weightClass}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 text-xs font-bold bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <Scale className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{Number(player.weight).toFixed(1)} kg</span>
          </div>
        </div>

        {/* Athlete Specs (Age, DOB, Category) */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>
              Age <strong className="text-slate-800 dark:text-slate-200">{age}</strong> yrs
            </span>
          </div>
          <div className="text-right text-slate-500 dark:text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">
              {division.category}
            </span>
          </div>
          <div className="col-span-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            DOB: {player.date_of_birth}
          </div>
        </div>

        {/* Notes (if any) */}
        {player.notes && (
          <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1">
            &ldquo;{player.notes}&rdquo;
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
        <button
          onClick={() => onViewId(player)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          title="View Tournament ID & Weigh-in Pass"
        >
          <IdCard className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          <span>Pass / ID</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(player)}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit Athlete"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(player)}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Delete Athlete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
