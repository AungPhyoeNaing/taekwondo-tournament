'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown, LayoutGrid, Table, RotateCcw, Swords } from 'lucide-react';
import { DEFAULT_BELTS } from '@/lib/taekwondo';
import { PlayerFilters } from '@/types/player';
import { Language, Translations } from '@/lib/translations';

interface SearchFilterBarProps {
  filters: PlayerFilters;
  onChangeFilters: (filters: PlayerFilters) => void;
  availableClubs: string[];
  totalFiltered: number;
  totalAll: number;
  viewMode: 'grid' | 'table';
  onChangeViewMode: (mode: 'grid' | 'table') => void;
  t: Translations;
  lang: Language;
  onPairFiltered?: () => void;
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

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filters,
  onChangeFilters,
  availableClubs,
  totalFiltered,
  totalAll,
  viewMode,
  onChangeViewMode,
  t,
  lang,
  onPairFiltered
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({ ...filters, query: e.target.value });
  };

  const handleBeltChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilters({ ...filters, belt: e.target.value });
  };

  const handleClubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilters({ ...filters, club: e.target.value });
  };

  const handleAgeCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilters({ ...filters, ageCategory: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PlayerFilters['sortBy'];
    onChangeFilters({ ...filters, sortBy: value });
  };

  const toggleSortOrder = () => {
    onChangeFilters({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
  };

  const clearAllFilters = () => {
    onChangeFilters({
      query: '',
      gender: '',
      belt: '',
      club: '',
      ageCategory: '',
      minWeight: '',
      maxWeight: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  const activeFilterCount = [
    filters.gender,
    filters.belt,
    filters.club,
    filters.ageCategory,
    filters.minWeight,
    filters.maxWeight
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm space-y-3 transition-colors">
      {/* Primary Toolbar Row */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.query}
            onChange={handleQueryChange}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
          />
          {filters.query && (
            <button
              onClick={() => onChangeFilters({ ...filters, query: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Gender Chips */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs font-bold flex-shrink-0">
          {[
            { label: t.allGenders, val: '' },
            { label: t.male, val: 'Male' },
            { label: t.female, val: 'Female' }
          ].map(({ label, val }) => {
            const isSelected = filters.gender === val;
            return (
              <button
                key={val || 'all'}
                onClick={() => onChangeFilters({ ...filters, gender: val })}
                className={`px-3 py-1 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm font-black'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Secondary Actions: Pair Button, Filter Button & View Mode */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end flex-shrink-0">
          {/* Pair Filtered Athletes Button */}
          {onPairFiltered && (
            <button
              onClick={onPairFiltered}
              disabled={totalFiltered < 2}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-sm shadow-purple-500/20 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:pointer-events-none flex-shrink-0"
              title={lang === 'my' ? 'ဤစစ်ထုတ်ထားသော ကစားသမားများဖြင့် တွဲဆိုင်းပြုလုပ်မည်' : 'Pair these filtered athletes'}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{lang === 'my' ? `တွဲဆိုင်းပြုလုပ်မည် (${totalFiltered})` : `Pair Athletes (${totalFiltered})`}</span>
            </button>
          )}

          {/* Filters Toggle Button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              showAdvanced || activeFilterCount > 0
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/80 text-red-600 dark:text-red-300'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
            <span>{t.filters}</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Grid vs Table View */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl p-0.5">
            <button
              onClick={() => onChangeViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Summary Bar with Quick Send to Pairing */}
      {(activeFilterCount > 0 || filters.query) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 px-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 text-xs font-semibold text-purple-900 dark:text-purple-200 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-purple-600 text-white shadow-2xs">
              <Swords className="w-3.5 h-3.5" />
            </span>
            <span>
              {lang === 'my'
                ? `စစ်ထုတ်ထားသော ကစားသမား ${totalFiltered} ဦး တွေ့ရှိပါသည်`
                : `${totalFiltered} athletes found matching your filters`}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={clearAllFilters}
              className="px-2 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors"
            >
              {lang === 'my' ? 'စစ်ထုတ်မှု ရှင်းမည်' : 'Clear Filters'}
            </button>
            {onPairFiltered && (
              <button
                onClick={onPairFiltered}
                disabled={totalFiltered < 2}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs transition-transform hover:scale-105 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Swords className="w-3 h-3" />
                <span>{lang === 'my' ? 'တွဲဆိုင်း စတင်မည် →' : 'Send to Pairing →'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Collapsible Filter Drawer */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs animate-in slide-in-from-top-1 duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Belt Color Dropdown */}
            <div className="space-y-1">
              <label className="block text-slate-500 dark:text-slate-400 font-bold text-[11px]">
                {t.belts}
              </label>
              <select
                value={filters.belt}
                onChange={handleBeltChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="">{t.allBelts}</option>
                {DEFAULT_BELTS.map((belt) => (
                  <option key={belt} value={belt}>
                    {lang === 'my' && BURMESE_BELTS[belt] ? `${BURMESE_BELTS[belt]} (${belt})` : belt}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Division Dropdown */}
            <div className="space-y-1">
              <label className="block text-slate-500 dark:text-slate-400 font-bold text-[11px]">
                {t.ageDivision}
              </label>
              <select
                value={filters.ageCategory}
                onChange={handleAgeCategoryChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="">{lang === 'my' ? 'အသက်အရွယ် အားလုံး' : 'All Age Divisions'}</option>
                <option value="U8">{lang === 'my' ? 'U8 (၈ နှစ်နှင့်အောက်)' : 'U8 (Under 8 yrs)'}</option>
                <option value="U10">{lang === 'my' ? 'U10 (၉ - ၁၀ နှစ်)' : 'U10 (9-10 yrs)'}</option>
                <option value="U12">{lang === 'my' ? 'U12 (၁၁ - ၁၂ နှစ်)' : 'U12 (11-12 yrs)'}</option>
                <option value="U14">{lang === 'my' ? 'U14 (၁၃ - ၁၄ နှစ်)' : 'U14 (13-14 yrs)'}</option>
                <option value="U16">{lang === 'my' ? 'U16 (၁၅ - ၁၆ နှစ်)' : 'U16 (15-16 yrs)'}</option>
                <option value="U18">{lang === 'my' ? 'U18 (၁၇ - ၁၈ နှစ်)' : 'U18 (17-18 yrs)'}</option>
                <option value="Over 18">{lang === 'my' ? 'Over 18 (၁၈ နှစ်အထက်)' : 'Over 18 (> 18 yrs)'}</option>
              </select>
            </div>

            {/* Club Filter */}
            <div className="space-y-1">
              <label className="block text-slate-500 dark:text-slate-400 font-bold text-[11px]">
                {t.representingClub}
              </label>
              <select
                value={filters.club}
                onChange={handleClubChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="">{t.allClubs} ({availableClubs.length})</option>
                {availableClubs.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown & Direction */}
            <div className="space-y-1">
              <label className="block text-slate-500 dark:text-slate-400 font-bold text-[11px]">
                {t.sortBy}
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="created_at">{t.newestFirst}</option>
                  <option value="name">{t.nameAZ}</option>
                  <option value="weight">{t.weight}</option>
                  <option value="age">{t.ageDob}</option>
                  <option value="club">{t.clubName}</option>
                </select>
                <button
                  onClick={toggleSortOrder}
                  title={`Sort ${filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
                  className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors flex-shrink-0"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Reset Filters CTA if active */}
          {(activeFilterCount > 0 || filters.query) && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.clearFilters}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter status summary bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/50">
        <div>
          {t.showingAthletes(totalFiltered, totalAll)}
          {activeFilterCount > 0 && (
            <span className="ml-2 text-red-600 dark:text-red-400 font-semibold">{t.activeFiltersCount(activeFilterCount)}</span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> {t.clearFilters}
          </button>
        )}
      </div>
    </div>
  );
};
