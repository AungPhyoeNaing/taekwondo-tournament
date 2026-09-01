'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, checkSupabaseHealth, SupabaseHealthStatus } from '@/lib/supabase';
import { Player, PlayerFilters, PlayerFormData } from '@/types/player';
import { DEMO_PLAYERS, calculateAge, getTaekwondoDivision, getAgeCategory } from '@/lib/taekwondo';
import { Navbar } from '@/components/Navbar';
import { SearchFilterBar } from '@/components/SearchFilterBar';
import { PlayerCard } from '@/components/PlayerCard';
import { PlayerTable } from '@/components/PlayerTable';
import { PlayerModal } from '@/components/PlayerModal';
import { PlayerIdCardModal } from '@/components/PlayerIdCardModal';
import { DatabaseSetupModal } from '@/components/DatabaseSetupBanner';
import { TournamentStats } from '@/components/TournamentStats';
import confetti from 'canvas-confetti';
import { AlertCircle, CheckCircle2, UserPlus, Database, SearchX, Sparkles } from 'lucide-react';

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<SupabaseHealthStatus | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [usingLocalFallback, setUsingLocalFallback] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [idCardPlayer, setIdCardPlayer] = useState<Player | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Notification Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Filter state
  const [filters, setFilters] = useState<PlayerFilters>({
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

  // Initialize theme from localStorage (default to 'light')
  useEffect(() => {
    const savedTheme = localStorage.getItem('tkd_theme') as 'light' | 'dark' | null;
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('tkd_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Fetch players from Supabase
  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    setCheckingHealth(true);
    try {
      const healthStatus = await checkSupabaseHealth();
      setHealth(healthStatus);

      if (healthStatus.tableExists) {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setPlayers(data as Player[]);
          setUsingLocalFallback(false);
        } else if (!error) {
          // Table exists but is empty
          const savedLocal = localStorage.getItem('tkd_local_players');
          if (savedLocal) {
            try {
              setPlayers(JSON.parse(savedLocal));
            } catch {
              setPlayers([]);
            }
          } else {
            setPlayers([]);
          }
          setUsingLocalFallback(false);
        } else {
          // Error returned by Supabase, fall back to local/demo smoothly
          setUsingLocalFallback(true);
          const savedLocal = localStorage.getItem('tkd_local_players');
          if (savedLocal) {
            try {
              setPlayers(JSON.parse(savedLocal));
            } catch {
              setPlayers(DEMO_PLAYERS);
            }
          } else {
            setPlayers(DEMO_PLAYERS);
          }
        }
      } else {
        // Table doesn't exist yet, load from local storage or demo data
        setUsingLocalFallback(true);
        const savedLocal = localStorage.getItem('tkd_local_players');
        if (savedLocal) {
          try {
            setPlayers(JSON.parse(savedLocal));
          } catch {
            setPlayers(DEMO_PLAYERS);
          }
        } else {
          setPlayers(DEMO_PLAYERS);
        }
      }
    } catch {
      setUsingLocalFallback(true);
      const savedLocal = localStorage.getItem('tkd_local_players');
      if (savedLocal) {
        try {
          setPlayers(JSON.parse(savedLocal));
        } catch {
          setPlayers(DEMO_PLAYERS);
        }
      } else {
        setPlayers(DEMO_PLAYERS);
      }
    } finally {
      setLoading(false);
      setCheckingHealth(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  // Sync to local storage if using fallback
  useEffect(() => {
    if (usingLocalFallback && players.length > 0) {
      localStorage.setItem('tkd_local_players', JSON.stringify(players));
    }
  }, [players, usingLocalFallback]);

  // Save Player (Create or Update)
  const handleSavePlayer = async (formData: PlayerFormData, id?: string): Promise<boolean> => {
    try {
      if (health?.tableExists) {
        if (id) {
          // Update Supabase
          const { error } = await supabase
            .from('players')
            .update({
              name: formData.name,
              date_of_birth: formData.date_of_birth,
              weight: Number(formData.weight),
              gender: formData.gender,
              belt_color: formData.belt_color,
              club_name: formData.club_name,
              contact_number: formData.contact_number || null,
              notes: formData.notes || null,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);

          if (error) throw error;
          showToast(`Athlete "${formData.name}" updated successfully!`, 'success');
        } else {
          // Insert Supabase
          const { error } = await supabase
            .from('players')
            .insert([
              {
                name: formData.name,
                date_of_birth: formData.date_of_birth,
                weight: Number(formData.weight),
                gender: formData.gender,
                belt_color: formData.belt_color,
                club_name: formData.club_name,
                contact_number: formData.contact_number || null,
                notes: formData.notes || null
              }
            ]);

          if (error) throw error;
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
          showToast(`Athlete "${formData.name}" registered to Supabase!`, 'success');
        }
        await fetchPlayers();
        return true;
      } else {
        // Handle Local mode
        if (id) {
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === id
                ? {
                    ...p,
                    ...formData,
                    weight: Number(formData.weight)
                  }
                : p
            )
          );
          showToast(`Athlete "${formData.name}" updated in local roster!`, 'success');
        } else {
          const newPlayer: Player = {
            id: 'player-' + Date.now(),
            name: formData.name,
            date_of_birth: formData.date_of_birth,
            weight: Number(formData.weight),
            gender: formData.gender,
            belt_color: formData.belt_color,
            club_name: formData.club_name,
            contact_number: formData.contact_number,
            notes: formData.notes,
            created_at: new Date().toISOString()
          };
          setPlayers((prev) => [newPlayer, ...prev]);
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
          showToast(`Athlete "${formData.name}" registered!`, 'success');
        }
        return true;
      }
    } catch (err: unknown) {
      console.error('Error saving player:', err);
      showToast(err instanceof Error ? err.message : 'Error saving athlete', 'error');
      return false;
    }
  };

  // Delete Player
  const handleDeletePlayer = async (player: Player) => {
    if (!window.confirm(`Are you sure you want to remove "${player.name}" from the tournament roster?`)) {
      return;
    }

    try {
      if (health?.tableExists) {
        const { error } = await supabase.from('players').delete().eq('id', player.id);
        if (error) throw error;
        showToast(`Removed "${player.name}" from database.`, 'info');
        await fetchPlayers();
      } else {
        setPlayers((prev) => prev.filter((p) => p.id !== player.id));
        showToast(`Removed "${player.name}" from roster.`, 'info');
      }
    } catch (err: unknown) {
      console.error('Error deleting player:', err);
      showToast(err instanceof Error ? err.message : 'Failed to delete athlete', 'error');
    }
  };

  // Load Demo Data
  const handleLoadDemoData = () => {
    setPlayers(DEMO_PLAYERS);
    localStorage.setItem('tkd_local_players', JSON.stringify(DEMO_PLAYERS));
    setIsSetupModalOpen(false);
    showToast('Loaded 6 official demo tournament athletes!', 'success');
  };

  // Export CSV
  const handleExportCsv = () => {
    if (players.length === 0) {
      showToast('No athlete data to export.', 'info');
      return;
    }

    const headers = [
      'ID',
      'Name',
      'Date of Birth',
      'Age',
      'Weight (kg)',
      'Gender',
      'Belt Color',
      'Club Name',
      'Age Category',
      'WT Division',
      'Contact',
      'Notes'
    ];

    const rows = players.map((p) => {
      const age = calculateAge(p.date_of_birth);
      const div = getTaekwondoDivision(Number(p.weight), p.gender, p.date_of_birth);
      return [
        `"${p.id}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.date_of_birth}"`,
        age,
        Number(p.weight).toFixed(1),
        `"${p.gender}"`,
        `"${p.belt_color}"`,
        `"${p.club_name.replace(/"/g, '""')}"`,
        `"${div.category}"`,
        `"${div.divisionName}"`,
        `"${p.contact_number || ''}"`,
        `"${(p.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `taekwondo_tournament_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Tournament roster downloaded as CSV!', 'success');
  };

  // Available unique clubs for filter dropdown
  const availableClubs = useMemo(() => {
    const clubs = Array.from(new Set(players.map((p) => p.club_name.trim()))).filter(Boolean);
    return clubs.sort((a, b) => a.localeCompare(b));
  }, [players]);

  // Filtered and Sorted Players
  const filteredPlayers = useMemo(() => {
    return players
      .filter((player) => {
        // Query search
        if (filters.query.trim()) {
          const q = filters.query.toLowerCase().trim();
          const matchName = player.name.toLowerCase().includes(q);
          const matchClub = player.club_name.toLowerCase().includes(q);
          const matchBelt = player.belt_color.toLowerCase().includes(q);
          if (!matchName && !matchClub && !matchBelt) return false;
        }

        // Gender
        if (filters.gender && player.gender.toLowerCase() !== filters.gender.toLowerCase()) {
          return false;
        }

        // Belt
        if (filters.belt && player.belt_color.toLowerCase() !== filters.belt.toLowerCase()) {
          return false;
        }

        // Club
        if (filters.club && player.club_name.toLowerCase() !== filters.club.toLowerCase()) {
          return false;
        }

        // Age Category
        if (filters.ageCategory) {
          const age = calculateAge(player.date_of_birth);
          const cat = getAgeCategory(age);
          if (cat.toLowerCase() !== filters.ageCategory.toLowerCase()) {
            return false;
          }
        }

        // Weight Min
        if (filters.minWeight && Number(player.weight) < parseFloat(filters.minWeight)) {
          return false;
        }

        // Weight Max
        if (filters.maxWeight && Number(player.weight) > parseFloat(filters.maxWeight)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (filters.sortBy === 'name') {
          comp = a.name.localeCompare(b.name);
        } else if (filters.sortBy === 'weight') {
          comp = Number(a.weight) - Number(b.weight);
        } else if (filters.sortBy === 'age') {
          comp = calculateAge(a.date_of_birth) - calculateAge(b.date_of_birth);
        } else if (filters.sortBy === 'club') {
          comp = a.club_name.localeCompare(b.club_name);
        } else {
          // created_at
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          comp = dateA - dateB;
        }
        return filters.sortOrder === 'asc' ? comp : -comp;
      });
  }, [players, filters]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans selection:bg-red-600 selection:text-white transition-colors duration-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                : toast.type === 'error'
                ? 'bg-red-50/95 dark:bg-red-950/90 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200'
                : 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            ) : (
              <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => {
          setEditingPlayer(null);
          setIsAddModalOpen(true);
        }}
        onOpenSetupModal={() => setIsSetupModalOpen(true)}
        onExportCsv={handleExportCsv}
        health={health}
        checkingHealth={checkingHealth}
        onRefresh={fetchPlayers}
        totalPlayers={players.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Supabase Notice Banner if table is not yet created */}
      {!health?.tableExists && !loading && (
        <div className="bg-gradient-to-r from-amber-50 via-red-50 to-slate-50 dark:from-amber-950/70 dark:via-red-950/60 dark:to-slate-950 border-b border-amber-200 dark:border-amber-800/40 px-4 py-2.5 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Database className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Supabase Setup Needed:</strong> Connected to your project, but the <code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded font-mono text-amber-900 dark:text-white font-bold">players</code> table needs 1-click creation.
              </span>
            </div>
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors flex-shrink-0 shadow-sm"
            >
              View 10s SQL Setup
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Tournament Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-red-50/50 to-white dark:from-slate-900 dark:via-red-950/40 dark:to-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm dark:shadow-2xl transition-colors">
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30">
              World Taekwondo Federation Rules
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Athlete Database & Weigh-In Search
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Real-time search and management portal for competitors. Filter by weight division, belt hierarchy, age brackets, and representing dojangs with instant tournament credential generation.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setEditingPlayer(null);
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-md shadow-red-500/20 transition-all hover:scale-[1.02]"
              >
                <UserPlus className="w-4 h-4" />
                Register New Competitor
              </button>

              <button
                onClick={handleExportCsv}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors shadow-sm"
              >
                Download Weigh-In Sheet (CSV)
              </button>
            </div>
          </div>

          {/* Decorative background visual */}
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-red-500/10 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Tournament Metrics Overview */}
        <TournamentStats players={players} onAddSampleData={handleLoadDemoData} />

        {/* Search & Multi-Filter Engine */}
        <SearchFilterBar
          filters={filters}
          onChangeFilters={setFilters}
          availableClubs={availableClubs}
          totalFiltered={filteredPlayers.length}
          totalAll={players.length}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
        />

        {/* Athletes List / Content Area */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Connecting to tournament database...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          /* Empty Search Results */
          <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-8 space-y-4 shadow-sm">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <SearchX className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Athletes Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {players.length === 0
                  ? 'No fighters have been registered yet. Add the first competitor or load the official demo roster.'
                  : 'No players match your search criteria. Try adjusting your query, belt, weight, or gender filters.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              {players.length === 0 ? (
                <>
                  <button
                    onClick={() => {
                      setEditingPlayer(null);
                      setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" /> Register First Fighter
                  </button>
                  <button
                    onClick={handleLoadDemoData}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" /> Load Demo Roster
                  </button>
                </>
              ) : (
                <button
                  onClick={() =>
                    setFilters({
                      query: '',
                      gender: '',
                      belt: '',
                      club: '',
                      ageCategory: '',
                      minWeight: '',
                      maxWeight: '',
                      sortBy: 'created_at',
                      sortOrder: 'desc'
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View of Athletes */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onViewId={(p) => setIdCardPlayer(p)}
                onEdit={(p) => {
                  setEditingPlayer(p);
                  setIsAddModalOpen(true);
                }}
                onDelete={handleDeletePlayer}
              />
            ))}
          </div>
        ) : (
          /* Official Table View of Athletes */
          <PlayerTable
            players={filteredPlayers}
            onViewId={(p) => setIdCardPlayer(p)}
            onEdit={(p) => {
              setEditingPlayer(p);
              setIsAddModalOpen(true);
            }}
            onDelete={handleDeletePlayer}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Taekwondo Tournament Athlete Registry & Weigh-In Database • Hosted on Vercel
          </div>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span>Powered by Supabase PostgreSQL</span>
            <span>•</span>
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors underline decoration-dotted"
            >
              SQL Database Instructions
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PlayerModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingPlayer(null);
        }}
        onSave={handleSavePlayer}
        editingPlayer={editingPlayer}
      />

      <PlayerIdCardModal
        player={idCardPlayer}
        isOpen={!!idCardPlayer}
        onClose={() => setIdCardPlayer(null)}
      />

      <DatabaseSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        health={health}
        onRetry={fetchPlayers}
        onLoadDemoData={handleLoadDemoData}
      />
    </div>
  );
}
