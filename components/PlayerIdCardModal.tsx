/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { X, Printer, Shield, QrCode, Award, Building2, Scale, Calendar, CheckCircle2 } from 'lucide-react';
import { Player } from '@/types/player';
import { calculateAge, getBeltStyle, getTaekwondoDivision } from '@/lib/taekwondo';
import { Language, Translations } from '@/lib/translations';

interface PlayerIdCardModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
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

export const PlayerIdCardModal: React.FC<PlayerIdCardModalProps> = ({
  player,
  isOpen,
  onClose,
  t,
  lang
}) => {
  if (!isOpen || !player) return null;

  const belt = getBeltStyle(player.belt_color);
  const age = calculateAge(player.date_of_birth);
  const division = getTaekwondoDivision(Number(player.weight), player.gender, player.date_of_birth);
  const displayBelt = lang === 'my' && BURMESE_BELTS[player.belt_color] ? BURMESE_BELTS[player.belt_color] : player.belt_color;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden print:m-0 print:border-none print:shadow-none print:bg-white print:text-black transition-colors">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <Shield className="w-4 h-4 text-red-600" />
            <span>{t.officialCredential}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printPass}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Athlete Pass Card */}
        <div className="p-6 bg-slate-100 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 print:bg-white print:p-8">
          <div className="relative rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 shadow-xl overflow-hidden print:border-black print:bg-white print:shadow-none">
            {/* Top Lanyard Punch hole simulation */}
            <div className="w-12 h-3 mx-auto mt-2.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 print:border-black print:bg-slate-200" />

            {/* Header Ribbon */}
            <div className="px-5 pt-3 pb-4 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-center print:bg-black print:text-white">
              <div className="text-[10px] uppercase font-black tracking-widest text-amber-100 print:text-white">
                {t.worldTkdChampionship}
              </div>
              <h2 className="text-xl font-black tracking-tight uppercase">
                {t.officialCompetitor}
              </h2>
              <div className="text-[11px] font-semibold text-white/90">
                {t.credentialSub}
              </div>
            </div>

            {/* Belt Color Accent Bar */}
            <div
              className="h-3 w-full border-y border-black/10"
              style={{ backgroundColor: belt.barColor }}
            />

            {/* Card Content */}
            <div className="p-5 space-y-4 print:text-black">
              {/* Athlete Name & Photo */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-red-500/40 flex items-center justify-center text-2xl font-black text-slate-800 dark:text-white overflow-hidden print:border-black print:bg-slate-100 print:text-black">
                  {player.photo_url ? (
                    <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{player.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white print:text-black truncate uppercase">
                    {player.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 print:text-slate-700 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400 print:text-black flex-shrink-0" />
                    <span className="font-bold truncate">{player.club_name}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${belt.badgeBg} ${belt.badgeText} ${belt.borderColor}`}
                    >
                      <Award className="w-3 h-3" />
                      {displayBelt} ({player.belt_color})
                    </span>
                  </div>
                </div>
              </div>

              {/* Tournament Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-950/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 print:bg-slate-50 print:border-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600 block uppercase font-bold">
                    {t.officialWeight}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-sm text-slate-900 dark:text-white print:text-black">
                    <Scale className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 print:text-black" />
                    <span>{Number(player.weight).toFixed(1)} KG</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600 block uppercase font-bold">
                    {t.wtDivision}
                  </span>
                  <div className="font-bold text-sm text-red-600 dark:text-red-400 print:text-black truncate">
                    {division.divisionName}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600 block uppercase font-bold">
                    {t.genderAndAge}
                  </span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 print:text-black">
                    {lang === 'my' ? (player.gender === 'Male' ? 'ကျား' : player.gender === 'Female' ? 'မ' : player.gender) : player.gender} • {age} {t.years} ({division.category})
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600 block uppercase font-bold">
                    {t.dateOfBirth}
                  </span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 print:text-black flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400 print:text-black" />
                    <span>{player.date_of_birth}</span>
                  </div>
                </div>
              </div>

              {/* Weigh-in clearance & Verification stamp */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 print:border-black print:bg-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 print:text-black" />
                  <div>
                    <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 print:text-black uppercase">
                      {t.weighInVerified}
                    </div>
                    <div className="text-[9px] text-emerald-600 dark:text-emerald-400/80 print:text-slate-600 font-medium">
                      {t.eligibleDraw}
                    </div>
                  </div>
                </div>
                <QrCode className="w-8 h-8 text-slate-700 dark:text-slate-300 print:text-black" />
              </div>

              {/* Footer athlete ID */}
              <div className="pt-2 text-center text-[10px] font-mono text-slate-500 dark:text-slate-500 print:text-slate-600 border-t border-slate-200 dark:border-slate-800 print:border-slate-300">
                {t.athleteId}: {player.id.slice(0, 18).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
