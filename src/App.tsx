import { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import { Dashboard } from './components/Dashboard';
import { Button } from './components/ui/Button';
import { Home, PlusCircle, Users, Settings as SettingsIcon, Calculator, BookOpen, Info } from 'lucide-react';
import { NewRound } from './components/NewRound';
import { PlayersList } from './components/PlayersList';
import { Settings } from './components/Settings';
import { PlayerDetail } from './components/PlayerDetail';
import { EventDetail } from './components/EventDetail';
import { ScoreTable } from './components/ScoreTable';
import { FuCalculationGuide } from './components/FuCalculationGuide';
import { RulesPage } from './components/RulesPage';
import mahjongHeaderImg from './assets/poker_header_closeup_wide.png'; // TODO: Replace with mahjong image
import { AdBanner } from './components/AdBanner';

type View = 'dashboard' | 'new-round' | 'players' | 'player-detail' | 'event-detail' | 'settings' | 'sessions' | 'score-table' | 'fu-guide' | 'rules';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);



  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            onNewRound={() => setCurrentView('new-round')}
            onNavigate={setCurrentView}
            onEventSelect={(eventId) => {
              setSelectedEventId(eventId);
              setCurrentView('event-detail');
            }}
          />
        );
      case 'new-round':
        return <NewRound onSave={() => setCurrentView('dashboard')} onCancel={() => setCurrentView('dashboard')} />;
      case 'players':
        return (
          <PlayersList
            onBack={() => setCurrentView('dashboard')}
            onPlayerSelect={(playerId) => {
              setSelectedPlayerId(playerId);
              setCurrentView('player-detail');
            }}
          />
        );
      case 'player-detail':
        return selectedPlayerId ? (
          <PlayerDetail
            playerId={selectedPlayerId}
            onBack={() => setCurrentView('players')}
            onEventSelect={(eventId) => {
              setSelectedEventId(eventId);
              setCurrentView('event-detail');
            }}
          />
        ) : null;
      case 'event-detail':
        return selectedEventId ? (
          <EventDetail
            eventId={selectedEventId}
            onBack={() => setCurrentView('dashboard')}
            onPlayerSelect={(playerId) => {
              setSelectedPlayerId(playerId);
              setCurrentView('player-detail');
            }}
          />
        ) : null;
      case 'sessions':
        return <Dashboard onNewRound={() => setCurrentView('new-round')} onNavigate={setCurrentView} />; // Fallback to dashboard for now
      case 'settings':
        return <Settings />;
      case 'score-table':
        return <ScoreTable onBack={() => setCurrentView('dashboard')} />;
      case 'fu-guide':
        return <FuCalculationGuide onBack={() => setCurrentView('dashboard')} />;
      case 'rules':
        return <RulesPage onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNewRound={() => setCurrentView('new-round')} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col md:flex-row'>
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-card border-r border-border p-4">
        <div className="mb-6 relative rounded-lg overflow-hidden h-32 shadow-lg border border-border/50">
          <img
            src={mahjongHeaderImg}
            alt="Mahjong Header"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-4">
            <h1 className="text-2xl font-bold text-white text-center px-4 tracking-wider shadow-sm drop-shadow-md">麻雀スコア管理</h1>
          </div>
        </div>
        <nav className="flex flex-col gap-3">
          {/* 大きいボタン: 新規半荘 */}
          <Button
            variant={currentView === 'new-round' ? 'default' : 'ghost'}
            className="w-full justify-center h-24 flex-col gap-2 text-lg font-bold"
            onClick={() => setCurrentView('new-round')}
          >
            <PlusCircle className="h-8 w-8" />
            <span>新規半荘</span>
          </Button>

          {/* 中くらいのボタン: ダッシュボード・プレイヤー */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-center h-20 flex-col gap-1.5"
              onClick={() => setCurrentView('dashboard')}
            >
              <Home className="h-6 w-6" />
              <span className="text-sm">ダッシュボード</span>
            </Button>
            <Button
              variant={currentView === 'players' ? 'default' : 'ghost'}
              className="w-full justify-center h-20 flex-col gap-1.5"
              onClick={() => {
                setCurrentView('players');
                setSelectedPlayerId(null);
              }}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">プレイヤー</span>
            </Button>
          </div>

          {/* 小さいボタン: 点数早見表・符計算・アプリガイド・設定 */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={currentView === 'score-table' ? 'default' : 'ghost'}
              className="w-full justify-center h-16 flex-col gap-1"
              onClick={() => setCurrentView('score-table')}
            >
              <Calculator className="h-4 w-4" />
              <span className="text-xs">点数早見表</span>
            </Button>
            <Button
              variant={currentView === 'fu-guide' ? 'default' : 'ghost'}
              className="w-full justify-center h-16 flex-col gap-1"
              onClick={() => setCurrentView('fu-guide')}
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">符計算</span>
            </Button>
            <Button
              variant={currentView === 'rules' ? 'default' : 'ghost'}
              className="w-full justify-center h-16 flex-col gap-1"
              onClick={() => setCurrentView('rules')}
            >
              <Info className="h-4 w-4" />
              <span className="text-xs">アプリガイド</span>
            </Button>
            <Button
              variant={currentView === 'settings' ? 'default' : 'ghost'}
              className="w-full justify-center h-16 flex-col gap-1"
              onClick={() => setCurrentView('settings')}
            >
              <SettingsIcon className="h-4 w-4" />
              <span className="text-xs">設定</span>
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-4 md:p-8 overflow-y-auto h-screen'>
        <div className='max-w-4xl mx-auto'>
          {renderView()}
        </div>
      </main>

      {/* 広告バナー（Android端末でのみ表示、新規半荘画面以外） */}
      <AdBanner currentView={currentView} />
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
