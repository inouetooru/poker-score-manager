import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ArrowLeft } from 'lucide-react';

interface ScoreTableProps {
    onBack: () => void;
}

export function ScoreTable({ onBack }: ScoreTableProps) {
    // 点数計算表のデータ
    const scoreData = [
        // 1飜
        { han: 1, fu: 30, oya: '1500 (500オール)', ko: '1000 (親300/子500)' },
        { han: 1, fu: 40, oya: '2000 (700オール)', ko: '1300 (親400/子700)' },
        { han: 1, fu: 50, oya: '2400 (800オール)', ko: '1600 (親400/子800)' },
        { han: 1, fu: 60, oya: '2900 (1000オール)', ko: '2000 (親500/子1000)' },
        { han: 1, fu: 70, oya: '3400 (1200オール)', ko: '2300 (親600/子1200)' },
        { han: 1, fu: 80, oya: '3900 (1300オール)', ko: '2600 (親700/子1300)' },
        { han: 1, fu: 90, oya: '4400 (1500オール)', ko: '2900 (親800/子1500)' },
        { han: 1, fu: 100, oya: '4800 (1600オール)', ko: '3200 (親800/子1600)' },
        { han: 1, fu: 110, oya: '5300 (1800オール)', ko: '3600 (親900/子1800)' },

        // 2飜
        { han: 2, fu: 20, oya: '2000 (700オール)', ko: '1300 (親400/子700)' },
        { han: 2, fu: 25, oya: '2400 (800オール)', ko: '1600 (親400/子800)' },
        { han: 2, fu: 30, oya: '2900 (1000オール)', ko: '2000 (親500/子1000)' },
        { han: 2, fu: 40, oya: '3900 (1300オール)', ko: '2600 (親700/子1300)' },
        { han: 2, fu: 50, oya: '4800 (1600オール)', ko: '3200 (親800/子1600)' },
        { han: 2, fu: 60, oya: '5800 (2000オール)', ko: '3900 (親1000/子2000)' },
        { han: 2, fu: 70, oya: '6800 (2300オール)', ko: '4500 (親1200/子2300)' },
        { han: 2, fu: 80, oya: '7700 (2600オール)', ko: '5200 (親1300/子2600)' },
        { han: 2, fu: 90, oya: '8700 (2900オール)', ko: '5800 (親1500/子2900)' },
        { han: 2, fu: 100, oya: '9600 (3200オール)', ko: '6400 (親1600/子3200)' },
        { han: 2, fu: 110, oya: '10600 (3600オール)', ko: '7100 (親1800/子3600)' },

        // 3飜
        { han: 3, fu: 20, oya: '3900 (1300オール)', ko: '2600 (親700/子1300)' },
        { han: 3, fu: 25, oya: '4800 (1600オール)', ko: '3200 (親800/子1600)' },
        { han: 3, fu: 30, oya: '5800 (2000オール)', ko: '3900 (親1000/子2000)' },
        { han: 3, fu: 40, oya: '7700 (2600オール)', ko: '5200 (親1300/子2600)' },
        { han: 3, fu: 50, oya: '9600 (3200オール)', ko: '6400 (親1600/子3200)' },
        { han: 3, fu: 60, oya: '11600 (3900オール)', ko: '7700 (親2000/子3900)' },
        { han: 3, fu: 70, oya: '満貫', ko: '満貫' },

        // 4飜
        { han: 4, fu: 20, oya: '7700 (2600オール)', ko: '5200 (親1300/子2600)' },
        { han: 4, fu: 25, oya: '9600 (3200オール)', ko: '6400 (親1600/子3200)' },
        { han: 4, fu: 30, oya: '11600 (3900オール)', ko: '7700 (親2000/子3900)' },
        { han: 4, fu: 40, oya: '満貫', ko: '満貫' },
    ];

    // 飜数ごとにグループ化
    const groupedData: { [key: number]: typeof scoreData } = {};
    scoreData.forEach(row => {
        if (!groupedData[row.han]) {
            groupedData[row.han] = [];
        }
        groupedData[row.han].push(row);
    });

    return (
        <div className="space-y-8 pb-safe">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack} className="h-12 w-12">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h2 className="text-4xl font-bold tracking-tight">点数早見表</h2>
            </div>

            <Card className="bg-yellow-950/30 border-yellow-700/50">
                <CardContent className="pt-6">
                    <p className="text-base text-yellow-200">
                        ※ 子の点数の括弧内は、ロン時 (ツモ時: 子の支払い/親の支払い) を表します<br />
                        ※ 満貫以上: 満貫 (8000/12000)、跳満 (12000/18000)、倍満 (16000/24000)、三倍満 (24000/36000)、役満 (32000/48000)
                    </p>
                </CardContent>
            </Card>

            {Object.keys(groupedData).map(han => (
                <Card key={han}>
                    <CardHeader>
                        <CardTitle className="text-2xl">{han}飜</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-center p-4 font-medium text-base w-24 whitespace-nowrap">符</th>
                                        <th className="text-center p-4 font-medium text-base w-52 whitespace-nowrap">親</th>
                                        <th className="text-center p-4 font-medium text-base w-56 whitespace-nowrap">子</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedData[Number(han)].map((row, idx) => (
                                        <tr key={idx} className="border-b border-border/50 hover:bg-accent/10">
                                            <td className="p-4 font-mono text-base text-center whitespace-nowrap">{row.fu}符</td>
                                            <td className="p-4 font-mono text-orange-400 text-base text-center whitespace-nowrap">{row.oya}</td>
                                            <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">{row.ko}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">満貫以上</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-center p-4 font-medium text-base w-96 whitespace-nowrap">役</th>
                                    <th className="text-center p-4 font-medium text-base w-52 whitespace-nowrap">親</th>
                                    <th className="text-center p-4 font-medium text-base w-56 whitespace-nowrap">子</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border/50 hover:bg-accent/10">
                                    <td className="p-4 text-base text-center whitespace-nowrap">満貫 (5飜 or 3飜70符〜 or 4飜40符〜)</td>
                                    <td className="p-4 font-mono text-orange-400 text-base text-center whitespace-nowrap">12000 (4000オール)</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">8000 (親2000/子4000)</td>
                                </tr>
                                <tr className="border-b border-border/50 hover:bg-accent/10">
                                    <td className="p-4 text-base text-center whitespace-nowrap">跳満 (6〜7飜)</td>
                                    <td className="p-4 font-mono text-orange-400 text-base text-center whitespace-nowrap">18000 (6000オール)</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">12000 (親3000/子6000)</td>
                                </tr>
                                <tr className="border-b border-border/50 hover:bg-accent/10">
                                    <td className="p-4 text-base text-center whitespace-nowrap">倍満 (8〜10飜)</td>
                                    <td className="p-4 font-mono text-orange-400 text-base text-center whitespace-nowrap">24000 (8000オール)</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">16000 (親4000/子8000)</td>
                                </tr>
                                <tr className="border-b border-border/50 hover:bg-accent/10">
                                    <td className="p-4 text-base text-center whitespace-nowrap">三倍満 (11〜12飜)</td>
                                    <td className="p-4 font-mono text-orange-400 text-base text-center whitespace-nowrap">36000 (12000オール)</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">24000 (親6000/子12000)</td>
                                </tr>
                                <tr className="border-b border-border/50 hover:bg-accent/10">
                                    <td className="p-4 text-base text-center whitespace-nowrap">役満 (13飜以上)</td>
                                    <td className="p-4 font-mono text-orange-400 text-base text-center whitespace-nowrap">48000 (16000オール)</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">32000 (親8000/子16000)</td>
                                </tr>
                                <tr className="border-b border-border/50 hover:bg-accent/10">
                                    <td className="p-4 text-base text-center whitespace-nowrap">ダブル役満</td>
                                    <td className="p-4 font-mono text-orange-400 text-base text-center whitespace-nowrap">96000 (32000オール)</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">64000 (親16000/子32000)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
