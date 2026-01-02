export interface Player {
    id: string;
    name: string;
    createdAt: string;
}

export interface GameResult {
    playerId: string;
    playerName: string;
    chipStart: number;
    chipEnd: number;
    chipDiff: number;
    profit: number;
}

export interface Round {
    id: string;
    roundNumber: number;
    results: GameResult[];
    rate: number;
    notes?: string;
}

export interface Event {
    id: string;
    name: string;
    date: string;
    rate: number;
    location?: string;
    notes?: string;
    rounds: Round[];
    createdAt: string;
}

export interface AppData {
    players: Player[];
    events: Event[];
}
