import { useGame } from '../contexts/GameContext';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ArrowLeft } from 'lucide-react';

interface EventDetailProps {
    eventId: string;
    onBack: () => void;
}

export function EventDetail({ eventId, onBack }: EventDetailProps) {
    const { events } = useGame();

    const event = events.find(e => e.id === eventId);

    if (!event) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">イベントが見つかりません</h2>
                </div>
            </div>
        );
    }

    // Calculate cumulative profits for each player across all rounds
    const playerStats = new Map<string, { name: string; totalProfit: number; rounds: number }>();

    event.rounds.forEach(round => {
        round.results.forEach(result => {
            const stats = playerStats.get(result.playerId) || {
                name: result.playerName,
                totalProfit: 0,
                rounds: 0
            };
            stats.totalProfit += result.score;
            stats.rounds += 1;
            playerStats.set(result.playerId, stats);
        });
    });

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">{event.name}</h2>
            </div>

            {/* Event Info */}
            <Card>
                <CardHeader>
                    <CardTitle>イベント情報</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-sm text-muted-foreground">開催日</div>
                            <div className="font-medium">{new Date(event.date).toLocaleDateString('ja-JP')}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">場所</div>
                            <div className="font-medium">{event.location || '未設定'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">総ラウンド数</div>
                            <div className="font-medium">{event.rounds.length}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">参加者数</div>
                            <div className="font-medium">{playerStats.size}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Cumulative Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>累積成績</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Array.from(playerStats.entries())
                            .sort((a, b) => b[1].totalProfit - a[1].totalProfit)
                            .map(([playerId, stats]) => (
                                <div key={playerId} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div className="font-medium">{stats.name}</div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-muted-foreground">{stats.rounds} ラウンド</div>
                                        <div className={stats.totalProfit > 0 ? "text-green-500 font-bold" : stats.totalProfit < 0 ? "text-red-500 font-bold" : "text-muted-foreground"}>
                                            {stats.totalProfit > 0 ? '+' : ''}{stats.totalProfit.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

            {/* Rounds Detail */}
            <Card>
                <CardHeader>
                    <CardTitle>ラウンド詳細</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {event.rounds.map((round) => (
                            <div key={round.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">ラウンド {round.roundNumber}</h3>
                                    <div className="text-sm text-muted-foreground">
                                        倍率: {round.rate}
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2">プレイヤー</th>
                                                <th className="text-right p-2">開始</th>
                                                <th className="text-right p-2">終了</th>
                                                <th className="text-right p-2">差分</th>
                                                <th className="text-right p-2">スコア</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {round.results.map(result => (
                                                <tr key={result.playerId} className="border-b last:border-0">
                                                    <td className="p-2">{result.playerName}</td>
                                                    <td className="text-right p-2">{result.chipStart.toLocaleString()}</td>
                                                    <td className="text-right p-2">{result.chipEnd.toLocaleString()}</td>
                                                    <td className={`text-right p-2 ${result.chipDiff > 0 ? 'text-green-500' : result.chipDiff < 0 ? 'text-red-500' : ''}`}>
                                                        {result.chipDiff > 0 ? '+' : ''}{result.chipDiff.toLocaleString()}
                                                    </td>
                                                    <td className={`text-right p-2 font-bold ${result.score > 0 ? 'text-green-500' : result.score < 0 ? 'text-red-500' : ''}`}>
                                                        {result.score > 0 ? '+' : ''}{result.score.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {round.notes && (
                                    <div className="mt-4 text-sm text-muted-foreground">
                                        <strong>メモ:</strong> {round.notes}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
