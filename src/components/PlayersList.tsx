import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { ArrowLeft, Search, Trash2 } from 'lucide-react';

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
        <div className="space-y-8 pb-safe">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack} className="h-12 w-12">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h2 className="text-4xl font-bold tracking-tight">プレイヤー</h2>
            </div>

            <div className="flex items-center space-x-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="プレイヤーを検索..."
                    className="max-w-xs h-14 text-base"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* 累積成績テーブル */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">累積成績</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-center p-4 font-medium text-base w-20 whitespace-nowrap">順位</th>
                                    <th className="text-center p-4 font-medium text-base w-48 whitespace-nowrap">名前</th>
                                    <th className="text-center p-4 font-medium text-base w-24 whitespace-nowrap">半荘数</th>
                                    <th className="text-center p-4 font-medium text-base w-20 whitespace-nowrap">1位</th>
                                    <th className="text-center p-4 font-medium text-base w-20 whitespace-nowrap">2位</th>
                                    <th className="text-center p-4 font-medium text-base w-20 whitespace-nowrap">3位</th>
                                    <th className="text-center p-4 font-medium text-base w-20 whitespace-nowrap">4位</th>
                                    <th className="text-center p-4 font-medium text-base w-32 whitespace-nowrap">スコア</th>
                                    <th className="text-center p-4 font-medium text-base w-28 whitespace-nowrap">平均順位</th>
                                </tr>
                            </thead>
                            <tbody>
                                {playerData.map((p, index) => (
                                    <tr
                                        key={p.id}
                                        className="border-b border-border/50 hover:bg-accent/10 cursor-pointer"
                                        onClick={() => onPlayerSelect?.(p.id)}
                                    >
                                        <td className="p-4 font-mono text-base text-center whitespace-nowrap">{index + 1}</td>
                                        <td className="p-4 font-medium text-base underline text-center whitespace-nowrap" style={{ color: '#60a5fa', textDecorationColor: '#60a5fa' }}>{p.name}</td>
                                        <td className="p-4 text-right font-mono text-base whitespace-nowrap">{p.gamesPlayed}</td>
                                        <td className="p-4 text-center font-mono text-base whitespace-nowrap">{p.rankDistribution.rank1}回</td>
                                        <td className="p-4 text-center font-mono text-base whitespace-nowrap">{p.rankDistribution.rank2}回</td>
                                        <td className="p-4 text-center font-mono text-base whitespace-nowrap">{p.rankDistribution.rank3}回</td>
                                        <td className="p-4 text-center font-mono text-base whitespace-nowrap">{p.rankDistribution.rank4}回</td>
                                        <td className={`p-4 text-right font-mono font-bold text-lg whitespace-nowrap ${p.totalProfit > 0 ? 'text-blue-400' : p.totalProfit < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                            {p.totalProfit > 0 ? '+' : ''}{p.totalProfit}
                                        </td>
                                        <td className="p-4 text-right font-mono text-base whitespace-nowrap">{p.gamesPlayed > 0 ? p.averageRank.toFixed(2) : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">全プレイヤー</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-5">
                        {filteredPlayers.map(p => (
                            <Card key={p.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onPlayerSelect?.(p.id)}>
                                <CardHeader className="py-5">
                                    <CardTitle className="flex items-center justify-between text-xl">
                                        <span className="underline" style={{ color: '#60a5fa', textDecorationColor: '#60a5fa' }}>{p.name}</span>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className={`text-2xl ${p.totalProfit > 0 ? "text-blue-400 font-bold" : p.totalProfit < 0 ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
                                                    {p.totalProfit > 0 ? '+' : ''}{p.totalProfit}
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">{p.gamesPlayed} 半荘</div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`${p.name}を削除しますか？`)) {
                                                        deletePlayer(p.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-5 w-5 text-destructive" />
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
