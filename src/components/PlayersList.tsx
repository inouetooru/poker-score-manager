import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { ArrowLeft, Search, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PlayersListProps {
    onBack: () => void;
    onPlayerSelect?: (playerId: string) => void;
}

export function PlayersList({ onBack, onPlayerSelect }: PlayersListProps) {
    const { players, getPlayerData, deletePlayer } = useGame();
    const [searchTerm, setSearchTerm] = useState("");

    const playerData = players.map(p => {
        const stats = getPlayerData(p.id);
        return { ...p, ...stats };
    }).sort((a, b) => b.totalProfit - a.totalProfit);

    const filteredPlayers = playerData.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">プレイヤー</h2>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="プレイヤーを検索..."
                    className="max-w-xs"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Charts Area */}
            <Card>
                <CardHeader>
                    <CardTitle>スコアランキング (トップ10)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={playerData.slice(0, 10)}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                            />
                            <Bar dataKey="totalProfit" radius={[4, 4, 0, 0]}>
                                {playerData.slice(0, 10).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.totalProfit >= 0 ? 'hsl(var(--chart-1))' : 'hsl(var(--destructive))'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>全プレイヤー</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredPlayers.map(p => (
                            <div
                                key={p.id}
                                className="flex items-center justify-between border-b pb-2 last:border-0 cursor-pointer hover:bg-muted/50 transition-colors rounded-sm px-2 -mx-2"
                                onClick={() => onPlayerSelect?.(p.id)}
                            >
                                <div className="font-medium text-lg">
                                    {p.name}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className={p.totalProfit > 0 ? "text-green-500 font-bold" : p.totalProfit < 0 ? "text-red-500 font-bold" : "text-muted-foreground"}>
                                            {p.totalProfit > 0 ? '+' : ''}{p.totalProfit}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{p.gamesPlayed} ゲーム</div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm(`${p.name}を削除しますか？`)) {
                                                deletePlayer(p.id);
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
