import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Player, Event, Round, GameResult, AppData } from '../types/definitions';

interface GameContextType {
  players: Player[];
  events: Event[];
  addPlayer: (name: string) => Player;
  deletePlayer: (playerId: string) => void;
  resetData: () => void;
  createEvent: (name: string, date: string, rate: number, location?: string) => Event;
  createEventWithRound: (name: string, date: string, rate: number, location: string | undefined, roundResults: GameResult[], roundRate: number) => Event;
  addRoundToEvent: (eventId: string, results: GameResult[], roundRate: number, notes?: string) => void;
  deleteEvent: (id: string) => void;
  getPlayerData: (playerId: string) => { totalProfit: number; gamesPlayed: number; averageRank?: number };
  getPlayerHistory: (playerId: string) => { date: string; profit: number; cumulativeProfit: number }[];
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
  const [players, setPlayers] = useLocalStorage<Player[]>('poker-players', []);
  const [events, setEvents] = useLocalStorage<Event[]>('poker-events', []);

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

  const createEvent = (name: string, date: string, rate: number, location?: string) => {
    const newEvent: Event = {
      id: generateId(),
      name,
      date,
      rate,
      location,
      rounds: [],
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };

  const createEventWithRound = (name: string, date: string, rate: number, location: string | undefined, roundResults: GameResult[], roundRate: number) => {
    const newEvent: Event = {
      id: generateId(),
      name,
      date,
      rate,
      location,
      rounds: [{
        id: generateId(),
        roundNumber: 1,
        results: roundResults,
        rate: roundRate
      }],
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };

  const addRoundToEvent = (eventId: string, results: GameResult[], roundRate: number, notes?: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const newRound: Round = {
          id: generateId(),
          roundNumber: event.rounds.length + 1,
          results,
          rate: roundRate,
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

  const getPlayerData = (playerId: string) => {
    let totalProfit = 0;
    let gamesPlayed = 0;

    events.forEach(event => {
      event.rounds.forEach(round => {
        const result = round.results.find((r: GameResult) => r.playerId === playerId);
        if (result) {
          totalProfit += result.profit;
          gamesPlayed++;
        }
      });
    });

    return { totalProfit, gamesPlayed };
  };

  const getPlayerHistory = (playerId: string) => {
    const history: { date: string; profit: number; cumulativeProfit: number }[] = [];
    let cumulativeProfit = 0;

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
        // Use round.rate to recalculate profit if needed
        const actualProfit = (result.chipEnd - result.chipStart) * round.rate;
        cumulativeProfit += actualProfit;
        history.push({
          date,
          profit: actualProfit,
          cumulativeProfit,
        });
      }
    });

    return history;
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
      deleteEvent,
      getPlayerData,
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
