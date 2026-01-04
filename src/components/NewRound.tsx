import { useState, useMemo, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Trash2, UserPlus, Save } from 'lucide-react';
import type { GameResult } from '../types/definitions';
import { cn } from '../lib/utils';
import { useInterstitialAd } from '../hooks/useInterstitialAd';

interface NewRoundProps {
  onSave: () => void;
  onCancel: () => void;
}

type RoundPlayer = {
  id: string;
  name: string;
  finalPoints: number;
  isNew?: boolean;
  yakitoriApplied?: boolean;
  touched?: boolean;  // 入力済みフラグ
};




// 五捨六入関数: .5以下は切り捨て、.6以上は切り上げ
function properRound(num: number): number {
  if (num >= 0) {
    const decimal = num - Math.floor(num);
    return decimal <= 0.5 ? Math.floor(num) : Math.ceil(num);
  } else {
    const absNum = Math.abs(num);
    const decimal = absNum - Math.floor(absNum);
    const rounded = decimal <= 0.5 ? Math.floor(absNum) : Math.ceil(absNum);
    return -rounded;
  }
}

export function NewRound({ onSave, onCancel }: NewRoundProps) {
  const { players, addPlayer, events, addRoundToEvent, createEventWithRound } = useGame();
  const { showInterstitial } = useInterstitialAd();

  const [startPoints, setStartPoints] = useState<number>(25000); // 開始点数
  const [returnPoints, setReturnPoints] = useState<number>(30000); // 返し点数
  const [rate, setRate] = useState<number>(100); // 1000点 = 100円
  const [uma14, setUma14] = useState<number>(20); // 1位/4位のウマ（1位=+20, 4位=-20）
  const [uma23, setUma23] = useState<number>(10); // 2位/3位のウマ（2位=+10, 3位=-10）
  const [yakitori, setYakitori] = useState<number>(0); // ヤキトリペナルティ
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString().slice(0, 10)
  );
  const [roundPlayers, setRoundPlayers] = useState<RoundPlayer[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [newEventName, setNewEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Auto-populate players and settings from last round when event is selected
  useEffect(() => {
    if (selectedEventId) {
      const event = events.find(e => e.id === selectedEventId);
      if (event && event.rounds.length > 0) {
        const lastRound = event.rounds[event.rounds.length - 1];
        // Set settings from last round
        setRate(lastRound.rate);
        const uma = lastRound.umaSettings || [20, 10, -10, -20];
        setUma14(uma[0] || 20);
        setUma23(uma[1] || 10);
        setStartPoints(lastRound.startPoints || 25000);
        setReturnPoints(lastRound.returnPoints || 30000);
        setYakitori(lastRound.yakitori || 0);

        // Set players from last round
        const lastRoundPlayers = lastRound.results.map(result => ({
          id: result.playerId,
          name: result.playerName,
          finalPoints: 0,
          yakitoriApplied: false,
          touched: false
        }));
        setRoundPlayers(lastRoundPlayers);
      } else if (event) {
        // Use event defaults
        setRate(event.rate);
        const uma = event.umaSettings || [20, 10, -10, -20];
        setUma14(uma[0] || 20);
        setUma23(uma[1] || 10);
        setStartPoints(event.startPoints || 25000);
        setReturnPoints(event.returnPoints || 30000);
        setYakitori(event.yakitori || 0);
      }
    } else {
      // Reset players when creating new event
      setRoundPlayers([]);
    }
  }, [selectedEventId, events]);

  const handleAddPlayer = (name: string) => {
    if (!name.trim()) return;

    if (roundPlayers.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      alert('プレイヤーは既に追加されています');
      return;
    }

    const existing = players.find(p => p.name.toLowerCase() === name.toLowerCase());
    let playerId: string;
    let playerName: string;

    if (existing) {
      playerId = existing.id;
      playerName = existing.name;
    } else {
      // Immediately register new player
      const newPlayer = addPlayer(name);
      playerId = newPlayer.id;
      playerName = newPlayer.name;
    }

    setRoundPlayers(prev => [...prev, {
      id: playerId,
      name: playerName,
      finalPoints: 0,
      yakitoriApplied: false,
      touched: false  // 初期状態は未入力
    }]);
    setNewPlayerName('');
  };

  const updatePlayerScore = (id: string, value: string) => {
    const val = parseFloat(value) || 0;
    setRoundPlayers(prev => {
      // 入力されたプレイヤーのtouchedをtrueに設定
      const updated = prev.map(p =>
        p.id === id ? { ...p, finalPoints: val, touched: true } : p
      );

      // 未入力(touched === false)のプレイヤーを見つける
      const untouchedPlayers = updated.filter(p => !p.touched);

      // 3人入力済み(touched === true)で、1人未入力の場合のみ自動計算
      if (untouchedPlayers.length === 1 && updated.length > 1) {
        const totalExpectedPoints = startPoints * updated.length;
        const untouchedPlayer = untouchedPlayers[0];

        // 入力済みプレイヤーの合計を計算
        const sumOfTouched = updated
          .filter(p => p.touched)
          .reduce((sum, p) => sum + p.finalPoints, 0);

        // 未入力プレイヤーに残りの点数を設定
        return updated.map(p =>
          p.id === untouchedPlayer.id
            ? { ...p, finalPoints: totalExpectedPoints - sumOfTouched }
            : p
        );
      }

      return updated;
    });
  };

  const removePlayer = (id: string) => {
    setRoundPlayers(prev => prev.filter(p => p.id !== id));
  };

  const toggleYakitori = (id: string) => {
    setRoundPlayers(prev => prev.map(p =>
      p.id === id ? { ...p, yakitoriApplied: !p.yakitoriApplied } : p
    ));
  };

  const totalPoints = useMemo(() => {
    return roundPlayers.reduce((acc, p) => acc + p.finalPoints, 0);
  }, [roundPlayers]);

  const totalExpectedPoints = useMemo(() => {
    return startPoints * roundPlayers.length;
  }, [startPoints, roundPlayers.length]);

  const handleSave = () => {
    if (roundPlayers.length === 0) {
      alert('プレイヤーが追加されていません');
      return;
    }

    if (totalPoints !== totalExpectedPoints) {
      if (!confirm(`合計点数が ${totalPoints.toLocaleString()} です。通常は${totalExpectedPoints.toLocaleString()}点になるはずです。保存しますか?`)) {
        return;
      }
    }

    // Sort players by finalPoints to determine rank
    const sortedPlayers = [...roundPlayers].sort((a, b) => b.finalPoints - a.finalPoints);

    // Build umaSettings array from uma14 and uma23
    const umaSettings = [uma14, uma23, -uma23, -uma14];

    const finalResults: GameResult[] = sortedPlayers.map((rp, index) => {
      const rank = index + 1;
      const pointsDiff = rp.finalPoints - returnPoints; // 返し点数を基準に計算
      const uma = umaSettings[index] || 0;
      const yakitoriPenalty = (rp.yakitoriApplied && yakitori > 0) ? yakitori : 0;
      const score = properRound((pointsDiff / 1000) + uma - yakitoriPenalty);

      return {
        playerId: rp.id,
        playerName: rp.name,
        finalPoints: rp.finalPoints,
        pointsDiff: pointsDiff,
        rank: rank,
        uma: uma,
        score: score,
        yakitoriApplied: rp.yakitoriApplied
      };
    });

    // 焼き鳥ペナルティの分配: 焼き鳥でないプレイヤーで山分けする
    if (yakitori > 0) {
      const yakitoriPlayers = finalResults.filter(r => r.yakitoriApplied);
      const nonYakitoriPlayers = finalResults.filter(r => !r.yakitoriApplied);

      if (yakitoriPlayers.length > 0 && nonYakitoriPlayers.length > 0) {
        const totalYakitoriPenalty = yakitoriPlayers.length * yakitori;
        const bonusPerPlayer = properRound(totalYakitoriPenalty / nonYakitoriPlayers.length);

        // 焼き鳥でない各プレイヤーにボーナスを加算
        finalResults.forEach(r => {
          if (!r.yakitoriApplied) {
            r.score += bonusPerPlayer;
          }
        });
      }
    }

    // 五捨六入の丸め誤差と焼き鳥分配の誤差を補正:
    // 各プレイヤーの小数部分の組み合わせや焼き鳥分配の割り切れない端数により±1〜2の誤差が発生する可能性があるため、
    // 最後のプレイヤー（最下位）のscoreを調整して合計を0にする
    const totalScore = finalResults.reduce((sum, r) => sum + r.score, 0);
    if (totalScore !== 0 && finalResults.length > 0) {
      finalResults[finalResults.length - 1].score -= totalScore;
    }

    if (selectedEventId) {
      // Add round to existing event
      addRoundToEvent(selectedEventId, finalResults, rate, umaSettings, startPoints, returnPoints, yakitori);
    } else if (newEventName.trim()) {
      // Create new event with this round
      createEventWithRound(
        newEventName.trim(),
        new Date(selectedDate).toISOString(),
        rate,
        eventLocation.trim() || undefined,
        finalResults,
        rate,
        umaSettings,
        startPoints,
        returnPoints,
        yakitori
      );
    } else {
      alert('イベントを選択または作成してください');
      return;
    }

    // 10%の確率でインタースティシャル広告を表示
    const showAdProbability = Math.random();
    console.log('Ad probability:', showAdProbability);
    if (showAdProbability < 0.1) {
      console.log('Showing interstitial ad after save');
      showInterstitial();
    }

    onSave();
  };

  return (
    <div className='space-y-6 pb-safe-large'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>半荘設定</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid w-full items-center gap-1.5'>
            <label htmlFor='event' className='text-sm font-medium'>イベント選択</label>
            <select
              id='event'
              className='flex h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-base'
              value={selectedEventId}
              onChange={e => {
                setSelectedEventId(e.target.value);
                if (e.target.value) {
                  const event = events.find(ev => ev.id === e.target.value);
                  if (event) {
                    setRate(event.rate);
                    const uma = event.umaSettings || [20, 10, -10, -20];
                    setUma14(uma[0] || 20);
                    setUma23(uma[1] || 10);
                    setYakitori(event.yakitori || 0);
                    setEventLocation(event.location || '');
                  }
                }
              }}
            >
              <option value="">新しいイベントを作成</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} (半荘 {event.rounds.length + 1})
                </option>
              ))}
            </select>
          </div>
          {!selectedEventId && (
            <>
              <div className='grid w-full items-center gap-1.5'>
                <label htmlFor='eventName' className='text-sm font-medium'>イベント名</label>
                <Input
                  id='eventName'
                  value={newEventName}
                  onChange={e => setNewEventName(e.target.value)}
                  placeholder='例: 月例麻雀大会'
                  className='h-12'
                />
              </div>
              <div className='grid w-full items-center gap-1.5'>
                <label htmlFor='location' className='text-sm font-medium'>場所（任意）</label>
                <Input
                  id='location'
                  value={eventLocation}
                  onChange={e => setEventLocation(e.target.value)}
                  placeholder='例: 自宅'
                  className='h-12'
                />
              </div>
            </>
          )}
          <div className='grid w-full items-center gap-1.5'>
            <label htmlFor='date' className='text-sm font-medium'>日時</label>
            <Input
              id='date'
              type='date'
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className='h-12'
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid w-full items-center gap-1.5'>
              <label htmlFor='startPoints' className='text-sm font-medium'>開始点数</label>
              <Input
                id='startPoints'
                type='number'
                step='1000'
                value={startPoints}
                onChange={e => setStartPoints(parseFloat(e.target.value) || 25000)}
                className='h-12'
              />
            </div>
            <div className='grid w-full items-center gap-1.5'>
              <label htmlFor='returnPoints' className='text-sm font-medium'>返し点数</label>
              <Input
                id='returnPoints'
                type='number'
                step='1000'
                value={returnPoints}
                onChange={e => setReturnPoints(parseFloat(e.target.value) || 30000)}
                className='h-12'
              />
            </div>
          </div>
          <div className='grid w-full items-center gap-1.5'>
            <label htmlFor='rate' className='text-sm font-medium'>レート（1000点あたり）</label>
            <Input
              id='rate'
              type='number'
              step='10'
              value={rate}
              onChange={e => setRate(parseFloat(e.target.value) || 0)}
              className='h-12'
            />
          </div>
          <div className='grid w-full items-center gap-1.5'>
            <label className='text-sm font-medium'>ウマ設定</label>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <span className='text-sm whitespace-nowrap w-24'>1位/4位 ±</span>
                <Input
                  type='number'
                  value={uma14}
                  onChange={e => setUma14(parseFloat(e.target.value) || 0)}
                  className='w-20 h-12'
                />
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm whitespace-nowrap w-24'>2位/3位 ±</span>
                <Input
                  type='number'
                  value={uma23}
                  onChange={e => setUma23(parseFloat(e.target.value) || 0)}
                  className='w-20 h-12'
                />
              </div>
            </div>
          </div>
          <div className='grid w-full items-center gap-1.5'>
            <label htmlFor='yakitori' className='text-sm font-medium'>ヤキトリ（0で無効）</label>
            <Input
              id='yakitori'
              type='number'
              step='10'
              value={yakitori}
              onChange={e => setYakitori(parseFloat(e.target.value) || 0)}
              className='h-12'
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>プレイヤー追加</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex space-x-2'>
            <Input
              placeholder='プレイヤー名'
              value={newPlayerName}
              onChange={e => setNewPlayerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddPlayer(newPlayerName)}
              className='h-12'
            />
            <Button onClick={() => handleAddPlayer(newPlayerName)}>
              <UserPlus className='h-4 w-4' />
            </Button>
          </div>
          <div className='mt-4 flex flex-wrap gap-2'>
            {players.map(p => {
              const isSelected = roundPlayers.some(rp => rp.name === p.name);
              if (isSelected) return null;
              return (
                <Button
                  key={p.id}
                  variant='secondary'
                  size='sm'
                  onClick={() => handleAddPlayer(p.name)}
                >
                  {p.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>点数入力</CardTitle>
          <div className={totalPoints === totalExpectedPoints ? 'text-blue-400 font-bold' : 'text-red-500 font-bold'}>
            合計: {totalPoints.toLocaleString()}点 / {totalExpectedPoints.toLocaleString()}点
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className={`grid gap-2 font-medium text-sm text-muted-foreground mb-2 px-2 ${yakitori > 0 ? 'grid-cols-[1.5fr_1fr_2fr_1fr_1fr_1fr_1fr_0.5fr]' : 'grid-cols-[3fr_3fr_2fr_2fr_1.5fr_1.5fr_0.5fr]'}`}>
              <div className='text-center'>名前</div>
              {yakitori > 0 && <div className='text-center'>ヤキトリ</div>}
              <div className='text-center'>最終点数</div>
              <div className='text-center'>返し点数</div>
              <div className='text-center'>ウマ</div>
              <div className='text-center'>合計点</div>
              <div className='text-center'>合計点（レート含む）</div>
              <div></div>
            </div>

            {roundPlayers.map((p, idx) => {
              // Sort to get rank for preview
              const sorted = [...roundPlayers].sort((a, b) => b.finalPoints - a.finalPoints);
              const rank = sorted.findIndex(sp => sp.id === p.id) + 1;
              const pointsDiff = p.finalPoints - returnPoints;
              const returnScore = pointsDiff / 1000; // 返し点数（千点単位）
              const umaArray = [uma14, uma23, -uma23, -uma14];
              const uma = rank > 0 && rank <= 4 ? umaArray[rank - 1] : 0;
              const yakitoriPenalty = (p.yakitoriApplied && yakitori > 0) ? yakitori : 0;
              const score = returnScore + uma - yakitoriPenalty; // スコア（レート前）
              const calculatedScore = score * rate; // 計算済みスコア（レート含む）

              return (
                <div key={p.id} className={`grid gap-2 items-center ${yakitori > 0 ? 'grid-cols-[1.5fr_1fr_2fr_1fr_1fr_1fr_1fr_0.5fr]' : 'grid-cols-[3fr_3fr_2fr_2fr_1.5fr_1.5fr_0.5fr]'}`}>
                  <div className='font-medium truncate text-center' title={p.name}>{p.name}</div>
                  {yakitori > 0 && (
                    <div className='flex justify-center items-center'>
                      <input
                        type='checkbox'
                        checked={p.yakitoriApplied || false}
                        onChange={() => toggleYakitori(p.id)}
                        className='h-6 w-6 cursor-pointer'
                      />
                    </div>
                  )}
                  <div>
                    <Input
                      type='number'
                      value={p.finalPoints}
                      onChange={e => updatePlayerScore(p.id, e.target.value)}
                      placeholder={startPoints.toString()}
                      className='h-12'
                    />
                  </div>
                  <div className={cn('font-mono text-center text-sm', returnScore > 0 ? 'text-blue-400' : returnScore < 0 ? 'text-red-500' : '')}>
                    {returnScore > 0 ? '+' : ''}{returnScore.toFixed(1)}
                  </div>
                  <div className='font-mono text-center text-sm text-blue-500'>
                    {uma > 0 ? '+' : ''}{uma}
                  </div>
                  <div className={cn('font-mono text-center text-sm font-bold', score > 0 ? 'text-blue-400' : score < 0 ? 'text-red-500' : '')}>
                    {score > 0 ? '+' : ''}{properRound(score)}
                  </div>
                  <div className={cn('font-mono text-center text-sm font-bold', calculatedScore > 0 ? 'text-blue-400' : calculatedScore < 0 ? 'text-red-500' : '')}>
                    {calculatedScore > 0 ? '+' : ''}{properRound(calculatedScore)}
                  </div>
                  <div className='text-right'>
                    <Button variant='ghost' size='icon' onClick={() => removePlayer(p.id)}>
                      <Trash2 className='h-4 w-4 text-destructive' />
                    </Button>
                  </div>
                </div>
              );
            })}

            {roundPlayers.length === 0 && (
              <div className='text-center py-8 text-muted-foreground'>
                プレイヤーを追加して点数の記録を開始してください。
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 保存・キャンセルボタン */}
      <div className="mt-8 mb-6 flex items-center justify-between gap-4">
        <Button
          variant='outline'
          size="lg"
          onClick={onCancel}
          className="h-14 px-6 border-2 font-semibold"
        >
          キャンセル
        </Button>

        <Button
          size="lg"
          onClick={handleSave}
          className="h-16 flex-1 max-w-[240px] text-xl font-bold shadow-2xl bg-primary"
        >
          <Save className='mr-2 h-6 w-6' /> 保存
        </Button>
      </div>
    </div>
  );

}
