import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Icon from '@/components/ui/icon';
import HomePage from '@/pages/HomePage';
import LevelsPage from '@/pages/LevelsPage';
import DictionaryPage from '@/pages/DictionaryPage';
import ProgressPage from '@/pages/ProgressPage';
import RatingPage from '@/pages/RatingPage';
import SettingsPage from '@/pages/SettingsPage';
import CustomizePage from '@/pages/CustomizePage';
import DialogsPage from '@/pages/DialogsPage';
import ExercisePage from '@/pages/ExercisePage';

type Page = 'home' | 'levels' | 'dictionary' | 'progress' | 'rating' | 'settings' | 'customize' | 'dialogs' | 'exercise';

const NAV_ITEMS = [
  { page: 'home' as Page, icon: 'Home', label: 'Главная' },
  { page: 'levels' as Page, icon: 'Map', label: 'Уровни' },
  { page: 'dictionary' as Page, icon: 'BookOpen', label: 'Словарь' },
  { page: 'progress' as Page, icon: 'BarChart2', label: 'Прогресс' },
  { page: 'rating' as Page, icon: 'Trophy', label: 'Рейтинг' },
];

const PAGE_TITLES: Record<Page, string> = {
  home: 'FRANÇAIS QUEST',
  levels: 'УРОВНИ',
  dictionary: 'СЛОВАРЬ',
  progress: 'ПРОГРЕСС',
  rating: 'РЕЙТИНГ',
  settings: 'НАСТРОЙКИ',
  customize: 'ПЕРСОНАЖ',
  dialogs: 'ДИАЛОГИ',
  exercise: 'УПРАЖНЕНИЕ',
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [prevPage, setPrevPage] = useState<Page>('levels');

  function navigate(to: string) {
    if (to === 'exercise') setPrevPage(page);
    setPage(to as Page);
  }

  const showBottomNav = page !== 'exercise';

  return (
    <TooltipProvider>
      <Toaster />
      <div className="min-h-screen bg-retro-bg flex flex-col max-w-md mx-auto relative">
        {/* Scanlines overlay */}
        <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-30" />

        {/* Header */}
        <header className="sticky top-0 z-40 bg-retro-bg border-b-2 border-retro-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              {(page === 'settings' || page === 'customize' || page === 'dialogs') && (
                <button onClick={() => setPage('home')}>
                  <Icon name="ChevronLeft" size={18} className="text-retro-gold" />
                </button>
              )}
              <span className="text-xl">🗼</span>
              <h1 className="font-pixel text-[10px] neon-text-gold leading-none">
                {PAGE_TITLES[page]}
              </h1>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => navigate('dialogs')}
                className={`p-1.5 border border-retro-border transition-colors ${page === 'dialogs' ? 'border-retro-cyan text-retro-cyan' : 'text-retro-border hover:text-white'}`}
              >
                <Icon name="MessageCircle" size={16} />
              </button>
              <button
                onClick={() => navigate('customize')}
                className={`p-1.5 border border-retro-border transition-colors ${page === 'customize' ? 'border-retro-pink text-retro-pink' : 'text-retro-border hover:text-white'}`}
              >
                <Icon name="User" size={16} />
              </button>
              <button
                onClick={() => navigate('settings')}
                className={`p-1.5 border border-retro-border transition-colors ${page === 'settings' ? 'border-retro-gold text-retro-gold' : 'text-retro-border hover:text-white'}`}
              >
                <Icon name="Settings" size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-20">
          {page === 'home' && <HomePage onNavigate={navigate} />}
          {page === 'levels' && <LevelsPage onNavigate={navigate} />}
          {page === 'dictionary' && <DictionaryPage />}
          {page === 'progress' && <ProgressPage />}
          {page === 'rating' && <RatingPage />}
          {page === 'settings' && <SettingsPage />}
          {page === 'customize' && <CustomizePage />}
          {page === 'dialogs' && <DialogsPage onNavigate={navigate} />}
          {page === 'exercise' && <ExercisePage onBack={() => setPage(prevPage)} />}
        </main>

        {/* Bottom navigation */}
        {showBottomNav && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-retro-bg border-t-2 border-retro-border">
            <div className="flex">
              {NAV_ITEMS.map(item => {
                const isActive = page === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => setPage(item.page)}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 px-1 transition-all relative
                      ${isActive ? 'text-retro-gold' : 'text-retro-border hover:text-white'}`}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-retro-gold shadow-neon-gold" />
                    )}
                    <Icon name={item.icon} size={18} />
                    <span className="font-pixel text-[6px] leading-none">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </TooltipProvider>
  );
}
