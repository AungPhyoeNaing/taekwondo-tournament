'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, X, ArrowUpDown, LayoutGrid, Table, Check, Bookmark, BookmarkCheck, Scale } from 'lucide-react';
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

const WEIGHT_PRESETS = [
  { label: 'All', min: '', max: '' },
  { label: '< 48 kg', min: '20', max: '48' },
  { label: '48 - 58 kg', min: '48', max: '58' },
  { label: '58 - 68 kg', min: '58', max: '68' },
  { label: '68 - 80 kg', min: '68', max: '80' },
  { label: '80+ kg', min: '80', max: '120' }
];

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedAgeSetting, setSavedAgeSetting] = useState<string>('');
  const [justSavedAge, setJustSavedAge] = useState(false);

  // Load saved age division setting from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tkd_saved_age_division');
      if (saved) {
        setSavedAgeSetting(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveAgeSetting = () => {
    try {
      localStorage.setItem('tkd_saved_age_division', filters.ageCategory);
      setSavedAgeSetting(filters.ageCategory);
      setJustSavedAge(true);
      setTimeout(() => setJustSavedAge(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({ ...filters, query: e.target.value });
  };

  const handleBeltToggle = (belt: string) => {
    onChangeFilters({ ...filters, belt: filters.belt === belt ? '' : belt });
  };

  const handleClubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilters({ ...filters, club: e.target.value });
  };

  const handleAgeCategoryChange = (val: string) => {
    onChangeFilters({ ...filters, ageCategory: val });
  };

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const currentMax = parseFloat(filters.maxWeight) || 120;
    if (parseFloat(val) > currentMax) {
      onChangeFilters({ ...filters, minWeight: val, maxWeight: val });
    } else {
      onChangeFilters({ ...filters, minWeight: val });
    }
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const currentMin = parseFloat(filters.minWeight) || 20;
    if (parseFloat(val) < currentMin) {
      onChangeFilters({ ...filters, minWeight: val, maxWeight: val });
    } else {
      onChangeFilters({ ...filters, maxWeight: val });
    }
  };

  const applyWeightPreset = (min: string, max: string) => {
    onChangeFilters({ ...filters, minWeight: min, maxWeight: max });
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

  const currentMinWeight = parseFloat(filters.minWeight) || 20;
  const currentMaxWeight = parseFloat(filters.maxWeight) || 120;

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
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-4 text-xs animate-in slide-in-from-top-2 duration-150">
          {/* Top Row: Gender, Manually Typed Age Division, Representing Club */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {/* Gender Filter */}
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1.5">{t.gender}</label>
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
                      className={`py-2 text-center font-bold rounded-lg transition-all ${
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

            {/* Manually Typed Age Division with Save Setting */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-600 dark:text-slate-400 font-bold">
                  {t.ageDivision}
                </label>
                {filters.ageCategory && (
                  <button
                    onClick={handleSaveAgeSetting}
                    title="Save this age division as your preferred filter setting"
                    className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition-all ${
                      justSavedAge
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                        : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-200 dark:border-red-800/60'
                    }`}
                  >
                    {justSavedAge ? (
                      <>
                        <BookmarkCheck className="w-3 h-3 text-emerald-600" />
                        <span>{t.settingSaved}</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3 h-3" />
                        <span>{t.saveSetting}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={filters.ageCategory}
                  onChange={(e) => handleAgeCategoryChange(e.target.value)}
                  placeholder={t.typeAgeDivision}
                  list="age-division-suggestions"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-8 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
                {filters.ageCategory && (
                  <button
                    onClick={() => handleAgeCategoryChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Datalist for typed suggestions */}
              <datalist id="age-division-suggestions">
                <option value="Cadet (12-14)" />
                <option value="Junior (15-17)" />
                <option value="Senior (18-35)" />
                <option value="12-14" />
                <option value="15-17" />
                <option value="18+" />
                <option value="< 12" />
                <option value="ကာဒက် (၁၂-၁၄)" />
                <option value="လူငယ် (၁၅-၁၇)" />
                <option value="လူကြီး (၁၈-၃၅)" />
              </datalist>

              {/* Quick suggestion chips */}
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {savedAgeSetting && savedAgeSetting !== filters.ageCategory && (
                  <button
                    onClick={() => handleAgeCategoryChange(savedAgeSetting)}
                    className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex items-center gap-1"
                  >
                    <BookmarkCheck className="w-2.5 h-2.5" />
                    <span>Saved: {savedAgeSetting}</span>
                  </button>
                )}
                {['12-14', '15-17', '18+', '< 12'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleAgeCategoryChange(preset)}
                    className={`px-2 py-0.5 rounded-md border text-[10px] font-bold transition-colors ${
                      filters.ageCategory === preset
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Club Filter */}
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1.5">{t.representingClub}</label>
              <select
                value={filters.club}
                onChange={handleClubChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-red-500"
              >
                <option value="">{t.allClubs} ({availableClubs.length})</option>
                {availableClubs.map((club) => (
                  <option key={club} value={club}>
                    {club}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Weight Range Slider Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-red-500" />
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  {t.weightRangeSlider}
                </label>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-200 dark:border-red-800/60 font-mono font-bold text-red-700 dark:text-red-300">
                  {filters.minWeight || filters.maxWeight
                    ? `${filters.minWeight || '20'} kg — ${filters.maxWeight || '120'} kg`
                    : t.anyWeight}
                </span>
              </div>

              {/* Quick weight presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mr-1">
                  {t.weightPresets}:
                </span>
                {WEIGHT_PRESETS.map((preset) => {
                  const isPresetActive =
                    filters.minWeight === preset.min && filters.maxWeight === preset.max;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => applyWeightPreset(preset.min, preset.max)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                        isPresetActive
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slider Controls & Number Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Min Slider */}
              <div className="md:col-span-4 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                  <span>{t.minKg}: <strong className="text-slate-800 dark:text-slate-200">{filters.minWeight || '20'} kg</strong></span>
                  <span>20 kg</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="0.5"
                  value={filters.minWeight || '20'}
                  onChange={handleMinSliderChange}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              {/* Visual Divider / Range track indicator */}
              <div className="hidden md:flex md:col-span-4 flex-col items-center justify-center text-center px-2">
                <span className="text-[11px] font-bold text-slate-500 mb-1">
                  Active Range
                </span>
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                    style={{
                      left: `${Math.max(0, Math.min(100, ((currentMinWeight - 20) / 100) * 100))}%`,
                      right: `${Math.max(0, Math.min(100, 100 - ((currentMaxWeight - 20) / 100) * 100))}%`
                    }}
                  />
                </div>
              </div>

              {/* Max Slider */}
              <div className="md:col-span-4 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                  <span>{t.maxKg}: <strong className="text-slate-800 dark:text-slate-200">{filters.maxWeight || '120'} kg</strong></span>
                  <span>120 kg</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="0.5"
                  value={filters.maxWeight || '120'}
                  onChange={handleMaxSliderChange}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
            </div>

            {/* Precision Numeric inputs */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <span className="text-[11px] text-slate-500 font-medium">Exact weight entry:</span>
              <input
                type="number"
                step="0.1"
                placeholder={t.minKg}
                value={filters.minWeight}
                onChange={(e) => onChangeFilters({ ...filters, minWeight: e.target.value })}
                className="w-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold text-center focus:outline-none focus:border-red-500"
              />
              <span className="text-slate-400 font-bold">—</span>
              <input
                type="number"
                step="0.1"
                placeholder={t.maxKg}
                value={filters.maxWeight}
                onChange={(e) => onChangeFilters({ ...filters, maxWeight: e.target.value })}
                className="w-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold text-center focus:outline-none focus:border-red-500"
              />
              {(filters.minWeight || filters.maxWeight) && (
                <button
                  onClick={() => onChangeFilters({ ...filters, minWeight: '', maxWeight: '' })}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline font-bold ml-1"
                >
                  Reset
                </button>
              )}
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
