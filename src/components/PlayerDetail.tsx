import { useGame } from '../contexts/GameContext';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart } from 'recharts';

interface PlayerDetailProps {
    playerId: string;
    onBack: () => void;
    onEventSelect?: (eventId: string) => void;
}

export function PlayerDetail({ playerId, onBack, onEventSelect }: PlayerDetailProps) {
    const { players, getPlayerData, getPlayerHistory, getPlayerEventData } = useGame();

    const player = players.find(p => p.id === playerId);
    const playerData = getPlayerData(playerId);
    const history = getPlayerHistory(playerId);
    const eventData = getPlayerEventData(playerId);

    // イベント名に日付を追加
    const eventDataWithDate = eventData.map(event => ({
        ...event,
        eventNameWithDate: `${event.eventName} (${new Date(event.eventDate).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })})`
    }));

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
        <div className="space-y-8 pb-safe">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack} className="h-12 w-12">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h2 className="text-4xl font-bold tracking-tight">{player.name}</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-base font-medium">総スコア</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-4xl font-bold ${playerData.totalProfit > 0 ? 'text-blue-400' : playerData.totalProfit < 0 ? 'text-red-500' : ''}`}>
                            {playerData.totalProfit > 0 ? '+' : ''}{playerData.totalProfit}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-base font-medium">平均スコア</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-4xl font-bold ${Number(averageProfit) > 0 ? 'text-blue-400' : Number(averageProfit) < 0 ? 'text-red-500' : ''}`}>
                            {Number(averageProfit) > 0 ? '+' : ''}{averageProfit}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-base font-medium">参加半荘数</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{playerData.gamesPlayed}</div>
                    </CardContent>
                </Card>
            </div>

            {/* 順位分布カード */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">順位分布</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-2">1位</div>
                            <div className="text-3xl font-bold text-yellow-500">{playerData.rankDistribution.rank1}回</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {playerData.gamesPlayed > 0 ? `${((playerData.rankDistribution.rank1 / playerData.gamesPlayed) * 100).toFixed(1)}%` : '-'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-2">2位</div>
                            <div className="text-3xl font-bold text-blue-400">{playerData.rankDistribution.rank2}回</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {playerData.gamesPlayed > 0 ? `${((playerData.rankDistribution.rank2 / playerData.gamesPlayed) * 100).toFixed(1)}%` : '-'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-2">3位</div>
                            <div className="text-3xl font-bold text-orange-400">{playerData.rankDistribution.rank3}回</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {playerData.gamesPlayed > 0 ? `${((playerData.rankDistribution.rank3 / playerData.gamesPlayed) * 100).toFixed(1)}%` : '-'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-2">4位</div>
                            <div className="text-3xl font-bold text-gray-400">{playerData.rankDistribution.rank4}回</div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {playerData.gamesPlayed > 0 ? `${((playerData.rankDistribution.rank4 / playerData.gamesPlayed) * 100).toFixed(1)}%` : '-'}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {history.length > 0 ? (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">イベント別成績推移</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={eventDataWithDate}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="eventNameWithDate"
                                        stroke="#888888"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: 'スコア', angle: -90, position: 'insideLeft' }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[1, 4]}
                                        reversed={true}
                                        label={{ value: '平均順位', angle: 90, position: 'insideRight' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '6px'
                                        }}
                                        formatter={(value: any, name: string) => {
                                            if (name === 'トータルスコア') {
                                                return [value > 0 ? `+${value}` : value, name];
                                            }
                                            if (name === '平均順位') {
                                                return [Number(value).toFixed(2) + '位', name];
                                            }
                                            return [value, name];
                                        }}
                                    />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="totalProfit"
                                        fill="hsl(var(--primary))"
                                        radius={[4, 4, 0, 0]}
                                        name="トータルスコア"
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="averageRank"
                                        stroke="#f59e0b"
                                        strokeWidth={3}
                                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                                        name="平均順位"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">各半荘のスコア</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="gameNumber"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: '半荘数', position: 'insideBottom', offset: -5 }}
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
                                        labelFormatter={(value, payload) => {
                                            if (payload && payload.length > 0) {
                                                const data = payload[0].payload;
                                                return `第${value}半荘 (順位: ${data.rank}位)`;
                                            }
                                            return `第${value}半荘`;
                                        }}
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

                    {/* イベント別成績 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">イベント別成績</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-center p-4 font-medium text-base w-64 whitespace-nowrap">イベント名</th>
                                            <th className="text-center p-4 font-medium text-base w-32 whitespace-nowrap">日付</th>
                                            <th className="text-center p-4 font-medium text-base w-24 whitespace-nowrap">半荘数</th>
                                            <th className="text-center p-4 font-medium text-base w-32 whitespace-nowrap">スコア</th>
                                            <th className="text-center p-4 font-medium text-base w-28 whitespace-nowrap">平均順位</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {eventData.map((event) => (
                                            <tr key={event.eventId} className="border-b border-border/50 hover:bg-accent/10">
                                                <td className="p-4 font-medium text-base text-center whitespace-nowrap">
                                                    <span
                                                        className="cursor-pointer underline"
                                                        style={{ color: '#60a5fa', textDecorationColor: '#60a5fa' }}
                                                        onClick={() => onEventSelect?.(event.eventId)}
                                                    >
                                                        {event.eventName}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-base text-muted-foreground text-center whitespace-nowrap">
                                                    {new Date(event.eventDate).toLocaleDateString('ja-JP')}
                                                </td>
                                                <td className="p-4 text-right font-mono text-base whitespace-nowrap">{event.gamesPlayed}</td>
                                                <td className={`p-4 text-right font-mono font-bold text-lg whitespace-nowrap ${event.totalProfit > 0 ? 'text-blue-400' : event.totalProfit < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                                    {event.totalProfit > 0 ? '+' : ''}{event.totalProfit}
                                                </td>
                                                <td className="p-4 text-right font-mono text-base whitespace-nowrap">{event.averageRank.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <Card>
                    <CardContent className="py-8">
                        <p className="text-center text-muted-foreground text-base">まだ対局データがありません</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
