import { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { X } from 'lucide-react';
import type { GameResult } from '../types/definitions';

interface EditRoundDialogProps {
    eventId: string;
    roundId: string;
    onClose: () => void;
}

type PlayerScore = {
    playerId: string;
    playerName: string;
    score: number;
    rank: number;
};

export function EditRoundDialog({ eventId, roundId, onClose }: EditRoundDialogProps) {
    const { events, updateRound } = useGame();
    const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);

    const event = events.find(e => e.id === eventId);
    const round = event?.rounds.find(r => r.id === roundId);

    useEffect(() => {
        if (round && round.results) {
            // 現在のスコアをそのまま表示
            const scores = round.results.map(result => ({
                playerId: result.playerId,
                playerName: result.playerName,
                score: result.score,
                rank: result.rank,
            }));
            setPlayerScores(scores);
        }
    }, [eventId, roundId, events]);

    if (!event || !round) {
        return null;
    }

    const handleScoreChange = (playerId: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setPlayerScores(prev =>
            prev.map(p => (p.playerId === playerId ? { ...p, score: numValue } : p))
        );
    };

    const handleSave = () => {
        const totalScore = playerScores.reduce((sum, p) => sum + p.score, 0);

        if (totalScore !== 0) {
            if (!confirm(`合計スコアが${totalScore > 0 ? '+' : ''}${totalScore}です。通常は0になるはずです。保存しますか?`)) {
                return;
            }
        }

        // スコアに基づいて順位を再計算
        const sorted = [...playerScores].sort((a, b) => b.score - a.score);
        let currentRank = 1;
        const ranked = sorted.map((player, index) => {
            if (index > 0 && sorted[index - 1].score !== player.score) {
                currentRank = index + 1;
            }
            return { ...player, rank: currentRank };
        });

        // 元の順序に戻す
        const results: GameResult[] = playerScores.map(p => {
            const rankedPlayer = ranked.find(r => r.playerId === p.playerId)!;
            return {
                playerId: p.playerId,
                playerName: p.playerName,
                score: p.score,
                rank: rankedPlayer.rank,
            };
        });

        updateRound(
            eventId,
            roundId,
            results,
            round.rate,
            round.umaSettings,
            round.startPoints,
            round.returnPoints,
            round.yakitori,
            round.notes
        );
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-2xl">半荘を編集</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-6 w-6" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="text-base text-muted-foreground">
                                各プレイヤーのスコア（レート含む）を入力してください
                            </div>
                            {playerScores.map((player) => (
                                <div key={player.playerId} className="flex items-center gap-4">
                                    <label className="text-base font-medium w-32">{player.playerName}</label>
                                    <Input
                                        type="number"
                                        value={player.score}
                                        onChange={(e) => handleScoreChange(player.playerId, e.target.value)}
                                        className="flex-1 text-base"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={onClose}>
                                キャンセル
                            </Button>
                            <Button onClick={handleSave}>
                                保存
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
