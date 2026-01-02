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
        <div className="space-y-6 pb-safe">
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
                    <CardTitle>スコア詳細</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2"></th>
                                    {Array.from(playerStats.entries()).map(([playerId, stats]) => (
                                        <th key={playerId} className="p-2 min-w-[3rem]">
                                            <div className="flex justify-center">
                                                <div
                                                    style={{
                                                        writingMode: 'vertical-rl',
                                                        textOrientation: 'upright'
                                                    }}
                                                    className="text-sm font-medium py-2"
                                                >
                                                    {stats.name}
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {event.rounds.map((round) => (
                                    <tr key={round.id} className="border-b">
                                        <td className="p-2 text-sm text-muted-foreground">ラウンド{round.roundNumber}</td>
                                        {Array.from(playerStats.keys()).map((playerId) => {
                                            const result = round.results.find(r => r.playerId === playerId);
                                            const score = result?.score || 0;
                                            return (
                                                <td key={playerId} className={`text-center p-2 text-sm font-medium ${score > 0 ? 'text-green-500' : score < 0 ? 'text-red-500' : ''}`}>
                                                    {score > 0 ? '+' : ''}{score.toLocaleString()}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                <tr className="border-t-2 bg-muted/30">
                                    <td className="p-2 text-sm font-bold">合計</td>
                                    {Array.from(playerStats.entries()).map(([playerId, stats]) => (
                                        <td key={playerId} className={`text-center p-2 font-bold ${stats.totalProfit > 0 ? 'text-green-500' : stats.totalProfit < 0 ? 'text-red-500' : ''}`}>
                                            {stats.totalProfit > 0 ? '+' : ''}{stats.totalProfit.toLocaleString()}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
