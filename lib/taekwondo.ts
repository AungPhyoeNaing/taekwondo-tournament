import { AgeCategory, BeltColor, Gender, Player } from '@/types/player';

export interface BeltMetadata {
  name: BeltColor | string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  barColor: string;
  rankIndex: number;
}

export const BELT_RANKS: Record<string, BeltMetadata> = {
  White: {
    name: 'White',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-800 dark:text-slate-100',
    borderColor: 'border-slate-300 dark:border-slate-600',
    barColor: '#e2e8f0',
    rankIndex: 1
  },
  Yellow: {
    name: 'Yellow',
    badgeBg: 'bg-yellow-100 dark:bg-yellow-950/70',
    badgeText: 'text-yellow-800 dark:text-yellow-300',
    borderColor: 'border-yellow-400 dark:border-yellow-600',
    barColor: '#eab308',
    rankIndex: 2
  },
  Green: {
    name: 'Green',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/70',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    borderColor: 'border-emerald-400 dark:border-emerald-600',
    barColor: '#10b981',
    rankIndex: 3
  },
  Blue: {
    name: 'Blue',
    badgeBg: 'bg-blue-100 dark:bg-blue-950/70',
    badgeText: 'text-blue-800 dark:text-blue-300',
    borderColor: 'border-blue-400 dark:border-blue-600',
    barColor: '#3b82f6',
    rankIndex: 4
  },
  Red: {
    name: 'Red',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/70',
    badgeText: 'text-rose-800 dark:text-rose-300',
    borderColor: 'border-rose-400 dark:border-rose-600',
    barColor: '#f43f5e',
    rankIndex: 5
  },
  Brown: {
    name: 'Brown',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/70',
    badgeText: 'text-amber-900 dark:text-amber-300',
    borderColor: 'border-amber-600 dark:border-amber-700',
    barColor: '#92400e',
    rankIndex: 6
  },
  Poom: {
    name: 'Poom',
    badgeBg: 'bg-gradient-to-r from-red-200 to-slate-800 text-white dark:from-red-900 dark:to-slate-900',
    badgeText: 'text-white',
    borderColor: 'border-red-500',
    barColor: '#dc2626',
    rankIndex: 7
  },
  Black: {
    name: 'Black',
    badgeBg: 'bg-black text-white dark:bg-black dark:text-yellow-400',
    badgeText: 'text-white dark:text-yellow-400',
    borderColor: 'border-yellow-500/50 dark:border-yellow-400',
    barColor: '#000000',
    rankIndex: 8
  }
};

export const DEFAULT_BELTS = [
  'White',
  'Yellow',
  'Green',
  'Blue',
  'Red',
  'Brown',
  'Poom',
  'Black'
];

export function getBeltStyle(beltName: string): BeltMetadata {
  const normalized = beltName.trim();
  const match = Object.keys(BELT_RANKS).find(
    (b) => b.toLowerCase() === normalized.toLowerCase()
  );
  if (match && BELT_RANKS[match]) {
    return BELT_RANKS[match];
  }
  return {
    name: beltName,
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-800 dark:text-slate-200',
    borderColor: 'border-slate-300 dark:border-slate-600',
    barColor: '#64748b',
    rankIndex: 0
  };
}

export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export function getAgeCategory(age: number): AgeCategory {
  if (age < 12) return 'Child';
  if (age <= 14) return 'Cadet';
  if (age <= 17) return 'Junior';
  if (age <= 35) return 'Senior';
  return 'Ultra';
}

export interface DivisionMatch {
  category: AgeCategory;
  divisionName: string;
  weightClass: string;
  standardText: string;
}

/**
 * World Taekwondo Standard Weight Classes
 */
export function getTaekwondoDivision(weightKg: number, gender: Gender | string, dob: string): DivisionMatch {
  const age = calculateAge(dob);
  const category = getAgeCategory(age);
  const isFemale = gender.toLowerCase() === 'female';

  if (category === 'Senior' || category === 'Ultra') {
    if (isFemale) {
      if (weightKg <= 46) return { category, divisionName: 'Finweight', weightClass: '-46 kg', standardText: 'Senior Female -46kg (Finweight)' };
      if (weightKg <= 49) return { category, divisionName: 'Flyweight', weightClass: '-49 kg', standardText: 'Senior Female -49kg (Flyweight)' };
      if (weightKg <= 53) return { category, divisionName: 'Bantamweight', weightClass: '-53 kg', standardText: 'Senior Female -53kg (Bantamweight)' };
      if (weightKg <= 57) return { category, divisionName: 'Featherweight', weightClass: '-57 kg', standardText: 'Senior Female -57kg (Featherweight)' };
      if (weightKg <= 62) return { category, divisionName: 'Lightweight', weightClass: '-62 kg', standardText: 'Senior Female -62kg (Lightweight)' };
      if (weightKg <= 67) return { category, divisionName: 'Welterweight', weightClass: '-67 kg', standardText: 'Senior Female -67kg (Welterweight)' };
      if (weightKg <= 73) return { category, divisionName: 'Middleweight', weightClass: '-73 kg', standardText: 'Senior Female -73kg (Middleweight)' };
      return { category, divisionName: 'Heavyweight', weightClass: '+73 kg', standardText: 'Senior Female +73kg (Heavyweight)' };
    } else {
      if (weightKg <= 54) return { category, divisionName: 'Finweight', weightClass: '-54 kg', standardText: 'Senior Male -54kg (Finweight)' };
      if (weightKg <= 58) return { category, divisionName: 'Flyweight', weightClass: '-58 kg', standardText: 'Senior Male -58kg (Flyweight)' };
      if (weightKg <= 63) return { category, divisionName: 'Bantamweight', weightClass: '-63 kg', standardText: 'Senior Male -63kg (Bantamweight)' };
      if (weightKg <= 68) return { category, divisionName: 'Featherweight', weightClass: '-68 kg', standardText: 'Senior Male -68kg (Featherweight)' };
      if (weightKg <= 74) return { category, divisionName: 'Lightweight', weightClass: '-74 kg', standardText: 'Senior Male -74kg (Lightweight)' };
      if (weightKg <= 80) return { category, divisionName: 'Welterweight', weightClass: '-80 kg', standardText: 'Senior Male -80kg (Welterweight)' };
      if (weightKg <= 87) return { category, divisionName: 'Middleweight', weightClass: '-87 kg', standardText: 'Senior Male -87kg (Middleweight)' };
      return { category, divisionName: 'Heavyweight', weightClass: '+87 kg', standardText: 'Senior Male +87kg (Heavyweight)' };
    }
  }

  if (category === 'Junior') {
    if (isFemale) {
      if (weightKg <= 42) return { category, divisionName: 'Junior Fin', weightClass: '-42 kg', standardText: 'Junior Female -42kg' };
      if (weightKg <= 46) return { category, divisionName: 'Junior Fly', weightClass: '-46 kg', standardText: 'Junior Female -46kg' };
      if (weightKg <= 52) return { category, divisionName: 'Junior Feather', weightClass: '-52 kg', standardText: 'Junior Female -52kg' };
      if (weightKg <= 59) return { category, divisionName: 'Junior Welter', weightClass: '-59 kg', standardText: 'Junior Female -59kg' };
      if (weightKg <= 68) return { category, divisionName: 'Junior Middle', weightClass: '-68 kg', standardText: 'Junior Female -68kg' };
      return { category, divisionName: 'Junior Heavy', weightClass: '+68 kg', standardText: 'Junior Female +68kg' };
    } else {
      if (weightKg <= 45) return { category, divisionName: 'Junior Fin', weightClass: '-45 kg', standardText: 'Junior Male -45kg' };
      if (weightKg <= 51) return { category, divisionName: 'Junior Fly', weightClass: '-51 kg', standardText: 'Junior Male -51kg' };
      if (weightKg <= 59) return { category, divisionName: 'Junior Feather', weightClass: '-59 kg', standardText: 'Junior Male -59kg' };
      if (weightKg <= 68) return { category, divisionName: 'Junior Welter', weightClass: '-68 kg', standardText: 'Junior Male -68kg' };
      if (weightKg <= 78) return { category, divisionName: 'Junior Middle', weightClass: '-78 kg', standardText: 'Junior Male -78kg' };
      return { category, divisionName: 'Junior Heavy', weightClass: '+78 kg', standardText: 'Junior Male +78kg' };
    }
  }

  if (category === 'Cadet') {
    if (isFemale) {
      if (weightKg <= 33) return { category, divisionName: 'Cadet Fin', weightClass: '-33 kg', standardText: 'Cadet Female -33kg' };
      if (weightKg <= 41) return { category, divisionName: 'Cadet Fly', weightClass: '-41 kg', standardText: 'Cadet Female -41kg' };
      if (weightKg <= 47) return { category, divisionName: 'Cadet Light', weightClass: '-47 kg', standardText: 'Cadet Female -47kg' };
      if (weightKg <= 55) return { category, divisionName: 'Cadet Welter', weightClass: '-55 kg', standardText: 'Cadet Female -55kg' };
      return { category, divisionName: 'Cadet Heavy', weightClass: '+55 kg', standardText: 'Cadet Female +55kg' };
    } else {
      if (weightKg <= 37) return { category, divisionName: 'Cadet Fin', weightClass: '-37 kg', standardText: 'Cadet Male -37kg' };
      if (weightKg <= 45) return { category, divisionName: 'Cadet Fly', weightClass: '-45 kg', standardText: 'Cadet Male -45kg' };
      if (weightKg <= 53) return { category, divisionName: 'Cadet Light', weightClass: '-53 kg', standardText: 'Cadet Male -53kg' };
      if (weightKg <= 61) return { category, divisionName: 'Cadet Welter', weightClass: '-61 kg', standardText: 'Cadet Male -61kg' };
      return { category, divisionName: 'Cadet Heavy', weightClass: '+61 kg', standardText: 'Cadet Male +61kg' };
    }
  }

  return {
    category: 'Child',
    divisionName: 'Youth Division',
    weightClass: `${weightKg} kg`,
    standardText: `Youth Category (${weightKg} kg)`
  };
}

export const DEMO_PLAYERS: Player[] = [
  {
    id: 'demo-1',
    name: 'Aung Thu',
    date_of_birth: '2002-05-14',
    weight: 58.00,
    gender: 'Male',
    belt_color: 'Black',
    club_name: 'Yangon Tigers TKD',
    contact_number: '+95 9 791 234567',
    notes: 'National Championship 2024 Gold Medalist (Flyweight)',
    created_at: '2026-08-15T08:30:00Z'
  },
  {
    id: 'demo-2',
    name: 'Su Myat Noe',
    date_of_birth: '2004-11-20',
    weight: 49.20,
    gender: 'Female',
    belt_color: 'Black',
    club_name: 'Golden Dragon Dojang',
    contact_number: '+95 9 421 889900',
    notes: 'South East Asian Qualifier Winner, 2nd Dan',
    created_at: '2026-08-18T10:15:00Z'
  },
  {
    id: 'demo-3',
    name: 'Min Thant',
    date_of_birth: '2006-03-08',
    weight: 63.50,
    gender: 'Male',
    belt_color: 'Red',
    club_name: 'Mandalay Warriors',
    contact_number: '+95 9 250 112233',
    notes: 'High speed roundhouse kick specialist',
    created_at: '2026-08-20T14:40:00Z'
  },
  {
    id: 'demo-4',
    name: 'Hnin Yu Wai',
    date_of_birth: '2008-09-12',
    weight: 46.00,
    gender: 'Female',
    belt_color: 'Blue',
    club_name: 'Taunggyi Stars TKD',
    contact_number: '+95 9 977 445566',
    notes: 'Cadet division champion 2025',
    created_at: '2026-08-22T09:20:00Z'
  },
  {
    id: 'demo-5',
    name: 'Kyaw Zin Lat',
    date_of_birth: '2001-01-25',
    weight: 74.80,
    gender: 'Male',
    belt_color: 'Black',
    club_name: 'Naypyidaw Phoenix',
    contact_number: '+95 9 690 334455',
    notes: 'Welterweight state champion, 3rd Dan',
    created_at: '2026-08-25T16:00:00Z'
  },
  {
    id: 'demo-6',
    name: 'Lin Htet',
    date_of_birth: '2007-07-19',
    weight: 55.40,
    gender: 'Male',
    belt_color: 'Green',
    club_name: 'Apex Martial Arts Club',
    contact_number: '+95 9 400 667788',
    notes: 'First time tournament entrant, promising counter-attacker',
    created_at: '2026-08-28T11:45:00Z'
  }
];
