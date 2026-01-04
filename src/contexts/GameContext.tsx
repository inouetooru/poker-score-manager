import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Player, Event, Round, GameResult, AppData } from '../types/definitions';

interface GameContextType {
  players: Player[];
  events: Event[];
  addPlayer: (name: string) => Player;
  deletePlayer: (playerId: string) => void;
  resetData: () => void;
  createEvent: (name: string, date: string, rate: number, umaSettings: number[], startPoints: number, returnPoints: number, location?: string, yakitori?: number) => Event;
  createEventWithRound: (name: string, date: string, rate: number, location: string | undefined, roundResults: GameResult[], roundRate: number, umaSettings: number[], startPoints: number, returnPoints: number, yakitori?: number) => Event;
  addRoundToEvent: (eventId: string, results: GameResult[], roundRate: number, umaSettings: number[], startPoints: number, returnPoints: number, yakitori?: number, notes?: string) => void;
  updateRound: (eventId: string, roundId: string, results: GameResult[], roundRate: number, umaSettings: number[], startPoints: number, returnPoints: number, yakitori?: number, notes?: string) => void;
  deleteRound: (eventId: string, roundId: string) => void;
  deleteEvent: (id: string) => void;
  getPlayerData: (playerId: string) => { totalProfit: number; gamesPlayed: number; averageRank: number; rankDistribution: { rank1: number; rank2: number; rank3: number; rank4: number } };
  getPlayerEventData: (playerId: string) => { eventId: string; eventName: string; eventDate: string; totalProfit: number; gamesPlayed: number; averageRank: number }[];
  getPlayerHistory: (playerId: string) => { date: string; score: number; cumulativeScore: number; rank: number; gameNumber: number }[];
  importData: (data: AppData) => void;
  exportData: () => string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useLocalStorage<Player[]>('mahjong-players', []);
  const [events, setEvents] = useLocalStorage<Event[]>('mahjong-events', []);

  // Functional update for addPlayer to be safe, though not strictly required if only one update happens
  const addPlayer = (name: string) => {
    // We need to check existing in the current state. 
    // Note: If multiple updates happen, 'players' might be stale in this check.
    // Ideally we should use setPlayers(prev => ...) but checking duplicates is harder without reading prev.
    // For now, addPlayer is usually a single action, so we keep it simple or use prev.
    // But since we need to return the new player, and we can't get it easily from setPlayers callback...
    // Let's rely on 'players' being reasonably up to date for this check.
    const existing = players.find(p => p.name === name);
    if (existing) return existing;

    const newPlayer: Player = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
    };
    setPlayers(prev => [...prev, newPlayer]);
    return newPlayer;
  };

  const deletePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const resetData = () => {
    setPlayers([]);
    setEvents([]);
    localStorage.clear();
    // Force a reload to ensure clean state if needed, but state updates should be enough
  };

  const createEvent = (name: string, date: string, rate: number, umaSettings: number[], startPoints: number, returnPoints: number, location?: string, yakitori?: number) => {
    const newEvent: Event = {
      id: generateId(),
      name,
      date,
      rate,
      umaSettings,
      startPoints,
      returnPoints,
      yakitori,
      location,
      rounds: [],
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };

  const createEventWithRound = (name: string, date: string, rate: number, location: string | undefined, roundResults: GameResult[], roundRate: number, umaSettings: number[], startPoints: number, returnPoints: number, yakitori?: number) => {
    const newEvent: Event = {
      id: generateId(),
      name,
      date,
      rate,
      umaSettings,
      startPoints,
      returnPoints,
      yakitori,
      location,
      rounds: [{
        id: generateId(),
        roundNumber: 1,
        results: roundResults,
        rate: roundRate,
        umaSettings,
        startPoints,
        returnPoints,
        yakitori
      }],
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };

  const addRoundToEvent = (eventId: string, results: GameResult[], roundRate: number, umaSettings: number[], startPoints: number, returnPoints: number, yakitori?: number, notes?: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const newRound: Round = {
          id: generateId(),
          roundNumber: event.rounds.length + 1,
          results,
          rate: roundRate,
          umaSettings,
          startPoints,
          returnPoints,
          yakitori,
          notes,
        };
        return { ...event, rounds: [...event.rounds, newRound] };
      }
      return event;
    }));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const updateRound = (eventId: string, roundId: string, results: GameResult[], roundRate: number, umaSettings: number[], startPoints: number, returnPoints: number, yakitori?: number, notes?: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const updatedRounds = event.rounds.map(round => {
          if (round.id === roundId) {
            return {
              ...round,
              results,
              rate: roundRate,
              umaSettings,
              startPoints,
              returnPoints,
              yakitori,
              notes,
            };
          }
          return round;
        });
        return { ...event, rounds: updatedRounds };
      }
      return event;
    }));
  };

  const deleteRound = (eventId: string, roundId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const updatedRounds = event.rounds.filter(round => round.id !== roundId);
        // Update round numbers to be sequential
        const reorderedRounds = updatedRounds.map((round, index) => ({
          ...round,
          roundNumber: index + 1,
        }));
        return { ...event, rounds: reorderedRounds };
      }
      return event;
    }));
  };

  const getPlayerData = (playerId: string) => {
    let totalProfit = 0;
    let gamesPlayed = 0;
    let totalRank = 0;
    let rank1 = 0;
    let rank2 = 0;
    let rank3 = 0;
    let rank4 = 0;

    events.forEach(event => {
      event.rounds.forEach(round => {
        const result = round.results.find((r: GameResult) => r.playerId === playerId);
        if (result) {
          totalProfit += result.score;
          totalRank += result.rank;
          gamesPlayed++;

          // Count rank distribution
          if (result.rank === 1) rank1++;
          else if (result.rank === 2) rank2++;
          else if (result.rank === 3) rank3++;
          else if (result.rank === 4) rank4++;
        }
      });
    });

    const averageRank = gamesPlayed > 0 ? totalRank / gamesPlayed : 0;
    const rankDistribution = { rank1, rank2, rank3, rank4 };

    return { totalProfit, gamesPlayed, averageRank, rankDistribution };
  };

  const getPlayerHistory = (playerId: string) => {
    const history: { date: string; score: number; cumulativeScore: number; rank: number; gameNumber: number }[] = [];
    let cumulativeScore = 0;
    let gameNumber = 0;

    // Flatten all rounds with their event dates
    const allRounds: { date: string; round: Round }[] = [];
    events.forEach(event => {
      event.rounds.forEach(round => {
        allRounds.push({ date: event.date, round });
      });
    });

    // Sort by date
    allRounds.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    allRounds.forEach(({ date, round }) => {
      const result = round.results.find((r: GameResult) => r.playerId === playerId);
      if (result) {
        gameNumber++;
        // Use the score directly from result (already calculated with uma)
        const actualScore = result.score;
        cumulativeScore += actualScore;
        history.push({
          date,
          score: actualScore,
          cumulativeScore,
          rank: result.rank,
          gameNumber,
        });
      }
    });

    return history;
  };

  const getPlayerEventData = (playerId: string) => {
    const eventData: { eventId: string; eventName: string; eventDate: string; totalProfit: number; gamesPlayed: number; averageRank: number }[] = [];

    events.forEach(event => {
      let totalProfit = 0;
      let gamesPlayed = 0;
      let totalRank = 0;

      event.rounds.forEach(round => {
        const result = round.results.find((r: GameResult) => r.playerId === playerId);
        if (result) {
          totalProfit += result.score;
          totalRank += result.rank;
          gamesPlayed++;
        }
      });

      if (gamesPlayed > 0) {
        const averageRank = totalRank / gamesPlayed;
        eventData.push({
          eventId: event.id,
          eventName: event.name,
          eventDate: event.date,
          totalProfit,
          gamesPlayed,
          averageRank,
        });
      }
    });

    return eventData;
  };

  const importData = (data: AppData) => {
    if (data.players) setPlayers(data.players);
    if (data.events) setEvents(data.events);
  };

  const exportData = () => {
    return JSON.stringify({ players, events }, null, 2);
  };

  return (
    <GameContext.Provider value={{
      players,
      events,
      addPlayer,
      deletePlayer,
      resetData,
      createEvent,
      createEventWithRound,
      addRoundToEvent,
      updateRound,
      deleteRound,
      deleteEvent,
      getPlayerData,
      getPlayerEventData,
      getPlayerHistory,
      importData,
      exportData
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
