'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Scale, Calendar, Award, Building2, User, Phone, FileText } from 'lucide-react';
import { Player, PlayerFormData, Gender } from '@/types/player';
import { DEFAULT_BELTS, calculateAge, getBeltStyle, getTaekwondoDivision } from '@/lib/taekwondo';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PlayerFormData, id?: string) => Promise<boolean>;
  editingPlayer?: Player | null;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlayer
}) => {
  const [formData, setFormData] = useState<PlayerFormData>({
    name: '',
    date_of_birth: '2005-01-01',
    weight: '58.0',
    gender: 'Male',
    belt_color: 'Black',
    club_name: '',
    contact_number: '',
    notes: ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingPlayer) {
      setFormData({
        name: editingPlayer.name,
        date_of_birth: editingPlayer.date_of_birth,
        weight: editingPlayer.weight.toString(),
        gender: editingPlayer.gender,
        belt_color: editingPlayer.belt_color,
        club_name: editingPlayer.club_name,
        contact_number: editingPlayer.contact_number || '',
        notes: editingPlayer.notes || ''
      });
    } else {
      setFormData({
        name: '',
        date_of_birth: '2005-01-01',
        weight: '58.0',
        gender: 'Male',
        belt_color: 'Black',
        club_name: '',
        contact_number: '',
        notes: ''
      });
    }
    setError(null);
  }, [editingPlayer, isOpen]);

  if (!isOpen) return null;

  const currentAge = calculateAge(formData.date_of_birth);
  const currentDivision = getTaekwondoDivision(
    Number(formData.weight) || 50,
    formData.gender,
    formData.date_of_birth
  );
  const beltStyle = getBeltStyle(formData.belt_color);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter the athlete name.');
      return;
    }
    if (!formData.date_of_birth) {
      setError('Please select the date of birth.');
      return;
    }
    const weightNum = parseFloat(formData.weight.toString());
    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 200) {
      setError('Please enter a valid weight between 10kg and 200kg.');
      return;
    }
    if (!formData.club_name.trim()) {
      setError('Please enter the club or team name.');
      return;
    }

    setSaving(true);
    try {
      const success = await onSave(
        {
          ...formData,
          weight: weightNum
        },
        editingPlayer?.id
      );
      if (success) {
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save athlete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {editingPlayer ? 'Edit Athlete Profile' : 'Register New Athlete'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Enter tournament participant weigh-in & registration details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Real-time WT Division preview strip */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700"
                style={{ backgroundColor: beltStyle.barColor }}
              />
              <span className="text-slate-600 dark:text-slate-400 font-medium">Division:</span>
              <span className="font-bold text-red-600 dark:text-red-400">{currentDivision.standardText}</span>
            </div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">
              Age: <strong className="text-slate-900 dark:text-white">{currentAge}</strong> ({currentDivision.category})
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Athlete Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-500" />
                Athlete Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aung Thu, John Doe"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
              />
            </div>

            {/* Weight (in Kg) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-red-500" />
                Weight (in Kg) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="58.5"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  KG
                </span>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Gender *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Male', 'Female'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                      formData.gender === g
                        ? 'bg-red-600 border-red-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Belt Color */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-red-500" />
                Belt Color *
              </label>
              <select
                value={formData.belt_color}
                onChange={(e) => setFormData({ ...formData, belt_color: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
              >
                {DEFAULT_BELTS.map((belt) => (
                  <option key={belt} value={belt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {belt} Belt
                  </option>
                ))}
              </select>
            </div>

            {/* Club Representing */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-red-500" />
                Name of Club / Dojang Representing *
              </label>
              <input
                type="text"
                required
                value={formData.club_name}
                onChange={(e) => setFormData({ ...formData, club_name: e.target.value })}
                placeholder="e.g. Yangon Tigers TKD, Tiger Martial Arts"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
              />
            </div>

            {/* Contact / Phone (optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Contact Phone (Optional)
              </label>
              <input
                type="text"
                value={formData.contact_number || ''}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                placeholder="+95 9..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
              />
            </div>

            {/* Notes / Accolades (optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Notes / Rank Details (Optional)
              </label>
              <input
                type="text"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. 1st Dan, 2024 Gold Medalist"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-500/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : editingPlayer ? 'Update Athlete' : 'Complete Registration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
