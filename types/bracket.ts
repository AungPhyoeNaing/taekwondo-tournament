import { Player } from './player';

export type DrawMode = 'random' | 'seeded' | 'club-separated' | 'weight-matched' | 'custom';

export interface CustomBoutPair {
  id: string;
  player1Id: string | null; // Red Corner (Hong)
  player2Id: string | null; // Blue Corner (Chong) or null for BYE
}

export type CornerColor = 'hong' | 'chong'; // Hong = Red, Chong = Blue in Taekwondo

export interface BracketParticipant {
  player: Player | null; // null represents BYE or TBD
  isBye: boolean;
  seed?: number;
  corner: CornerColor;
  score?: number | string;
}

export interface BracketMatch {
  id: string; // e.g. "R1-M1"
  roundIndex: number; // 0-indexed (0: Round 1, 1: Round 2 / Quarters, etc.)
  matchIndex: number; // index within this round
  participant1: BracketParticipant;
  participant2: BracketParticipant;
  winnerId: string | null; // player id or 'bye' if auto-advanced
  isByeMatch: boolean;
  nextMatchId: string | null; // destination match id in subsequent round
  nextMatchSlot: 1 | 2 | null; // which slot (1 or 2) in the next match
  status: 'pending' | 'completed' | 'bye_advanced';
}

export interface BracketRound {
  roundIndex: number;
  name: string; // e.g. "Round of 16", "Quarterfinals", "Semifinals", "Final"
  matches: BracketMatch[];
}

export interface BracketData {
  divisionName: string;
  totalCompetitors: number;
  bracketSize: number; // power of 2 (e.g. 4, 8, 16, 32)
  byeCount: number;
  rounds: BracketRound[];
  champion: Player | null;
  runnerUp: Player | null;
  bronzeMedalists: Player[];
  drawMode: DrawMode;
  createdAt: string;
}
