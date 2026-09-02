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

  if (weightKg <= 21) return { category: 'Child', divisionName: 'Finweight', weightClass: '-21 kg', standardText: 'Child -21kg (Finweight)' };
  if (weightKg <= 24) return { category: 'Child', divisionName: 'Flyweight', weightClass: '-24 kg', standardText: 'Child -24kg (Flyweight)' };
  if (weightKg <= 27) return { category: 'Child', divisionName: 'Bantamweight', weightClass: '-27 kg', standardText: 'Child -27kg (Bantamweight)' };
  if (weightKg <= 30) return { category: 'Child', divisionName: 'Featherweight', weightClass: '-30 kg', standardText: 'Child -30kg (Featherweight)' };
  if (weightKg <= 34) return { category: 'Child', divisionName: 'Lightweight', weightClass: '-34 kg', standardText: 'Child -34kg (Lightweight)' };
  if (weightKg <= 38) return { category: 'Child', divisionName: 'Welterweight', weightClass: '-38 kg', standardText: 'Child -38kg (Welterweight)' };
  if (weightKg <= 42) return { category: 'Child', divisionName: 'Light Middle', weightClass: '-42 kg', standardText: 'Child -42kg (Light Middle)' };
  if (weightKg <= 46) return { category: 'Child', divisionName: 'Middleweight', weightClass: '-46 kg', standardText: 'Child -46kg (Middleweight)' };
  if (weightKg <= 50) return { category: 'Child', divisionName: 'Light Heavy', weightClass: '-50 kg', standardText: 'Child -50kg (Light Heavy)' };
  return { category: 'Child', divisionName: 'Heavyweight', weightClass: '+50 kg', standardText: 'Child +50kg (Heavyweight)' };
}

export const DEMO_PLAYERS: Player[] = [
  {
    id: 'real-1',
    name: 'May Pachi Khit',
    date_of_birth: '2013-10-31',
    weight: 42.8,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:01Z'
  },
  {
    id: 'real-2',
    name: 'May Phoe Mon',
    date_of_birth: '2016-12-01',
    weight: 43.8,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:02Z'
  },
  {
    id: 'real-3',
    name: 'Kyal Sin Lin Lae',
    date_of_birth: '2006-05-16',
    weight: 52.0,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:03Z'
  },
  {
    id: 'real-4',
    name: 'Thura Aung',
    date_of_birth: '1999-05-11',
    weight: 62.0,
    gender: 'Male',
    belt_color: 'Green',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:04Z'
  },
  {
    id: 'real-5',
    name: 'Hein Htet Zaw',
    date_of_birth: '2005-12-23',
    weight: 51.5,
    gender: 'Male',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:05Z'
  },
  {
    id: 'real-6',
    name: 'Poe Kyi Phyu Khant',
    date_of_birth: '2021-03-11',
    weight: 27.0,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:06Z'
  },
  {
    id: 'real-7',
    name: 'Thiri Han',
    date_of_birth: '2010-05-14',
    weight: 48.2,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:07Z'
  },
  {
    id: 'real-8',
    name: 'Myat Thiri',
    date_of_birth: '2013-05-23',
    weight: 39.8,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:08Z'
  },
  {
    id: 'real-9',
    name: 'Htet Su Yati Lin',
    date_of_birth: '2011-02-22',
    weight: 41.8,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:09Z'
  },
  {
    id: 'real-10',
    name: 'Kyaw Zin Htet',
    date_of_birth: '2013-10-28',
    weight: 37.5,
    gender: 'Male',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:10Z'
  },
  {
    id: 'real-11',
    name: 'Myint Myat Hein',
    date_of_birth: '2012-11-04',
    weight: 64.5,
    gender: 'Male',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:11Z'
  },
  {
    id: 'real-12',
    name: 'Myat Bhone Khant',
    date_of_birth: '2016-11-03',
    weight: 28.9,
    gender: 'Male',
    belt_color: 'Green',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:12Z'
  },
  {
    id: 'real-13',
    name: 'Shwe Yaung Hlaing',
    date_of_birth: '2016-04-27',
    weight: 57.0,
    gender: 'Male',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:13Z'
  },
  {
    id: 'real-14',
    name: 'Shin Thant Hlaing',
    date_of_birth: '2016-04-27',
    weight: 37.0,
    gender: 'Male',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:14Z'
  },
  {
    id: 'real-15',
    name: 'May Phyo Thant',
    date_of_birth: '2004-02-20',
    weight: 43.8,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:15Z'
  },
  {
    id: 'real-16',
    name: 'Yati Hmue Kyaw',
    date_of_birth: '2011-06-08',
    weight: 43.0,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:16Z'
  },
  {
    id: 'real-17',
    name: 'Lin Thuta Min',
    date_of_birth: '2018-08-29',
    weight: 16.0,
    gender: 'Male',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:17Z'
  },
  {
    id: 'real-18',
    name: 'Win Lae Shwe Yi',
    date_of_birth: '2012-03-21',
    weight: 41.0,
    gender: 'Female',
    belt_color: 'Green',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:18Z'
  },
  {
    id: 'real-19',
    name: 'Yaung Zin',
    date_of_birth: '2005-08-31',
    weight: 49.2,
    gender: 'Male',
    belt_color: 'Green',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:19Z'
  },
  {
    id: 'real-20',
    name: 'Theint Kyi PhyuKoKo',
    date_of_birth: '2003-10-31',
    weight: 51.5,
    gender: 'Female',
    belt_color: 'Green',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:20Z'
  },
  {
    id: 'real-21',
    name: 'Pyae Phyo Thaw',
    date_of_birth: '2003-12-05',
    weight: 68.5,
    gender: 'Male',
    belt_color: 'Yellow',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:21Z'
  },
  {
    id: 'real-22',
    name: 'Akaya Moe Thar',
    date_of_birth: '2021-07-25',
    weight: 14.1,
    gender: 'Male',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:22Z'
  },
  {
    id: 'real-23',
    name: 'Sai Noom Han Hleng',
    date_of_birth: '2006-12-02',
    weight: 60.0,
    gender: 'Male',
    belt_color: 'Yellow',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:23Z'
  },
  {
    id: 'real-24',
    name: 'Myint Myat Thazin',
    date_of_birth: '2003-01-23',
    weight: 54.0,
    gender: 'Female',
    belt_color: 'Green',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:24Z'
  },
  {
    id: 'real-25',
    name: 'Aung Myo Khant',
    date_of_birth: '2010-01-10',
    weight: 61.0,
    gender: 'Male',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:25Z'
  },
  {
    id: 'real-26',
    name: 'Khaing Thazin Thin',
    date_of_birth: '2016-01-04',
    weight: 38.0,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:26Z'
  },
  {
    id: 'real-27',
    name: 'Khin Shin Thant',
    date_of_birth: '2010-10-07',
    weight: 52.0,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:27Z'
  },
  {
    id: 'real-28',
    name: 'Kaung Khant Hein',
    date_of_birth: '2005-01-01',
    weight: 57.7,
    gender: 'Male',
    belt_color: 'Green',
    club_name: 'Phoenix',
    notes: 'Birth Year 2005 (Age 21)',
    created_at: '2026-09-02T10:00:28Z'
  },
  {
    id: 'real-29',
    name: 'Way Yan Hein',
    date_of_birth: '2018-12-12',
    weight: 38.0,
    gender: 'Male',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:29Z'
  },
  {
    id: 'real-30',
    name: 'Eaindray Min Thu',
    date_of_birth: '2014-08-24',
    weight: 35.45,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:30Z'
  },
  {
    id: 'real-31',
    name: 'Kay Zin Lin',
    date_of_birth: '2008-08-18',
    weight: 59.0,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:31Z'
  },
  {
    id: 'real-32',
    name: 'Su Su Naing',
    date_of_birth: '2007-10-10',
    weight: 42.45,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:32Z'
  },
  {
    id: 'real-33',
    name: 'Nan Cherry Ko',
    date_of_birth: '2007-04-02',
    weight: 42.6,
    gender: 'Female',
    belt_color: 'White',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:33Z'
  },
  {
    id: 'real-34',
    name: 'Hannadi Myo Thein',
    date_of_birth: '2012-08-16',
    weight: 36.5,
    gender: 'Female',
    belt_color: 'Green',
    club_name: 'Phoenix',
    created_at: '2026-09-02T10:00:34Z'
  }
];

export function matchAgeDivision(typedCategory: string, dateOfBirth: string): boolean {
  if (!typedCategory || !typedCategory.trim()) return true;
  const raw = typedCategory.trim();
  const cleaned = raw.toLowerCase();
  const age = calculateAge(dateOfBirth);

  // Normalize Burmese digits (၀-၉) to 0-9
  const normalizedNumbers = cleaned.replace(/[၀-၉]/g, (d) =>
    (d.charCodeAt(0) - 0x1040).toString()
  );

  const norm = normalizedNumbers.replace(/[\s\-_]+/g, '');

  // Exact U-bracket divisions (U8, U10, U12, U14, U16, U18, Over 18)
  if (norm === 'u8' || norm === 'under8' || norm === '<8' || norm === '<=8' || cleaned.includes('၈နှစ်နှင့်အောက်')) {
    return age <= 8;
  }
  if (norm === 'u10' || norm === 'under10' || norm === '9-10' || norm === '9to10') {
    return age >= 9 && age <= 10;
  }
  if (norm === 'u12' || norm === 'under12' || norm === '11-12' || norm === '11to12') {
    return age >= 11 && age <= 12;
  }
  if (norm === 'u14' || norm === 'under14' || norm === '13-14' || norm === '13to14') {
    return age >= 13 && age <= 14;
  }
  if (norm === 'u16' || norm === 'under16' || norm === '15-16' || norm === '15to16') {
    return age >= 15 && age <= 16;
  }
  if (norm === 'u18' || norm === 'under18' || norm === '17-18' || norm === '17to18') {
    return age >= 17 && age <= 18;
  }
  if (
    norm === 'over18' ||
    norm === '>18' ||
    norm === '>=19' ||
    norm === '18over' ||
    norm === 'above18' ||
    cleaned.includes('over 18') ||
    cleaned.includes('၁၈ နှစ်အထက်') ||
    cleaned.includes('၁၈နှစ်အထက်')
  ) {
    return age > 18;
  }

  const cat = getAgeCategory(age).toLowerCase();

  // Burmese age category keywords
  if (cleaned.includes('ကလေး') && cat === 'child') return true;
  if (cleaned.includes('ကာဒက်') && cat === 'cadet') return true;
  if (cleaned.includes('လူငယ်') && cat === 'junior') return true;
  if (cleaned.includes('လူကြီး') && cat === 'senior') return true;
  if (cleaned.includes('ဝါရင့်') && cat === 'ultra') return true;

  // Direct category string matching (e.g. "cadet", "junior", "senior", "child", "ultra")
  if (cat.includes(cleaned) || cleaned.includes(cat)) {
    return true;
  }

  // Check if user entered range e.g. "12-14" or "12 - 14" or "12 to 14"
  const rangeMatch = normalizedNumbers.match(/^(\d{1,2})\s*[-–—to]+\s*(\d{1,2})$/);
  if (rangeMatch) {
    const minAge = parseInt(rangeMatch[1], 10);
    const maxAge = parseInt(rangeMatch[2], 10);
    return age >= minAge && age <= maxAge;
  }

  // Check if user entered "< 12" or "u12" or "under 12" or "u-12"
  const underMatch = normalizedNumbers.match(/^(?:<|<=|u-?|under)\s*(\d{1,2})$/);
  if (underMatch) {
    const maxAge = parseInt(underMatch[1], 10);
    return age <= maxAge;
  }

  // Check if user entered "> 18" or "18+"
  const overMatch = normalizedNumbers.match(/^(?:>|>=)\s*(\d{1,2})$/) || normalizedNumbers.match(/^(\d{1,2})\s*\+$/);
  if (overMatch) {
    const minAge = parseInt(overMatch[1], 10);
    return age >= minAge;
  }

  // Check if user entered a single number (exact age)
  const singleAge = parseInt(normalizedNumbers, 10);
  if (!isNaN(singleAge) && singleAge.toString() === normalizedNumbers) {
    return age === singleAge;
  }

  return false;
}
