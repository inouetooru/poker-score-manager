import { useGame } from '../contexts/GameContext';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { PlusCircle, History, Trophy, TrendingUp } from 'lucide-react';

interface DashboardProps {
    onNewRound: () => void;
    onNavigate: (view: 'new-round' | 'players' | 'settings') => void;
    onEventSelect?: (eventId: string) => void;
}

export function Dashboard({ onNewRound, onNavigate, onEventSelect }: DashboardProps) {
    const { events, players } = useGame();

    // Simple stats - count total rounds across all events
    const totalRounds = events.reduce((acc, event) => acc + event.rounds.length, 0);

    // Calculate top score player
    const playerScores = players.map(player => {
        let score = 0;
        events.forEach(event => {
            event.rounds.forEach(round => {
                const res = round.results.find(r => r.playerId === player.id);
                if (res) score += res.score;
            });
        });
        return { ...player, score };
    });

    const topPlayer = playerScores.sort((a, b) => b.score - a.score)[0];

    return (
        <div className="space-y-8 pb-safe">
            <div className="flex items-center justify-between">
                <h2 className="text-4xl font-bold tracking-tight">ダッシュボード</h2>
                <Button onClick={onNewRound} size="lg" className="bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all h-14 px-6 text-base">
                    <PlusCircle className="mr-2 h-6 w-6" />
                    新規半荘
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                <Card className="cursor-default">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-base font-medium">総半荘数</CardTitle>
                        <History className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{totalRounds}</div>
                        <p className="text-sm text-muted-foreground mt-2">
                            記録された半荘
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">最近の活動</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {events.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground text-base">
                                まだ対局が記録されていません。新しい半荘を開始してください！
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {events.slice(0, 5).map(event => (
                                    <div key={event.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-accent/10 transition-colors px-2 py-2 rounded">
                                        <span
                                            className="font-medium text-base cursor-pointer underline"
                                            style={{ color: '#60a5fa', textDecorationColor: '#60a5fa' }}
                                            onClick={() => onEventSelect?.(event.id)}
                                        >
                                            {event.name}
                                        </span>
                                        <span className="text-base text-muted-foreground whitespace-nowrap ml-4">
                                            {new Date(event.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })} - 半荘数: {event.rounds.length}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
