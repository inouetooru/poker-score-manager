import { useState } from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import { Dashboard } from './components/Dashboard';
import { Button } from './components/ui/Button';
import { LayoutDashboard, Users, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { cn } from './lib/utils';
import { NewRound } from './components/NewRound';
import { PlayersList } from './components/PlayersList';
import { Settings } from './components/Settings';
import { PlayerDetail } from './components/PlayerDetail';
import { EventDetail } from './components/EventDetail';

type View = 'dashboard' | 'new-round' | 'players' | 'player-detail' | 'event-detail' | 'settings' | 'sessions';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { exportData } = useGame();

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
      <aside className='w-full md:w-64 border-r bg-card p-4 flex flex-col gap-4'>
        <div className='flex items-center gap-2 px-2 py-4'>
          <div className='h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg'></div>
          <h1 className='text-xl font-bold tracking-tight'>ポーカー管理</h1>
        </div>

        <nav className='space-y-1'>
          <Button
            variant={currentView === 'dashboard' ? 'secondary' : 'ghost'}
            className='w-full justify-start'
            onClick={() => setCurrentView('dashboard')}
          >
            <LayoutDashboard className='mr-2 h-4 w-4' />
            ダッシュボード
          </Button>
          <Button
            variant={currentView === 'players' ? 'secondary' : 'ghost'}
            className='w-full justify-start'
            onClick={() => setCurrentView('players')}
          >
            <Users className='mr-2 h-4 w-4' />
            プレイヤー
          </Button>
          <Button
            variant={currentView === 'settings' ? 'secondary' : 'ghost'}
            className='w-full justify-start'
            onClick={() => setCurrentView('settings')}
          >
            <SettingsIcon className='mr-2 h-4 w-4' />
            設定
          </Button>
        </nav>

        <div className='mt-auto pt-4 border-t'>
          <div className='text-xs text-muted-foreground px-2'>
            v1.0.0
          </div>
        </div>
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
