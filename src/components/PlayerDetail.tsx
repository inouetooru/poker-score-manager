import { useGame } from '../contexts/GameContext';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PlayerDetailProps {
    playerId: string;
    onBack: () => void;
}

export function PlayerDetail({ playerId, onBack }: PlayerDetailProps) {
    const { players, getPlayerData, getPlayerHistory } = useGame();

    const player = players.find(p => p.id === playerId);
    const playerData = getPlayerData(playerId);
    const history = getPlayerHistory(playerId);

    if (!player) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">プレイヤーが見つかりません</h2>
                </div>
            </div>
        );
    }

    const averageProfit = playerData.gamesPlayed > 0
        ? (playerData.totalProfit / playerData.gamesPlayed).toFixed(0)
        : 0;

    return (
        <div className="space-y-6 pb-safe">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">{player.name}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">総スコア</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${playerData.totalProfit > 0 ? 'text-green-500' : playerData.totalProfit < 0 ? 'text-red-500' : ''}`}>
                            {playerData.totalProfit > 0 ? '+' : ''}{playerData.totalProfit}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">参加ゲーム数</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{playerData.gamesPlayed}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">平均スコア</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${Number(averageProfit) > 0 ? 'text-green-500' : Number(averageProfit) < 0 ? 'text-red-500' : ''}`}>
                            {Number(averageProfit) > 0 ? '+' : ''}{averageProfit}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {history.length > 0 ? (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>累積スコア推移</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '6px'
                                        }}
                                        formatter={(value) => value ? value.toLocaleString() : '0'}
                                        labelFormatter={(value) => new Date(value).toLocaleDateString('ja-JP')}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="cumulativeScore"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                                        name="累積スコア"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>各ゲームのスコア</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '6px'
                                        }}
                                        labelFormatter={(value) => new Date(value).toLocaleDateString('ja-JP')}
                                    />
                                    <Bar
                                        dataKey="score"
                                        fill="hsl(var(--primary))"
                                        radius={[4, 4, 0, 0]}
                                        name="スコア"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <Card>
                    <CardContent className="py-8">
                        <p className="text-center text-muted-foreground">まだゲームデータがありません</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
