'use client';

import React from 'react';
import { Player } from '@/types/player';
import { calculateAge, getBeltStyle, getTaekwondoDivision } from '@/lib/taekwondo';
import { Award, IdCard, Edit2, Trash2 } from 'lucide-react';

interface PlayerTableProps {
  players: Player[];
  onViewId: (player: Player) => void;
  onEdit: (player: Player) => void;
  onDelete: (player: Player) => void;
}

export const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  onViewId,
  onEdit,
  onDelete
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm dark:shadow-xl transition-colors">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[11px] font-bold tracking-wider">
          <tr>
            <th className="px-4 py-3.5">Athlete</th>
            <th className="px-4 py-3.5">Belt</th>
            <th className="px-4 py-3.5">Gender / Age</th>
            <th className="px-4 py-3.5">Weight (Kg)</th>
            <th className="px-4 py-3.5">WT Division</th>
            <th className="px-4 py-3.5">Club</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
          {players.map((player) => {
            const belt = getBeltStyle(player.belt_color);
            const age = calculateAge(player.date_of_birth);
            const division = getTaekwondoDivision(Number(player.weight), player.gender, player.date_of_birth);

            return (
              <tr key={player.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                {/* Athlete Name & DOB */}
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{player.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">DOB: {player.date_of_birth}</div>
                </td>

                {/* Belt Color */}
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-xs font-bold ${belt.badgeBg} ${belt.badgeText} ${belt.borderColor}`}
                  >
                    <Award className="w-3 h-3" />
                    {player.belt_color}
                  </span>
                </td>

                {/* Gender / Age */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        player.gender === 'Male' ? 'bg-blue-500' : player.gender === 'Female' ? 'bg-pink-500' : 'bg-purple-500'
                      }`}
                    />
                    <span>{player.gender}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{age} yrs ({division.category})</div>
                </td>

                {/* Weight */}
                <td className="px-4 py-3.5">
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-200">
                    {Number(player.weight).toFixed(1)} kg
                  </span>
                </td>

                {/* WT Division */}
                <td className="px-4 py-3.5">
                  <div className="font-bold text-red-600 dark:text-red-300">{division.divisionName}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{division.weightClass}</div>
                </td>

                {/* Club */}
                <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                  {player.club_name}
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onViewId(player)}
                      title="View ID Pass"
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <IdCard className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                    <button
                      onClick={() => onEdit(player)}
                      title="Edit Athlete"
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(player)}
                      title="Delete Athlete"
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
