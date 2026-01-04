export interface Player {
    id: string;
    name: string;
    createdAt: string;
}

export interface GameResult {
    playerId: string;
    playerName: string;
    finalPoints: number;    // 最終点数（例: 28000）
    pointsDiff: number;     // ±点数（finalPoints - 25000）
    rank: number;           // 順位（1-4）
    uma: number;            // ウマ（順位ボーナス）
    score: number;          // 最終スコア
    yakitoriApplied?: boolean; // ヤキトリが適用されたかどうか
}

export interface Round {
    id: string;
    roundNumber: number;
    results: GameResult[];
    rate: number;           // 1000点あたりの金額（例: 100 = 1000点=100円）
    umaSettings: number[];  // ウマ設定（例: [20, 10, -10, -20]）
    startPoints: number;    // 開始点数（例: 25000）
    returnPoints: number;   // 返し点数（例: 30000）
    yakitori?: number;      // ヤキトリペナルティ（例: 20）
    notes?: string;
}

export interface Event {
    id: string;
    name: string;
    date: string;
    rate: number;           // デフォルトレート（1000点あたり）
    umaSettings: number[];  // デフォルトウマ設定（例: [20, 10, -10, -20]）
    startPoints: number;    // デフォルト開始点数（例: 25000）
    returnPoints: number;   // デフォルト返し点数（例: 30000）
    yakitori?: number;      // デフォルトヤキトリペナルティ（例: 20）
    location?: string;
    notes?: string;
    rounds: Round[];
    createdAt: string;
}

export interface AppData {
    players: Player[];
    events: Event[];
}
