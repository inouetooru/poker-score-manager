import { useRef } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardTitle as CardTitle2 } from './ui/Card';
import { Download, Upload, Trash2, ArrowLeft } from 'lucide-react';
import type { AppData } from '../types/definitions';

export function Settings() {
    const { exportData, importData, players, events, resetData } = useGame();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const dataStr = exportData();
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `poker-score-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string) as AppData;
                if (confirm("重複するIDがある場合、現在のデータが上書きまたはマージされます。続けますか?")) {
                    importData(json);
                    alert("インポートが成功しました！");
                    window.location.reload(); // Reload to refresh context state cleanly
                }
            } catch (err) {
                alert("無効なJSONファイルです");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">設定</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>データ管理</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button onClick={handleExport} className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            データをエクスポート (JSON)
                        </Button>

                        <Button onClick={handleImportClick} variant="outline" className="w-full sm:w-auto">
                            <Upload className="mr-2 h-4 w-4" />
                            データをインポート (JSON)
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".json"
                            onChange={handleFileChange}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        現在の統計: {players.length} プレイヤー, {events.length} イベント。
                    </p>
                </CardContent>
            </Card>

            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">危険な操作</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" onClick={() => {
                        if (confirm("本当に全てのデータを削除しますか？この操作は元に戻せません。")) {
                            resetData();
                        }
                    }}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        全データを削除
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
