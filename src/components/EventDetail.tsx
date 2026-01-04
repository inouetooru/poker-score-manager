import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { EditRoundDialog } from './EditRoundDialog';

interface EventDetailProps {
    eventId: string;
    onBack: () => void;
    onPlayerSelect?: (playerId: string) => void;
}

export function EventDetail({ eventId, onBack, onPlayerSelect }: EventDetailProps) {
    const { events, deleteRound } = useGame();
    const [roundToDelete, setRoundToDelete] = useState<string | null>(null);
    const [roundToEdit, setRoundToEdit] = useState<string | null>(null);

    const event = events.find(e => e.id === eventId);

    if (!event) {
        return (
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack} className="h-12 w-12">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h2 className="text-4xl font-bold tracking-tight">イベントが見つかりません</h2>
                </div>
            </div>
        );
    }

    // Calculate cumulative scores for each player across all rounds
    const playerStats = new Map<string, { name: string; totalScore: number; calculatedTotalProfit: number; rounds: number }>();

    event.rounds.forEach(round => {
        round.results.forEach(result => {
            const stats = playerStats.get(result.playerId) || {
                name: result.playerName,
                totalScore: 0,
                calculatedTotalProfit: 0,
                rounds: 0
            };
            const score = result.score;
            const rate = round.rate || 100;
            const calculatedScore = score * rate;

            stats.totalScore += score;
            stats.calculatedTotalProfit += calculatedScore;
            stats.rounds += 1;
            playerStats.set(result.playerId, stats);
        });
    });

    return (
        <div className="space-y-8 pb-safe">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack} className="h-12 w-12">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h2 className="text-4xl font-bold tracking-tight">{event.name}</h2>
            </div>

            {/* Event Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">イベント情報</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <div className="text-base text-muted-foreground">開催日</div>
                            <div className="font-medium text-lg mt-1">{new Date(event.date).toLocaleDateString('ja-JP')}</div>
                        </div>
                        <div>
                            <div className="text-base text-muted-foreground">場所</div>
                            <div className="font-medium text-lg mt-1">{event.location || '未設定'}</div>
                        </div>
                        <div>
                            <div className="text-base text-muted-foreground">総半荘数</div>
                            <div className="font-medium text-lg mt-1">{event.rounds.length}</div>
                        </div>
                        <div>
                            <div className="text-base text-muted-foreground">参加者数</div>
                            <div className="font-medium text-lg mt-1">{playerStats.size}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Cumulative Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">累積成績</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left p-4 font-medium text-base">名前</th>
                                    <th className="text-center p-4 font-medium text-base">半荘数</th>
                                    <th className="text-right p-4 font-medium text-base">合計（レート含む）</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from(playerStats.entries())
                                    .sort((a, b) => b[1].calculatedTotalProfit - a[1].calculatedTotalProfit)
                                    .map(([playerId, stats]) => (
                                        <tr key={playerId} className="border-b border-border/50 hover:bg-accent/10">
                                            <td className="p-4 text-base">
                                                <span
                                                    className="font-medium cursor-pointer underline"
                                                    style={{ color: '#60a5fa', textDecorationColor: '#60a5fa' }}
                                                    onClick={() => onPlayerSelect?.(playerId)}
                                                >
                                                    {stats.name}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center font-mono text-base">{stats.rounds}</td>
                                            <td className={`p-4 text-right font-mono font-bold text-lg ${stats.calculatedTotalProfit > 0 ? "text-blue-400" : stats.calculatedTotalProfit < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                                                {stats.calculatedTotalProfit > 0 ? '+' : ''}{Math.round(stats.calculatedTotalProfit).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Rounds Detail */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">スコア詳細</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3"></th>
                                    <th className="text-center p-3 w-24">編集</th>
                                    {Array.from(playerStats.entries()).map(([playerId, stats]) => (
                                        <th key={playerId} className="p-3 min-w-[3rem]">
                                            <div className="flex justify-center">
                                                <div
                                                    style={{
                                                        writingMode: 'vertical-rl',
                                                        textOrientation: 'upright',
                                                        color: '#60a5fa'
                                                    }}
                                                    className="text-base font-medium py-2 cursor-pointer underline"
                                                    onClick={() => onPlayerSelect?.(playerId)}
                                                >
                                                    {stats.name}
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="p-3 min-w-[4rem] text-center text-base font-medium">合計（レート含む）</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.rounds.map((round) => {
                                    const totalScore = round.results.reduce((sum, r) => sum + r.score, 0);
                                    const rate = round.rate || 100;
                                    const calculatedTotalScore = totalScore * rate;

                                    return (
                                        <tr key={round.id} className="border-b">
                                            <td className="p-3 text-base text-muted-foreground">第{round.roundNumber}半荘</td>
                                            <td className="p-3">
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => setRoundToEdit(round.id)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600"
                                                        onClick={() => setRoundToDelete(round.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                            {Array.from(playerStats.keys()).map((playerId) => {
                                                const result = round.results.find(r => r.playerId === playerId);
                                                if (!result) {
                                                    return <td key={playerId} className="text-center p-3 text-base font-medium">-</td>;
                                                }

                                                const score = result.score;
                                                const rate = round.rate || 100;
                                                const calculatedScore = score * rate;

                                                return (
                                                    <td key={playerId} className={`text-center p-3 text-sm font-medium ${score > 0 ? 'text-blue-400' : score < 0 ? 'text-red-500' : ''}`}>
                                                        <div>{score > 0 ? '+' : ''}{Math.round(score)}</div>
                                                        <div className="text-xs">({calculatedScore > 0 ? '+' : ''}{Math.round(calculatedScore).toLocaleString()})</div>
                                                    </td>
                                                );
                                            })}
                                            <td className={`text-center p-3 text-sm font-bold ${totalScore === 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                <div>{totalScore > 0 ? '+' : ''}{Math.round(totalScore)}</div>
                                                <div className="text-xs">({calculatedTotalScore > 0 ? '+' : ''}{Math.round(calculatedTotalScore).toLocaleString()})</div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {/* 区切り線 */}
                                <tr>
                                    <td colSpan={playerStats.size + 3} className="p-0">
                                        <div className="border-t-2 border-gray-400 dark:border-gray-500"></div>
                                    </td>
                                </tr>
                                {/* 合計行 */}
                                <tr className="bg-muted/50">
                                    <td className="p-3 text-base font-bold">合計</td>
                                    <td className="p-3"></td>
                                    {Array.from(playerStats.entries()).map(([playerId, stats]) => (
                                        <td key={playerId} className={`text-center p-3 font-bold text-sm ${stats.totalScore > 0 ? 'text-blue-400' : stats.totalScore < 0 ? 'text-red-500' : ''}`}>
                                            <div>{stats.totalScore > 0 ? '+' : ''}{Math.round(stats.totalScore)}</div>
                                            <div className="text-xs">({stats.calculatedTotalProfit > 0 ? '+' : ''}{Math.round(stats.calculatedTotalProfit).toLocaleString()})</div>
                                        </td>
                                    ))}
                                    <td className="p-3 text-center font-bold text-sm text-green-500">
                                        <div>0</div>
                                        <div className="text-xs">(0)</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* 削除確認ダイアログ */}
            {roundToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setRoundToDelete(null)}>
                    <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                        <CardHeader>
                            <CardTitle className="text-2xl">半荘を削除</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-base text-muted-foreground">
                                この半荘を削除してもよろしいですか？この操作は取り消せません。
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button variant="outline" onClick={() => setRoundToDelete(null)}>
                                    キャンセル
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        deleteRound(eventId, roundToDelete);
                                        setRoundToDelete(null);
                                    }}
                                >
                                    削除
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* 編集ダイアログ */}
            {roundToEdit && (
                <EditRoundDialog
                    eventId={eventId}
                    roundId={roundToEdit}
                    onClose={() => setRoundToEdit(null)}
                />
            )}
        </div>
    );
}
