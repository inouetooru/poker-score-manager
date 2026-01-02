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
        <div className="space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
                <Button onClick={onNewRound} size="lg" className="bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    新規ラウンド
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-default">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">総ラウンド数</CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRounds}</div>
                        <p className="text-xs text-muted-foreground">
                            記録されたセッション
                        </p>
                    </CardContent>
                </Card>

                <Card onClick={() => onNavigate('players')} className="cursor-pointer hover:bg-accent/10 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">トップ稼手</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{topPlayer ? topPlayer.name : "—"}</div>
                        <p className="text-xs text-muted-foreground">
                            {topPlayer ? `${topPlayer.score > 0 ? '+' : ''}${topPlayer.score}` : "データなし"}
                        </p>
                    </CardContent>
                </Card>

                <Card onClick={() => onNavigate('players')} className="cursor-pointer hover:bg-accent/10 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">アクティブプレイヤー</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{players.length}</div>
                        <p className="text-xs text-muted-foreground">
                            登録済み
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>最近の活動</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {events.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                まだゲームが記録されていません。新しいラウンドを開始してください！
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {events.slice(0, 5).map(event => (
                                    <div key={event.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex-1">
                                            <p
                                                className="font-medium text-lg cursor-pointer hover:text-primary transition-colors py-2 px-3 -mx-3 rounded-md hover:bg-accent active:bg-accent/80 underline"
                                                onClick={() => onEventSelect?.(event.id)}
                                            >
                                                {event.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground px-3">
                                                {new Date(event.date).toLocaleDateString()} - レート: {event.rate}, ラウンド: {event.rounds.length}
                                            </p>
                                        </div>
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
