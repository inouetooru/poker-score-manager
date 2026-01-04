import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ArrowLeft } from 'lucide-react';

interface FuCalculationGuideProps {
    onBack: () => void;
}

export function FuCalculationGuide({ onBack }: FuCalculationGuideProps) {
    return (
        <div className="space-y-8 pb-safe">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack} className="h-12 w-12">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h2 className="text-4xl font-bold tracking-tight">符計算の説明</h2>
            </div>

            <Card className="bg-yellow-950/30 border-yellow-700/50">
                <CardContent className="pt-6">
                    <p className="text-base text-yellow-200">
                        このページでは、麻雀の符計算の方法について詳しく解説します。
                    </p>
                </CardContent>
            </Card>

            {/* 基本符 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">基本符（副底）</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-base">どんな和了でも基本として <strong className="text-blue-400">20符</strong> が付きます。これを「副底（フーテイ）」と言います。</p>
                    <div className="bg-accent/20 p-4 rounded-lg">
                        <p className="font-medium text-base">基本符 = 20符</p>
                    </div>
                </CardContent>
            </Card>

            {/* 和了の形 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">和了の形による符</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-center p-4 font-medium text-base w-32 whitespace-nowrap">和了形</th>
                                    <th className="text-center p-4 font-medium text-base w-24 whitespace-nowrap">符数</th>
                                    <th className="text-center p-4 font-medium text-base w-64 whitespace-nowrap">説明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">ツモ和了</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">+2符</td>
                                    <td className="p-4 text-base text-muted-foreground text-center whitespace-nowrap">自分でツモった場合</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">門前ロン</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">+10符</td>
                                    <td className="p-4 text-base text-muted-foreground text-center whitespace-nowrap">鳴かずにロン和了した場合</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* 面子の符 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">面子（メンツ）の符</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-base text-muted-foreground">
                        面子には刻子（コーツ：同じ牌3枚）と槓子（カンツ：同じ牌4枚）があり、それぞれ符が付きます。
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-center p-4 font-medium text-base w-64 whitespace-nowrap">面子の種類</th>
                                    <th className="text-center p-4 font-medium text-base w-56 whitespace-nowrap">明刻/明槓（ポン/明カン）</th>
                                    <th className="text-center p-4 font-medium text-base w-48 whitespace-nowrap">暗刻/暗槓（自力）</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">中張牌（2-8）の刻子</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">2符</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">4符</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">么九牌（1,9,字牌）の刻子</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">4符</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">8符</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">中張牌の槓子</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">8符</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">16符</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">么九牌の槓子</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">16符</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">32符</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-accent/20 p-4 rounded-lg">
                        <p className="text-base"><strong>注意:</strong> 順子（シュンツ：連続する3枚）には符は付きません。</p>
                    </div>
                </CardContent>
            </Card>

            {/* 雀頭の符 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">雀頭（ジャントウ：アタマ）の符</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-center p-4 font-medium text-base w-80 whitespace-nowrap">雀頭の種類</th>
                                    <th className="text-center p-4 font-medium text-base w-24 whitespace-nowrap">符数</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">役牌（三元牌、自風牌、場風牌）</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">+2符</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">その他の雀頭</td>
                                    <td className="p-4 font-mono text-base text-center whitespace-nowrap">0符</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* 待ちの形 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">待ちの形による符</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-center p-4 font-medium text-base w-56 whitespace-nowrap">待ちの形</th>
                                    <th className="text-center p-4 font-medium text-base w-24 whitespace-nowrap">符数</th>
                                    <th className="text-center p-4 font-medium text-base w-72 whitespace-nowrap">例</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">単騎待ち（タンキ）</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">+2符</td>
                                    <td className="p-4 text-base text-muted-foreground text-center whitespace-nowrap">雀頭の1枚待ち</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">嵌張待ち（カンチャン）</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">+2符</td>
                                    <td className="p-4 text-base text-muted-foreground text-center whitespace-nowrap">例: 4-6で5待ち</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">辺張待ち（ペンチャン）</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">+2符</td>
                                    <td className="p-4 text-base text-muted-foreground text-center whitespace-nowrap">例: 1-2で3待ち、8-9で7待ち</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">両面待ち（リャンメン）</td>
                                    <td className="p-4 font-mono text-base text-center whitespace-nowrap">0符</td>
                                    <td className="p-4 text-base text-muted-foreground text-center whitespace-nowrap">例: 4-5で3-6待ち</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 text-base text-center whitespace-nowrap">双碰待ち（シャンポン）</td>
                                    <td className="p-4 font-mono text-base text-center whitespace-nowrap">0符</td>
                                    <td className="p-4 text-base text-muted-foreground text-center whitespace-nowrap">2つの対子のどちらかで和了</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* 切り上げルール */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">符の切り上げ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-base">計算した符は、<strong className="text-blue-400">10符単位で切り上げ</strong>ます。</p>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-center p-4 font-medium text-base w-32 whitespace-nowrap">計算結果</th>
                                    <th className="text-center p-4 font-medium text-base w-32 whitespace-nowrap">切り上げ後</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 font-mono text-base text-center whitespace-nowrap">21-30符</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">30符</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 font-mono text-base text-center whitespace-nowrap">31-40符</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">40符</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 font-mono text-base text-center whitespace-nowrap">41-50符</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">50符</td>
                                </tr>
                                <tr className="border-b border-border/50">
                                    <td className="p-4 font-mono text-base text-center whitespace-nowrap">51-60符</td>
                                    <td className="p-4 font-mono text-blue-400 text-base text-center whitespace-nowrap">60符</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-accent/20 p-4 rounded-lg">
                        <p className="text-base"><strong>注意:</strong> 20符（ピンフのツモ）と25符（七対子）は例外で、そのまま使用します。</p>
                    </div>
                </CardContent>
            </Card>

            {/* 計算例 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">符計算の例</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-accent/20 p-4 rounded-lg space-y-2">
                        <p className="font-medium text-base">例1: 門前ロン（リャンメン待ち）</p>
                        <ul className="list-disc list-inside space-y-1 text-base">
                            <li>副底: 20符</li>
                            <li>門前ロン: +10符</li>
                            <li>暗刻（中張）: +4符</li>
                            <li>暗刻（么九）: +8符</li>
                        </ul>
                        <p className="font-mono text-blue-400 font-bold text-lg">合計: 42符 → 切り上げ50符</p>
                    </div>

                    <div className="bg-accent/20 p-4 rounded-lg space-y-2">
                        <p className="font-medium text-base">例2: ツモ和了（カンチャン待ち）</p>
                        <ul className="list-disc list-inside space-y-1 text-base">
                            <li>副底: 20符</li>
                            <li>ツモ和了: +2符</li>
                            <li>カンチャン待ち: +2符</li>
                            <li>明刻（中張）: +2符</li>
                            <li>暗刻（中張）: +4符</li>
                        </ul>
                        <p className="font-mono text-blue-400 font-bold text-lg">合計: 30符</p>
                    </div>

                    <div className="bg-accent/20 p-4 rounded-lg space-y-2">
                        <p className="font-medium text-base text-muted-foreground">※ 特殊ケース</p>
                        <ul className="list-disc list-inside space-y-1 text-base">
                            <li><strong>ピンフ（平和）のツモ:</strong> 20符</li>
                            <li><strong>七対子:</strong> 固定25符</li>
                            <li><strong>鳴いた1飜役:</strong> 30符固定（食い平和形）</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
