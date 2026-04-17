import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface LevelsPageProps {
  onNavigate: (page: string) => void;
}

const WORLDS = [
  {
    id: 1,
    name: 'Парижское кафе',
    emoji: '☕',
    color: 'gold',
    unlocked: true,
    levels: [
      { id: 1, name: 'Приветствия', type: 'words', stars: 3, completed: true },
      { id: 2, name: 'Цифры', type: 'quiz', stars: 2, completed: true },
      { id: 3, name: 'Меню', type: 'dialog', stars: 1, completed: true },
      { id: 4, name: 'Заказ', type: 'dialog', stars: 0, completed: false, current: true },
      { id: 5, name: 'Счёт', type: 'words', stars: 0, completed: false },
    ]
  },
  {
    id: 2,
    name: 'Рынок Прованса',
    emoji: '🌿',
    color: 'cyan',
    unlocked: true,
    levels: [
      { id: 6, name: 'Фрукты', type: 'words', stars: 0, completed: false },
      { id: 7, name: 'Овощи', type: 'quiz', stars: 0, completed: false },
      { id: 8, name: 'Торговля', type: 'dialog', stars: 0, completed: false },
    ]
  },
  {
    id: 3,
    name: 'Версаль',
    emoji: '👑',
    color: 'pink',
    unlocked: false,
    levels: [
      { id: 9, name: 'История', type: 'words', stars: 0, completed: false },
      { id: 10, name: 'Этикет', type: 'dialog', stars: 0, completed: false },
    ]
  },
];

const TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  words: { label: 'Слова', emoji: '📖' },
  quiz: { label: 'Тест', emoji: '❓' },
  dialog: { label: 'Диалог', emoji: '💬' },
};

const COLOR_CLASSES: Record<string, string> = {
  gold: 'pixel-box-gold',
  cyan: 'pixel-box-cyan',
  pink: 'pixel-box-pink',
};

export default function LevelsPage({ onNavigate }: LevelsPageProps) {
  const [selectedWorld, setSelectedWorld] = useState(0);
  const world = WORLDS[selectedWorld];

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-pixel text-[9px] neon-text-gold">ВЫБЕРИ МИР</span>
      </div>

      {/* World selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {WORLDS.map((w, i) => (
          <button
            key={w.id}
            onClick={() => w.unlocked && setSelectedWorld(i)}
            className={`shrink-0 pixel-box p-3 flex flex-col items-center gap-1 min-w-[80px] transition-all
              ${selectedWorld === i ? COLOR_CLASSES[w.color] : ''}
              ${!w.unlocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="text-2xl">{w.emoji}</span>
            <span className="font-pixel text-[7px] text-center leading-tight text-white">{w.name}</span>
            {!w.unlocked && <Icon name="Lock" size={12} className="text-retro-border" />}
          </button>
        ))}
      </div>

      {/* Levels map */}
      <div className={`${COLOR_CLASSES[world.color]} p-4`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{world.emoji}</span>
          <div>
            <p className="font-pixel text-[8px] text-retro-border">МИР {world.id}</p>
            <h3 className="font-russo text-base text-white">{world.name}</h3>
          </div>
        </div>

        <div className="space-y-2">
          {world.levels.map((level, idx) => (
            <div key={level.id} className="relative">
              {idx < world.levels.length - 1 && (
                <div className="absolute left-5 top-full w-0.5 h-2 bg-retro-border z-0" />
              )}
              <div
                className={`relative z-10 flex items-center gap-3 p-3 border-2 transition-all cursor-pointer
                  ${level.current ? 'border-retro-gold bg-retro-gold/10 animate-glow-pulse' : ''}
                  ${level.completed ? 'border-retro-green/50 bg-retro-green/5' : ''}
                  ${!level.completed && !level.current ? 'border-retro-border opacity-60' : ''}`}
                onClick={() => level.completed || level.current ? onNavigate('exercise') : null}
              >
                <div className={`w-10 h-10 flex items-center justify-center border-2 font-pixel text-sm shrink-0
                  ${level.completed ? 'border-retro-green text-retro-green' : ''}
                  ${level.current ? 'border-retro-gold text-retro-gold' : ''}
                  ${!level.completed && !level.current ? 'border-retro-border text-retro-border' : ''}`}>
                  {level.completed ? '✓' : level.current ? '▶' : level.id}
                </div>
                <div className="flex-1">
                  <p className="font-rubik text-sm text-white font-medium">{level.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-pixel text-[7px] text-retro-border">{TYPE_LABELS[level.type].emoji} {TYPE_LABELS[level.type].label}</span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map(s => (
                    <span key={s} className={`text-sm ${level.stars >= s ? 'neon-text-gold' : 'text-retro-border'}`}>★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
