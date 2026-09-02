import { Player } from '@/types/player';
import { BracketData, BracketMatch, BracketParticipant, BracketRound, DrawMode } from '@/types/bracket';
import { BELT_RANKS, getTaekwondoDivision } from './taekwondo';

/**
 * Calculates bracket size (power of 2 >= n), number of rounds, and byes needed.
 */
export function calculateBracketPowerOfTwo(n: number): {
  bracketSize: number;
  totalRounds: number;
  byeCount: number;
} {
  if (n <= 2) {
    return { bracketSize: 2, totalRounds: 1, byeCount: Math.max(0, 2 - n) };
  }
  const power = Math.ceil(Math.log2(n));
  const bracketSize = Math.pow(2, power);
  return {
    bracketSize,
    totalRounds: power,
    byeCount: bracketSize - n
  };
}

/**
 * Generates international standard tournament seed placement.
 * Ensures Seed 1 and Seed 2 are placed in opposite halves of the bracket,
 * Seed 3 and 4 in opposite quarters, etc.
 *
 * For size = 8: [1, 8, 4, 5, 2, 7, 3, 6]
 */
export function getStandardSeedOrder(size: number): number[] {
  let seeds = [1, 2];
  while (seeds.length < size) {
    const nextSize = seeds.length * 2;
    const nextSeeds: number[] = [];
    for (const s of seeds) {
      nextSeeds.push(s);
      nextSeeds.push(nextSize + 1 - s);
    }
    seeds = nextSeeds;
  }
  return seeds;
}

/**
 * Shuffles array using Fisher-Yates algorithm.
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Assigns players to seeds based on selected DrawMode:
 * - 'random': Standard lottery draw (WT style)
 * - 'seeded': Highest belt rank / Dan receives top seeds & byes
 * - 'club-separated': Distributes teammates across opposite halves to prevent Round 1 club clashes
 */
export function prepareSeededPlayers(players: Player[], bracketSize: number, drawMode: DrawMode): (Player | null)[] {
  const seedOrder = getStandardSeedOrder(bracketSize);
  const n = players.length;

  if (drawMode === 'weight-matched') {
    const sorted = [...players].sort((a, b) => Number(a.weight) - Number(b.weight));
    const totalMatches = bracketSize / 2;
    const byeCount = bracketSize - n;
    const slots: (Player | null)[] = new Array(bracketSize).fill(null);

    const isByeMatch: boolean[] = new Array(totalMatches).fill(false);
    if (byeCount > 0) {
      for (let b = 0; b < byeCount; b++) {
        const matchIdx = b % 2 === 0 ? totalMatches - 1 - Math.floor(b / 2) : Math.floor(b / 2);
        isByeMatch[matchIdx] = true;
      }
    }

    let pIdx = 0;
    for (let m = 0; m < totalMatches; m++) {
      if (isByeMatch[m]) {
        slots[m * 2] = sorted[pIdx++] ?? null;
        slots[m * 2 + 1] = null; // BYE
      } else {
        slots[m * 2] = sorted[pIdx++] ?? null;
        slots[m * 2 + 1] = sorted[pIdx++] ?? null;
      }
    }

    return slots;
  }

  let orderedPlayers: Player[] = [];

  if (drawMode === 'seeded') {
    // Sort by belt rank index descending (Black -> Poom -> Brown ...), then weight
    orderedPlayers = [...players].sort((a, b) => {
      const rankA = BELT_RANKS[a.belt_color]?.rankIndex ?? 0;
      const rankB = BELT_RANKS[b.belt_color]?.rankIndex ?? 0;
      if (rankB !== rankA) return rankB - rankA;
      return Number(b.weight) - Number(a.weight);
    });
  } else if (drawMode === 'club-separated') {
    // Group by club
    const clubMap: Record<string, Player[]> = {};
    for (const p of shuffleArray(players)) {
      const club = (p.club_name || 'Individual').trim().toLowerCase();
      if (!clubMap[club]) clubMap[club] = [];
      clubMap[club].push(p);
    }

    // Interleave across clubs
    const clubs = Object.keys(clubMap);
    let done = false;
    let index = 0;
    while (!done) {
      let addedAny = false;
      for (const c of clubs) {
        if (clubMap[c].length > index) {
          orderedPlayers.push(clubMap[c][index]);
          addedAny = true;
        }
      }
      index++;
      if (!addedAny) done = true;
    }
  } else {
    // Default: Random lottery draw
    orderedPlayers = shuffleArray(players);
  }

  // Map each seed number (1..bracketSize) to a Player or null (BYE)
  // Seeds 1..n get players, seeds (n+1)..bracketSize become BYEs
  const seedToPlayerMap = new Map<number, Player | null>();
  for (let s = 1; s <= bracketSize; s++) {
    if (s <= n) {
      seedToPlayerMap.set(s, orderedPlayers[s - 1]);
    } else {
      seedToPlayerMap.set(s, null); // BYE
    }
  }

  // Return slots in standard bracket order
  return seedOrder.map((seedNum) => seedToPlayerMap.get(seedNum) ?? null);
}

/**
 * Returns round display name based on total rounds and current round index.
 */
export function getRoundName(roundIndex: number, totalRounds: number, lang: 'en' | 'my' = 'en'): string {
  const matchesInRound = Math.pow(2, totalRounds - 1 - roundIndex);

  if (matchesInRound === 1) {
    return lang === 'my' ? 'ဗိုလ်လုပွဲ (Final)' : 'Championship Final';
  }
  if (matchesInRound === 2) {
    return lang === 'my' ? 'ဆီမီးဖိုင်နယ် (Semifinals)' : 'Semifinals';
  }
  if (matchesInRound === 4) {
    return lang === 'my' ? 'ကွာတားဖိုင်နယ် (Quarterfinals)' : 'Quarterfinals';
  }
  if (matchesInRound === 8) {
    return lang === 'my' ? '၁၆ ဦးအဆင့် (Round of 16)' : 'Round of 16';
  }
  if (matchesInRound === 16) {
    return lang === 'my' ? '၃၂ ဦးအဆင့် (Round of 32)' : 'Round of 32';
  }
  return lang === 'my' ? `အဆင့် ${roundIndex + 1} (Prelims)` : `Round ${roundIndex + 1}`;
}

/**
 * Generates a complete Single Elimination Tournament Bracket with Byes.
 * Byes automatically advance fighters to Round 2 without manual input.
 */
export function generateSingleEliminationBracket(
  players: Player[],
  divisionName = 'Open Division',
  drawMode: DrawMode = 'random',
  lang: 'en' | 'my' = 'en'
): BracketData {
  if (players.length < 2) {
    throw new Error('At least 2 competitors are required to generate a tournament bracket.');
  }

  const { bracketSize, totalRounds, byeCount } = calculateBracketPowerOfTwo(players.length);
  const slots = prepareSeededPlayers(players, bracketSize, drawMode);
  const seedOrder = getStandardSeedOrder(bracketSize);

  // Initialize all rounds & matches
  const rounds: BracketRound[] = [];

  for (let r = 0; r < totalRounds; r++) {
    const matchesInRound = Math.pow(2, totalRounds - 1 - r);
    const matches: BracketMatch[] = [];

    for (let m = 0; m < matchesInRound; m++) {
      const matchId = `R${r + 1}-M${m + 1}`;
      const isLastRound = r === totalRounds - 1;
      const nextMatchId = isLastRound ? null : `R${r + 2}-M${Math.floor(m / 2) + 1}`;
      const nextMatchSlot: 1 | 2 | null = isLastRound ? null : ((m % 2 === 0 ? 1 : 2) as 1 | 2);

      if (r === 0) {
        // Round 1 matches come directly from prepared slots
        const p1 = slots[m * 2];
        const p2 = slots[m * 2 + 1];
        const weightSorted = drawMode === 'weight-matched'
          ? [...players].sort((a, b) => Number(a.weight) - Number(b.weight))
          : null;
        const seed1 = weightSorted && p1
          ? weightSorted.findIndex((x) => x.id === p1.id) + 1
          : seedOrder[m * 2];
        const seed2 = weightSorted && p2
          ? weightSorted.findIndex((x) => x.id === p2.id) + 1
          : seedOrder[m * 2 + 1];

        const isP1Bye = p1 === null;
        const isP2Bye = p2 === null;
        const isByeMatch = isP1Bye || isP2Bye;

        let winnerId: string | null = null;
        let status: 'pending' | 'completed' | 'bye_advanced' = 'pending';

        if (isByeMatch) {
          status = 'bye_advanced';
          winnerId = p1 ? p1.id : p2 ? p2.id : null;
        }

        const participant1: BracketParticipant = {
          player: p1,
          isBye: isP1Bye,
          seed: p1 && seed1 <= players.length ? seed1 : undefined,
          corner: 'hong' // Red corner
        };

        const participant2: BracketParticipant = {
          player: p2,
          isBye: isP2Bye,
          seed: p2 && seed2 <= players.length ? seed2 : undefined,
          corner: 'chong' // Blue corner
        };

        matches.push({
          id: matchId,
          roundIndex: r,
          matchIndex: m,
          participant1,
          participant2,
          winnerId,
          isByeMatch,
          nextMatchId,
          nextMatchSlot,
          status
        });
      } else {
        // Subsequent round matches initially empty TBD
        matches.push({
          id: matchId,
          roundIndex: r,
          matchIndex: m,
          participant1: { player: null, isBye: false, corner: 'hong' },
          participant2: { player: null, isBye: false, corner: 'chong' },
          winnerId: null,
          isByeMatch: false,
          nextMatchId,
          nextMatchSlot,
          status: 'pending'
        });
      }
    }

    rounds.push({
      roundIndex: r,
      name: getRoundName(r, totalRounds, lang),
      matches
    });
  }

  // Propagate Round 1 Byes directly into Round 2!
  if (totalRounds > 1) {
    const round1 = rounds[0];
    const round2 = rounds[1];

    for (const m of round1.matches) {
      if (m.status === 'bye_advanced' && m.winnerId && m.nextMatchId && m.nextMatchSlot) {
        const winningPlayer = m.participant1.player || m.participant2.player;
        const destMatch = round2.matches.find((x) => x.id === m.nextMatchId);
        if (destMatch && winningPlayer) {
          if (m.nextMatchSlot === 1) {
            destMatch.participant1.player = winningPlayer;
            destMatch.participant1.seed = m.participant1.seed || m.participant2.seed;
          } else {
            destMatch.participant2.player = winningPlayer;
            destMatch.participant2.seed = m.participant1.seed || m.participant2.seed;
          }
        }
      }
    }
  }

  return {
    divisionName,
    totalCompetitors: players.length,
    bracketSize,
    byeCount,
    rounds,
    champion: null,
    runnerUp: null,
    bronzeMedalists: [],
    drawMode,
    createdAt: new Date().toISOString()
  };
}

/**
 * Advances winner of a match, propagates to the next round, and recalculates podium.
 */
export function advanceBracketWinner(
  bracket: BracketData,
  matchId: string,
  winnerPlayerId: string,
  score?: string
): BracketData {
  const newBracket: BracketData = JSON.parse(JSON.stringify(bracket));

  let targetMatch: BracketMatch | null = null;
  let targetRoundIndex = -1;

  for (let r = 0; r < newBracket.rounds.length; r++) {
    for (const m of newBracket.rounds[r].matches) {
      if (m.id === matchId) {
        targetMatch = m;
        targetRoundIndex = r;
        break;
      }
    }
    if (targetMatch) break;
  }

  if (!targetMatch) return bracket;

  const winnerParticipant =
    targetMatch.participant1.player?.id === winnerPlayerId
      ? targetMatch.participant1
      : targetMatch.participant2;

  const losingParticipant =
    targetMatch.participant1.player?.id === winnerPlayerId
      ? targetMatch.participant2
      : targetMatch.participant1;

  if (!winnerParticipant.player) return bracket;

  targetMatch.winnerId = winnerPlayerId;
  targetMatch.status = 'completed';
  if (score !== undefined) {
    if (targetMatch.participant1.player?.id === winnerPlayerId) {
      targetMatch.participant1.score = score;
    } else {
      targetMatch.participant2.score = score;
    }
  }

  // If there is a subsequent round, update that match's slot
  if (targetMatch.nextMatchId && targetMatch.nextMatchSlot && targetRoundIndex + 1 < newBracket.rounds.length) {
    const nextRound = newBracket.rounds[targetRoundIndex + 1];
    const nextMatch = nextRound.matches.find((m) => m.id === targetMatch!.nextMatchId);

    if (nextMatch) {
      const slot = targetMatch.nextMatchSlot;
      const prevPlayerInSlot = slot === 1 ? nextMatch.participant1.player : nextMatch.participant2.player;

      // Update slot
      if (slot === 1) {
        nextMatch.participant1.player = winnerParticipant.player;
        nextMatch.participant1.seed = winnerParticipant.seed;
      } else {
        nextMatch.participant2.player = winnerParticipant.player;
        nextMatch.participant2.seed = winnerParticipant.seed;
      }

      // If the player in this slot changed, clear downstream matches if the old player won them
      if (prevPlayerInSlot && prevPlayerInSlot.id !== winnerPlayerId) {
        clearDownstreamPlayer(newBracket, targetRoundIndex + 1, nextMatch.id, prevPlayerInSlot.id);
      }
    }
  } else {
    // This was the Championship Final!
    newBracket.champion = winnerParticipant.player;
    newBracket.runnerUp = losingParticipant.player || null;
  }

  // Recalculate Bronze medalists (losers of semifinals)
  newBracket.bronzeMedalists = [];
  if (newBracket.rounds.length >= 2) {
    const semiRound = newBracket.rounds[newBracket.rounds.length - 2];
    for (const semiMatch of semiRound.matches) {
      if (semiMatch.status === 'completed' && semiMatch.winnerId) {
        const loser =
          semiMatch.participant1.player?.id === semiMatch.winnerId
            ? semiMatch.participant2.player
            : semiMatch.participant1.player;
        if (loser && !newBracket.bronzeMedalists.some((b) => b.id === loser.id)) {
          newBracket.bronzeMedalists.push(loser);
        }
      }
    }
  }

  return newBracket;
}

/**
 * Recursively clears an old player from downstream matches if a match winner is changed.
 */
function clearDownstreamPlayer(
  bracket: BracketData,
  startRoundIndex: number,
  matchId: string,
  oldPlayerId: string
) {
  for (let r = startRoundIndex; r < bracket.rounds.length; r++) {
    const round = bracket.rounds[r];
    for (const m of round.matches) {
      if (m.winnerId === oldPlayerId) {
        m.winnerId = null;
        m.status = 'pending';
        if (m.participant1.score) m.participant1.score = undefined;
        if (m.participant2.score) m.participant2.score = undefined;

        if (m.nextMatchId && m.nextMatchSlot && r + 1 < bracket.rounds.length) {
          const nextMatch = bracket.rounds[r + 1].matches.find((x) => x.id === m.nextMatchId);
          if (nextMatch) {
            if (m.nextMatchSlot === 1 && nextMatch.participant1.player?.id === oldPlayerId) {
              nextMatch.participant1.player = null;
              nextMatch.participant1.seed = undefined;
            } else if (m.nextMatchSlot === 2 && nextMatch.participant2.player?.id === oldPlayerId) {
              nextMatch.participant2.player = null;
              nextMatch.participant2.seed = undefined;
            }
          }
        }
      }
    }
  }

  // Clear champion/runner-up if impacted
  if (bracket.champion?.id === oldPlayerId) {
    bracket.champion = null;
  }
  if (bracket.runnerUp?.id === oldPlayerId) {
    bracket.runnerUp = null;
  }
}

/**
 * Resets a match winner and clears downstream propagation.
 */
export function resetBracketMatch(bracket: BracketData, matchId: string): BracketData {
  const newBracket: BracketData = JSON.parse(JSON.stringify(bracket));

  for (let r = 0; r < newBracket.rounds.length; r++) {
    const m = newBracket.rounds[r].matches.find((x) => x.id === matchId);
    if (m && m.status !== 'bye_advanced') {
      const oldWinnerId = m.winnerId;
      m.winnerId = null;
      m.status = 'pending';
      if (m.participant1.score) m.participant1.score = undefined;
      if (m.participant2.score) m.participant2.score = undefined;

      if (oldWinnerId) {
        clearDownstreamPlayer(newBracket, r, matchId, oldWinnerId);
      }
      break;
    }
  }

  return newBracket;
}

/**
 * Groups players into:
 * 1. Primary Age & Gender Divisions (e.g. "Senior Female", "Senior Male", "Cadet Female", etc.)
 * 2. Specific WT Weight Classes (e.g. "Senior Female - Finweight (-46 kg)", etc.)
 */
export function groupPlayersByDivision(players: Player[]): Record<string, Player[]> {
  const groups: Record<string, Player[]> = {};

  // 1. Primary Age & Gender Category Groups
  for (const player of players) {
    const div = getTaekwondoDivision(Number(player.weight), player.gender, player.date_of_birth);
    const primaryKey = `${div.category} ${player.gender}`;
    if (!groups[primaryKey]) {
      groups[primaryKey] = [];
    }
    groups[primaryKey].push(player);
  }

  // 2. Specific WT Weight Class Groups
  for (const player of players) {
    const div = getTaekwondoDivision(Number(player.weight), player.gender, player.date_of_birth);
    const weightKey = `${div.category} ${player.gender} - ${div.divisionName} (${div.weightClass})`;
    if (!groups[weightKey]) {
      groups[weightKey] = [];
    }
    groups[weightKey].push(player);
  }

  return groups;
}

/**
 * Returns division keys sorted logically:
 * - Primary Age & Gender categories with >= 2 competitors first (sorted by athlete count descending)
 * - Specific Weight classes with >= 2 competitors next
 * - Single-competitor divisions last
 */
export function getSortedDivisionKeys(groups: Record<string, Player[]>): string[] {
  return Object.keys(groups).sort((a, b) => {
    const isPrimaryA = !a.includes(' - ');
    const isPrimaryB = !b.includes(' - ');
    const countA = groups[a]?.length || 0;
    const countB = groups[b]?.length || 0;

    // Primary categories first
    if (isPrimaryA && !isPrimaryB) return -1;
    if (!isPrimaryA && isPrimaryB) return 1;

    // Divisions with >= 2 athletes before single-athlete divisions
    const validA = countA >= 2 ? 1 : 0;
    const validB = countB >= 2 ? 1 : 0;
    if (validB !== validA) return validB - validA;

    // Sort by count descending
    if (countB !== countA) return countB - countA;

    return a.localeCompare(b);
  });
}

