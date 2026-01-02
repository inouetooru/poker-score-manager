import { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import { Dashboard } from './components/Dashboard';
import { Button } from './components/ui/Button';
import { Home, PlusCircle, Users, Settings as SettingsIcon } from 'lucide-react';
import { NewRound } from './components/NewRound';
import { PlayersList } from './components/PlayersList';
import { Settings } from './components/Settings';
import { PlayerDetail } from './components/PlayerDetail';
import { EventDetail } from './components/EventDetail';
import pokerHeaderImg from './assets/poker_header_closeup_wide.png';

type View = 'dashboard' | 'new-round' | 'players' | 'player-detail' | 'event-detail' | 'settings' | 'sessions';

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
        return <NewRound onCancel={() => setCurrentView('dashboard')} onSave={() => setCurrentView('dashboard')} />;
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
          />
        ) : null;
      case 'event-detail':
        return selectedEventId ? (
          <EventDetail
            eventId={selectedEventId}
            onBack={() => setCurrentView('dashboard')}
          />
        ) : null;
      case 'sessions':
        return <Dashboard onNewRound={() => setCurrentView('new-round')} onNavigate={setCurrentView} />; // Fallback to dashboard for now
      case 'settings':
        return <Settings />;
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
            src={pokerHeaderImg}
            alt="Poker Header"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-4">
            <h1 className="text-2xl font-bold text-white text-center px-4 tracking-wider shadow-sm drop-shadow-md">ポーカースコア管理</h1>
          </div>
        </div>
        <nav className="grid grid-cols-2 gap-3">
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            className="w-full justify-start h-20 flex-col gap-1"
            onClick={() => setCurrentView('dashboard')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">ダッシュボード</span>
          </Button>
          <Button
            variant={currentView === 'new-round' ? 'default' : 'ghost'}
            className="w-full justify-start h-20 flex-col gap-1"
            onClick={() => setCurrentView('new-round')}
          >
            <PlusCircle className="h-5 w-5" />
            <span className="text-xs">新規ラウンド</span>
          </Button>
          <Button
            variant={currentView === 'players' ? 'default' : 'ghost'}
            className="w-full justify-start h-20 flex-col gap-1"
            onClick={() => {
              setCurrentView('players');
              setSelectedPlayerId(null);
            }}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs">プレイヤー</span>
          </Button>
          <Button
            variant={currentView === 'settings' ? 'default' : 'ghost'}
            className="w-full justify-start h-20 flex-col gap-1"
            onClick={() => setCurrentView('settings')}
          >
            <SettingsIcon className="h-5 w-5" />
            <span className="text-xs">設定</span>
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-4 md:p-8 overflow-y-auto h-screen'>
        <div className='max-w-4xl mx-auto'>
          {renderView()}
        </div>
      </main>
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
