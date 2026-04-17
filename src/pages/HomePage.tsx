import Icon from '@/components/ui/icon';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const CHARACTER_IMG = "https://cdn.poehali.dev/projects/637f720e-6965-468d-a1e4-3782ae711427/files/529a7725-8643-4d31-a4b9-d53f945bb776.jpg";

export default function HomePage({ onNavigate }: HomePageProps) {
  const stats = [
    { label: 'HP', value: 72, max: 100, color: 'hp-fill' },
    { label: 'XP', value: 45, max: 100, color: 'xp-fill' },
  ];

  const quickActions = [
    { icon: 'Sword', label: 'Продолжить', sub: 'Урок 12', color: 'btn-gold', page: 'levels' },
    { icon: 'MessageCircle', label: 'Диалог', sub: 'с Марселем', color: 'btn-cyan', page: 'dialogs' },
    { icon: 'BookOpen', label: 'Словарь', sub: '240 слов', color: 'btn-pink', page: 'dictionary' },
  ];

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Hero: Player card */}
      <div className="pixel-box-gold p-4 flex gap-4 items-start">
        <div className="relative shrink-0">
          <div className="w-20 h-20 border-2 border-retro-gold overflow-hidden" style={{ imageRendering: 'pixelated' }}>
            <img src={CHARACTER_IMG} alt="Профессор" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-retro-gold text-retro-bg font-pixel text-[8px] px-1">
            Lv.7
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <p className="font-pixel text-[9px] text-retro-gold">ИГРОК</p>
            <h2 className="font-russo text-lg text-white leading-tight">Искатель слов</h2>
          </div>
          {stats.map(s => (
            <div key={s.label} className="space-y-0.5">
              <div className="flex justify-between items-center">
                <span className="font-pixel text-[8px] text-retro-border">{s.label}</span>
                <span className="font-pixel text-[8px] text-retro-gold">{s.value}/{s.max}</span>
              </div>
              <div className="hp-bar">
                <div className={s.color} style={{ width: `${s.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily quest */}
      <div className="pixel-box p-3 border-l-4 border-retro-cyan">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">⚔️</span>
          <p className="font-pixel text-[9px] neon-text-cyan">ЕЖЕДНЕВНЫЙ КВЕСТ</p>
        </div>
        <p className="font-rubik text-sm text-white">Выучи 10 новых слов на тему «Еда»</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 hp-bar">
            <div className="xp-fill" style={{ width: '60%' }} />
          </div>
          <span className="font-pixel text-[8px] text-retro-gold">6/10</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-2">
        {quickActions.map(a => (
          <button
            key={a.page}
            onClick={() => onNavigate(a.page)}
            className={`${a.color} flex flex-col items-center gap-1 py-3 px-2`}
          >
            <Icon name={a.icon} size={18} />
            <span className="text-[8px] leading-tight">{a.label}</span>
            <span className="text-[7px] opacity-70">{a.sub}</span>
          </button>
        ))}
      </div>

      {/* Achievements */}
      <div className="pixel-box p-3">
        <p className="font-pixel text-[9px] text-retro-gold mb-3">🏆 ДОСТИЖЕНИЯ</p>
        <div className="grid grid-cols-4 gap-2">
          {['🗼', '🥖', '🍷', '🎭'].map((emoji, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-10 h-10 flex items-center justify-center border-2 text-xl ${i < 2 ? 'border-retro-gold bg-retro-gold/10' : 'border-retro-border opacity-40'}`}>
                {emoji}
              </div>
              <span className="font-pixel text-[6px] text-center text-retro-border leading-tight">
                {['Париж', 'Пекарь', 'Сомелье', 'Артист'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* News ticker */}
      <div className="pixel-box p-2 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[8px] neon-text-pink shrink-0">НОВОСТИ:</span>
          <p className="font-rubik text-xs text-white/70 truncate">
            Новый персонаж «Шеф Анри» разблокирован на уровне 15! Попробуй завтра's challenge!
          </p>
        </div>
      </div>
    </div>
  );
}
