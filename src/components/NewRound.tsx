import { useState, useMemo, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Trash2, UserPlus } from 'lucide-react';
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
  startChip: number;
  endChip: number;
  isNew?: boolean;
};




export function NewRound({ onSave, onCancel }: NewRoundProps) {
  const { players, addPlayer, events, addRoundToEvent, createEventWithRound } = useGame();
  const { showInterstitial } = useInterstitialAd();

  const [rate, setRate] = useState<number>(10);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString().slice(0, 10)
  );
  const [roundPlayers, setRoundPlayers] = useState<RoundPlayer[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [bulkStartChip, setBulkStartChip] = useState<number>(0);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [newEventName, setNewEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Auto-populate players and rate from last round when event is selected
  useEffect(() => {
    if (selectedEventId) {
      const event = events.find(e => e.id === selectedEventId);
      if (event && event.rounds.length > 0) {
        const lastRound = event.rounds[event.rounds.length - 1];
        // Set rate from last round
        setRate(lastRound.rate);

        // Set bulkStartChip from last round (use the first player's startChip as reference)
        if (lastRound.results.length > 0) {
          const firstPlayerStartChip = lastRound.results[0].chipStart;
          setBulkStartChip(firstPlayerStartChip);
        }

        // Set players from last round
        const lastRoundPlayers = lastRound.results.map(result => ({
          id: result.playerId,
          name: result.playerName,
          startChip: lastRound.results[0]?.chipStart || 0,
          endChip: 0
        }));
        setRoundPlayers(lastRoundPlayers);
      }
    } else {
      // Reset players when creating new event
      setRoundPlayers([]);
    }
  }, [selectedEventId, events]);

  const handleAddPlayer = (name: string) => {
    if (!name.trim()) return;

    if (roundPlayers.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      alert('プレイヤーは既にラウンドに追加されています');
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
      startChip: bulkStartChip,
      endChip: 0
    }]);
    setNewPlayerName('');
  };

  const updatePlayerScore = (id: string, field: 'startChip' | 'endChip', value: string) => {
    const val = parseFloat(value) || 0;
    setRoundPlayers(prev => {
      const updated = prev.map(p =>
        p.id === id ? { ...p, [field]: val } : p
      );

      // Auto-calculate last player's end chip only when a non-last player's endChip changes
      if (updated.length > 1 && field === 'endChip') {
        const lastIndex = updated.length - 1;
        const isEditingLastPlayer = updated[lastIndex].id === id;

        // Only auto-calculate if we're NOT editing the last player directly
        if (!isEditingLastPlayer) {
          let sumExceptLast = 0;
          for (let i = 0; i < lastIndex; i++) {
            sumExceptLast += (updated[i].endChip - updated[i].startChip);
          }
          updated[lastIndex] = {
            ...updated[lastIndex],
            endChip: updated[lastIndex].startChip - sumExceptLast
          };
        }
      }

      return updated;
    });
  };

  const handleBulkStartChipChange = (value: string) => {
    const val = parseFloat(value) || 0;
    setBulkStartChip(val);
    setRoundPlayers(prev => prev.map(p => ({ ...p, startChip: val })));
  };

  const removePlayer = (id: string) => {
    setRoundPlayers(prev => prev.filter(p => p.id !== id));
  };

  const totalChipDiff = useMemo(() => {
    return roundPlayers.reduce((acc, p) => acc + (p.endChip - p.startChip), 0);
  }, [roundPlayers]);

  const handleSave = () => {
    if (roundPlayers.length === 0) {
      alert('プレイヤーが追加されていません');
      return;
    }

    if (totalChipDiff !== 0) {
      if (!confirm('合計チップ差分が ' + totalChipDiff + ' です。通常は0になるはずです。保存しますか?')) {
        return;
      }
    }

    const finalResults: GameResult[] = roundPlayers.map(rp => {
      const diff = rp.endChip - rp.startChip;
      return {
        playerId: rp.id,
        playerName: rp.name,
        chipStart: rp.startChip,
        chipEnd: rp.endChip,
        chipDiff: diff,
        score: diff * rate
      };
    });

    if (selectedEventId) {
      // Add round to existing event
      addRoundToEvent(selectedEventId, finalResults, rate);
    } else if (newEventName.trim()) {
      // Create new event with this round
      createEventWithRound(
        newEventName.trim(),
        new Date(selectedDate).toISOString(),
        rate,
        eventLocation.trim() || undefined,
        finalResults,
        rate
      );
    } else {
      alert('イベントを選択または作成してください');
      return;
    }

    // 95%の確率でインタースティシャル広告を表示（テスト用）
    const showAdProbability = Math.random();
    console.log('Ad probability:', showAdProbability);
    if (showAdProbability < 0.95) {
      console.log('Showing interstitial ad after save');
      showInterstitial();
    }

    onSave();
  };

  return (
    <div className='space-y-6 pb-safe-large'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>セッション設定</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid w-full items-center gap-1.5'>
            <label htmlFor='event' className='text-sm font-medium'>イベント</label>
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
                    setEventLocation(event.location || '');
                  }
                }
              }}
            >
              <option value="">新しいイベントを作成</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} (ラウンド {event.rounds.length + 1})
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
                  placeholder='例: 月例ポーカー大会'
                />
              </div>
              <div className='grid w-full items-center gap-1.5'>
                <label htmlFor='location' className='text-sm font-medium'>場所（任意）</label>
                <Input
                  id='location'
                  value={eventLocation}
                  onChange={e => setEventLocation(e.target.value)}
                  placeholder='例: 自宅'
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
            />
          </div>
          <div className='grid w-full items-center gap-1.5'>
            <label htmlFor='rate' className='text-sm font-medium'>倍率</label>
            <Input
              id='rate'
              type='number'
              value={rate}
              onChange={e => setRate(parseFloat(e.target.value))}
            />
          </div>
          <div className='grid w-full items-center gap-1.5'>
            <label htmlFor='bulkStartChip' className='text-sm font-medium'>開始チップ数（一括）</label>
            <Input
              id='bulkStartChip'
              type='number'
              value={bulkStartChip}
              onChange={e => handleBulkStartChipChange(e.target.value)}
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
          <CardTitle>スコア</CardTitle>
          <div className={totalChipDiff === 0 ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
            チェックサム: {totalChipDiff > 0 ? '+' : ''}{totalChipDiff}
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground mb-2 px-2'>
              <div className='col-span-3'>名前</div>
              <div className='col-span-3'>開始</div>
              <div className='col-span-3'>終了</div>
              <div className='col-span-2'>スコア</div>
              <div className='col-span-1'></div>
            </div>

            {roundPlayers.map((p) => {
              const diff = p.endChip - p.startChip;
              const score = diff * rate;
              return (
                <div key={p.id} className='grid grid-cols-12 gap-4 items-center'>
                  <div className='col-span-3 font-medium truncate' title={p.name}>{p.name}</div>
                  <div className='col-span-3'>
                    <Input
                      type='number'
                      value={p.startChip}
                      onChange={e => updatePlayerScore(p.id, 'startChip', e.target.value)}
                    />
                  </div>
                  <div className='col-span-3'>
                    <Input
                      type='number'
                      value={p.endChip}
                      onChange={e => updatePlayerScore(p.id, 'endChip', e.target.value)}
                    />
                  </div>
                  <div className={cn('col-span-2 font-mono text-right', score > 0 ? 'text-green-500' : score < 0 ? 'text-red-500' : '')}>
                    {score > 0 ? '+' : ''}{score.toLocaleString()}
                  </div>
                  <div className='col-span-1 text-right'>
                    <Button variant='ghost' size='icon' onClick={() => removePlayer(p.id)}>
                      <Trash2 className='h-4 w-4 text-destructive' />
                    </Button>
                  </div>
                </div>
              );
            })}

            {roundPlayers.length === 0 && (
              <div className='text-center py-8 text-muted-foreground'>
                プレイヤーを追加してスコアの記録を開始してください。
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );

}
