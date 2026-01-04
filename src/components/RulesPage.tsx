import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { ArrowLeft } from 'lucide-react';

interface RulesPageProps {
    onBack: () => void;
}

export function RulesPage({ onBack }: RulesPageProps) {
    return (
        <div className="space-y-8 pb-safe">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack} className="h-12 w-12">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h2 className="text-4xl font-bold tracking-tight">アプリガイド</h2>
            </div>

            {/* スコア計算の基本 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">スコア計算の基本式</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">基本式</h3>
                        <div className="bg-muted border border-border p-4 rounded-md">
                            <p className="font-mono text-sm text-center">
                                score = (最終点数 - 返し点数) ÷ 1000 + ウマ - 焼き鳥ペナルティ + 焼き鳥ボーナス
                            </p>
                        </div>
                        <p className="text-base text-muted-foreground pl-4">
                            この score に五捨六入を適用し、レートを掛けた値が実際の収支になります。
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">計算例</h3>
                        <ul className="space-y-2 text-base pl-6 list-disc">
                            <li>最終点数: 35400点</li>
                            <li>返し点数: 30000点</li>
                            <li>順位: 1位（ウマ +20）</li>
                            <li>焼き鳥: なし</li>
                        </ul>
                        <div className="bg-muted border border-border p-4 rounded-md space-y-2">
                            <p className="text-sm">計算: (35400 - 30000) ÷ 1000 + 20 = 5.4 + 20 = 25.4</p>
                            <p className="text-sm">五捨六入: 25.4 → 25</p>
                            <p className="font-bold text-lg text-primary">→ score = 25</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 返し点数とウマ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">返し点数とウマ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">返し点数</h3>
                        <p className="text-base text-muted-foreground pl-4">
                            基準となる点数です。この点数を上回るとプラス、下回るとマイナスになります。
                        </p>
                        <div className="bg-accent/10 border-l-4 border-primary p-4 rounded-r-md">
                            <p className="text-base text-foreground">
                                <span className="font-semibold">例:</span> 返し点数30000点の場合、30000点ちょうどで ±0 となります。
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">ウマ（順位点）</h3>
                        <p className="text-base text-muted-foreground pl-4">
                            順位に応じた点数の再配分です。上位が得をし、下位が損をする仕組みです。
                        </p>

                        <div className="bg-muted border border-border p-5 rounded-md space-y-3">
                            <h4 className="font-semibold text-base">デフォルト設定（ウマ14=20, ウマ23=10）</h4>
                            <div className="grid grid-cols-2 gap-3 text-base pl-4">
                                <div>• 1位: <span className="text-blue-400 font-semibold">+20</span></div>
                                <div>• 2位: <span className="text-blue-400 font-semibold">+10</span></div>
                                <div>• 3位: <span className="text-red-500 font-semibold">-10</span></div>
                                <div>• 4位: <span className="text-red-500 font-semibold">-20</span></div>
                            </div>
                            <div className="pt-2 border-t border-border/50">
                                <p className="text-sm text-muted-foreground">
                                    合計: 20 + 10 + (-10) + (-20) = <span className="text-green-500 font-semibold">0</span> （ゼロサム）
                                </p>
                            </div>
                        </div>

                        <p className="text-base text-muted-foreground pl-4">
                            3位・4位が払った点数（-10, -20）が、1位・2位に分配されます。
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* 焼き鳥ペナルティ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">焼き鳥ペナルティの分配</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">仕組み</h3>
                        <ul className="space-y-2 text-base pl-6 list-disc text-muted-foreground">
                            <li>焼き鳥が適用されたプレイヤーは、設定されたペナルティ分を支払います</li>
                            <li>支払われたペナルティは、<span className="font-bold text-foreground">焼き鳥でないプレイヤー全員で均等に山分け</span>されます</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">例題1: 1人が焼き鳥（ペナルティ = 10）</h3>
                        <div className="bg-muted border border-border p-5 rounded-md space-y-4">
                            <div>
                                <h4 className="font-semibold text-base mb-2">① 分配前</h4>
                                <ul className="space-y-1 pl-6 text-sm">
                                    <li>プレイヤーA（焼き鳥）: <span className="text-red-500 font-semibold">-10</span> を支払う</li>
                                    <li>プレイヤーB, C, D（焼き鳥なし）: 0</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-base mb-2">② 分配計算</h4>
                                <ul className="space-y-1 pl-6 text-sm">
                                    <li>焼き鳥ペナルティ合計: 10</li>
                                    <li>焼き鳥でない人数: 3人</li>
                                    <li>1人あたりのボーナス: 10 ÷ 3 = 3.333...</li>
                                    <li>五捨六入: 3.333... → <span className="font-semibold">3</span></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-base mb-2">③ 分配後</h4>
                                <ul className="space-y-1 pl-6 text-sm">
                                    <li>プレイヤーA（焼き鳥）: <span className="text-red-500 font-semibold">-10</span>（変わらず）</li>
                                    <li>プレイヤーB, C, D: 各 <span className="text-blue-400 font-semibold">+3</span></li>
                                </ul>
                            </div>

                            <div className="pt-2 border-t border-border/50">
                                <p className="text-xs text-muted-foreground">
                                    ※ 3人 × 3 = 9 で1点の誤差が発生しますが、最終的な誤差補正で調整されます
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">例題2: 2人が焼き鳥（ペナルティ = 10）</h3>
                        <div className="bg-muted border border-border p-5 rounded-md space-y-4">
                            <div>
                                <h4 className="font-semibold text-base mb-2">① 分配前</h4>
                                <ul className="space-y-1 pl-6 text-sm">
                                    <li>プレイヤーA, B（焼き鳥）: 各 <span className="text-red-500 font-semibold">-10</span> を支払う</li>
                                    <li>プレイヤーC, D（焼き鳥なし）: 0</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-base mb-2">② 分配計算</h4>
                                <ul className="space-y-1 pl-6 text-sm">
                                    <li>焼き鳥ペナルティ合計: 20</li>
                                    <li>焼き鳥でない人数: 2人</li>
                                    <li>1人あたりのボーナス: 20 ÷ 2 = <span className="font-semibold">10</span></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-base mb-2">③ 分配後</h4>
                                <ul className="space-y-1 pl-6 text-sm">
                                    <li>プレイヤーA, B（焼き鳥）: 各 <span className="text-red-500 font-semibold">-10</span>（変わらず）</li>
                                    <li>プレイヤーC, D: 各 <span className="text-blue-400 font-semibold">+10</span></li>
                                </ul>
                            </div>

                            <div className="pt-2 border-t border-border/50">
                                <p className="text-sm text-green-500 font-semibold">
                                    合計: (-10) + (-10) + 10 + 10 = 0 ✓
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 五捨六入と誤差補正 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">五捨六入と誤差補正</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">五捨六入とは</h3>
                        <p className="text-base text-muted-foreground pl-4">
                            一般的な四捨五入とは異なり、小数点以下が .5 の場合は切り捨てます。
                        </p>
                        <div className="bg-muted border border-border p-4 rounded-md">
                            <ul className="space-y-1 text-sm">
                                <li>23.4 → <span className="font-semibold">23</span>（切り捨て）</li>
                                <li>23.5 → <span className="font-semibold">23</span>（切り捨て）← <span className="text-muted-foreground">四捨五入なら24</span></li>
                                <li>23.6 → <span className="font-semibold">24</span>（切り上げ）</li>
                                <li>23.9 → <span className="font-semibold">24</span>（切り上げ）</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">なぜ誤差が発生するのか</h3>
                        <p className="text-base text-muted-foreground pl-4">
                            各プレイヤーのスコア計算で五捨六入を行うため、小数部分の組み合わせにより合計が ±1〜2 になる場合があります。
                        </p>

                        <div className="bg-muted border border-border p-5 rounded-md space-y-3">
                            <h4 className="font-semibold text-base">具体例</h4>
                            <div className="space-y-2 pl-4 text-sm">
                                <p>プレイヤー1: 25.4 → <span className="font-semibold">25</span>（誤差 -0.4）</p>
                                <p>プレイヤー2: 10.3 → <span className="font-semibold">10</span>（誤差 -0.3）</p>
                                <p>プレイヤー3: -11.8 → <span className="font-semibold">-12</span>（誤差 -0.2）</p>
                                <p>プレイヤー4: -23.9 → <span className="font-semibold">-24</span>（誤差 -0.1）</p>
                            </div>
                            <div className="pt-3 space-y-1 border-t border-border/50 text-sm">
                                <p>理論値の合計: 25.4 + 10.3 - 11.8 - 23.9 = <span className="text-green-500 font-semibold">0</span> ✓</p>
                                <p>実際の合計: 25 + 10 - 12 - 24 = <span className="text-red-500 font-semibold">-1</span> ❌</p>
                            </div>
                        </div>

                        <p className="text-base text-muted-foreground pl-4">
                            また、焼き鳥ペナルティの分配でも割り切れない場合に誤差が発生します。
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">誤差の補正方法</h3>
                        <div className="bg-accent/10 border-l-4 border-primary p-4 rounded-r-md">
                            <p className="text-base text-foreground">
                                全プレイヤーのスコア合計が0にならない場合、<span className="font-bold">最下位のプレイヤー</span>のスコアを調整して合計を0にします。
                            </p>
                        </div>
                        <p className="text-base text-muted-foreground pl-4">
                            上記の例では、4位のプレイヤーのスコアを -24 から -23 に調整します。
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* レート計算 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">レート計算</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">レートとは</h3>
                        <p className="text-base text-muted-foreground pl-4">
                            score（スコア）に掛ける倍率です。実際の金銭収支を計算するために使用します。
                        </p>
                        <div className="bg-muted border border-border p-4 rounded-md">
                            <p className="font-mono text-sm text-center">
                                calculatedScore = score × レート
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">計算例</h3>
                        <ul className="space-y-2 text-base pl-6 list-disc">
                            <li>score: 25</li>
                            <li>レート: 100（1000点 = 100円）</li>
                        </ul>
                        <div className="bg-muted border border-border p-4 rounded-md space-y-2">
                            <p className="text-sm">calculatedScore = 25 × 100 = 2500</p>
                            <p className="font-bold text-lg text-primary">→ 実際の収支: +2500円</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">表示される値の意味</h3>
                        <div className="bg-muted border border-border p-5 rounded-md">
                            <ul className="space-y-3 text-base">
                                <li>
                                    <span className="font-mono font-semibold text-primary">score</span>
                                    <p className="text-sm text-muted-foreground mt-1 pl-4">レート換算前のスコア</p>
                                </li>
                                <li>
                                    <span className="font-mono font-semibold text-primary">calculatedScore</span>
                                    <p className="text-sm text-muted-foreground mt-1 pl-4">レート換算後のスコア（実際の収支）</p>
                                </li>
                                <li>
                                    <span className="font-mono font-semibold text-primary">totalScore</span>
                                    <p className="text-sm text-muted-foreground mt-1 pl-4">複数半荘の score の合計</p>
                                </li>
                                <li>
                                    <span className="font-mono font-semibold text-primary">calculatedTotalProfit</span>
                                    <p className="text-sm text-muted-foreground mt-1 pl-4">複数半荘の calculatedScore の合計</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* その他の注意事項 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">その他の注意事項</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">点数入力の自動補正</h3>
                        <ul className="space-y-2 text-base pl-6 list-disc text-muted-foreground">
                            <li>新規半荘の点数入力画面で、3人の点数を入力すると、残り1人の点数が自動的に計算されます</li>
                            <li>入力順序は問いません。どの3人を入力しても、残りの1人が自動計算されます</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">点数の合計チェック</h3>
                        <p className="text-base text-muted-foreground pl-4">
                            点数入力時、全プレイヤーの合計点数が期待値（開始点数 × 人数）と異なる場合、警告が表示されます。
                        </p>
                        <div className="bg-accent/10 border-l-4 border-primary p-4 rounded-r-md">
                            <p className="text-base text-foreground">
                                <span className="font-semibold">例:</span> 4人で開始点数25000点の場合、合計は100000点になる必要があります。
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">半荘編集時の注意</h3>
                        <ul className="space-y-2 text-base pl-6 list-disc text-muted-foreground">
                            <li>半荘編集画面では、score（レート換算前のスコア）を直接編集します</li>
                            <li>編集時、合計スコアが0でない場合は警告が表示されます。通常、合計は0になるはずです</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">設定の引き継ぎ</h3>
                        <p className="text-base text-muted-foreground pl-4">
                            同じイベントで複数半荘を記録する場合、以下が自動的に引き継がれます：
                        </p>
                        <ul className="space-y-2 text-base pl-6 list-disc text-muted-foreground">
                            <li>前回の設定（レート、ウマ、返し点数、焼き鳥ペナルティ）</li>
                            <li>参加プレイヤー（点数は0にリセットされます）</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
