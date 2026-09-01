'use client';

import React from 'react';
import { Search, Filter, SlidersHorizontal, X, ArrowUpDown, LayoutGrid, Table, Check } from 'lucide-react';
import { DEFAULT_BELTS, getBeltStyle } from '@/lib/taekwondo';
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
  lang
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({ ...filters, query: e.target.value });
  };

  const handleBeltToggle = (belt: string) => {
    onChangeFilters({ ...filters, belt: filters.belt === belt ? '' : belt });
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
    filters.query,
    filters.gender,
    filters.belt,
    filters.club,
    filters.ageCategory,
    filters.minWeight,
    filters.maxWeight
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-xl space-y-4 transition-colors">
      {/* Primary Search Bar Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={filters.query}
            onChange={handleQueryChange}
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          />
          {filters.query && (
            <button
              onClick={() => onChangeFilters({ ...filters, query: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode & Advanced Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3.5 py-3 rounded-xl border text-xs font-bold transition-all ${
              showAdvanced || activeFilterCount > 0
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/80 text-red-600 dark:text-red-300'
                : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-red-500" />
            <span>{t.filters}</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Menu */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 py-2 px-2 focus:outline-none cursor-pointer"
            >
              <option value="created_at" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t.newestFirst}</option>
              <option value="name" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t.nameAZ}</option>
              <option value="weight" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t.weight}</option>
              <option value="age" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t.ageDob}</option>
              <option value="club" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t.clubName}</option>
            </select>
            <button
              onClick={toggleSortOrder}
              title={`Sort ${filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid vs Table View */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            <button
              onClick={() => onChangeViewMode('grid')}
              title="Grid View"
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeViewMode('table')}
              title="Table View"
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Belt Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-500 dark:text-slate-400 text-xs font-bold mr-1 flex items-center gap-1 flex-shrink-0">
          <Filter className="w-3.5 h-3.5" /> {t.belts}:
        </span>
        <button
          onClick={() => onChangeFilters({ ...filters, belt: '' })}
          className={`px-3 py-1.5 rounded-lg font-bold flex-shrink-0 transition-all ${
            filters.belt === ''
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          {t.allBelts}
        </button>

        {DEFAULT_BELTS.map((belt) => {
          const style = getBeltStyle(belt);
          const isSelected = filters.belt.toLowerCase() === belt.toLowerCase();
          const displayBelt = lang === 'my' && BURMESE_BELTS[belt] ? BURMESE_BELTS[belt] : belt;

          return (
            <button
              key={belt}
              onClick={() => handleBeltToggle(belt)}
              className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 flex-shrink-0 border transition-all ${
                isSelected
                  ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50 dark:bg-slate-800 text-red-700 dark:text-white'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-700"
                style={{ backgroundColor: style.barColor }}
              />
              <span>{displayBelt}</span>
              {isSelected && <Check className="w-3 h-3 text-red-600 dark:text-red-400" />}
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Expansion */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-in slide-in-from-top-2 duration-150">
          {/* Gender Filter */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">{t.gender}</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
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
                    className={`py-1.5 text-center font-bold rounded-lg transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Age Division Filter */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">{t.ageDivision}</label>
            <select
              value={filters.ageCategory}
              onChange={handleAgeCategoryChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-red-500"
            >
              <option value="">{t.allDivisions}</option>
              <option value="Child">{t.child}</option>
              <option value="Cadet">{t.cadet}</option>
              <option value="Junior">{t.junior}</option>
              <option value="Senior">{t.senior}</option>
              <option value="Ultra">{t.ultra}</option>
            </select>
          </div>

          {/* Club Filter */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">{t.representingClub}</label>
            <select
              value={filters.club}
              onChange={handleClubChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-red-500"
            >
              <option value="">{t.allClubs} ({availableClubs.length})</option>
              {availableClubs.map((club) => (
                <option key={club} value={club}>
                  {club}
                </option>
              ))}
            </select>
          </div>

          {/* Weight Range (Kg) */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">{t.weightRange}</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder={t.minKg}
                value={filters.minWeight}
                onChange={(e) => onChangeFilters({ ...filters, minWeight: e.target.value })}
                className="w-1/2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-red-500"
              />
              <span className="text-slate-400 font-bold">-</span>
              <input
                type="number"
                placeholder={t.maxKg}
                value={filters.maxWeight}
                onChange={(e) => onChangeFilters({ ...filters, maxWeight: e.target.value })}
                className="w-1/2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
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
