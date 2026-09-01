export type Gender = 'Male' | 'Female' | 'Other';

export type BeltColor = 
  | 'White'
  | 'Yellow'
  | 'Green'
  | 'Blue'
  | 'Red'
  | 'Black'
  | 'Poom'
  | 'Brown'
  | 'Orange'
  | 'Purple';

export interface Player {
  id: string;
  name: string;
  date_of_birth: string; // ISO YYYY-MM-DD
  weight: number; // in kilograms
  gender: Gender;
  belt_color: BeltColor | string;
  club_name: string;
  contact_number?: string | null;
  photo_url?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type PlayerFormData = {
  name: string;
  date_of_birth: string;
  weight: number | string;
  gender: Gender;
  belt_color: string;
  club_name: string;
  contact_number?: string;
  photo_url?: string;
  notes?: string;
};

export type AgeCategory = 'Child' | 'Cadet' | 'Junior' | 'Senior' | 'Ultra';

export interface WTDivision {
  name: string;
  category: AgeCategory;
  gender: Gender;
  limitText: string;
  minKg: number;
  maxKg: number;
}

export interface PlayerFilters {
  query: string;
  gender: string;
  belt: string;
  club: string;
  ageCategory: string;
  minWeight: string;
  maxWeight: string;
  sortBy: 'name' | 'weight' | 'age' | 'club' | 'created_at';
  sortOrder: 'asc' | 'desc';
}
