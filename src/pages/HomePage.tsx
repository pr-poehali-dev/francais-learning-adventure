import Icon from '@/components/ui/icon';
import { useGame, FRAME_COLORS } from '@/lib/gameContext';

const AVATARS = ['⚔️', '🧙', '🏹', '🛡️', '🦊', '🐺', '🦁', '🐯', '🧝', '🧛', '🐉', '🦄'];

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { player } = useGame();

  const frameColor = FRAME_COLORS[player.equippedFrame] ?? '#ffd700';
  const hat = player.equippedHat ? player.shop.find(i => i.id === player.equippedHat) : null;
  const weapon = player.equippedWeapon ? player.shop.find(i => i.id === player.equippedWeapon) : null;
  const pet = player.equippedPet ? player.shop.find(i => i.id === player.equippedPet) : null;

  const xpPercent = Math.round((player.xp / player.xpToNext) * 100);

  const quickActions = [
    { icon: 'Sword', label: 'Уровни', sub: 'Играть', color: 'btn-gold', page: 'levels' },
    { icon: 'MessageCircle', label: 'Диалоги', sub: 'Говорить', color: 'btn-cyan', page: 'dialogs' },
    { icon: 'ShoppingBag', label: 'Магазин', sub: `${player.coins} 🪙`, color: 'btn-pink', page: 'shop' },
  ];

  const isNewPlayer = player.totalCorrect === 0;

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Player card */}
      <div className="pixel-box p-4 flex gap-4 items-start" style={{ borderColor: frameColor, boxShadow: `4px 4px 0 ${frameColor}66` }}>
        <div className="relative shrink-0">
          <div
            className="w-20 h-20 flex items-center justify-center text-4xl border-4 relative"
            style={{ borderColor: frameColor, boxShadow: `0 0 15px ${frameColor}55` }}
          >
            {AVATARS[player.avatar]}
            {hat && <span className="absolute -top-3 text-xl">{hat.emoji}</span>}
            {pet && <span className="absolute -right-3 bottom-0 text-lg">{pet.emoji}</span>}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-retro-gold text-retro-bg font-pixel text-[7px] px-1.5 py-0.5">
            Lv.{player.level}
          </div>
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <div>
              <p className="font-pixel text-[8px] text-retro-gold">ИГРОК</p>
              <h2 className="font-russo text-base text-white leading-tight">
                {weapon ? `${weapon.emoji} ` : ''}Искатель слов
              </h2>
            </div>
            <div className="pixel-box px-2 py-1 text-center shrink-0">
              <p className="font-pixel text-[9px] text-retro-gold">{player.coins}</p>
              <p className="font-pixel text-[6px] text-retro-border">🪙</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="font-pixel text-[7px] text-retro-border">XP</span>
              <span className="font-pixel text-[7px] text-retro-gold">{player.xp} / {player.xpToNext}</span>
            </div>
            <div className="hp-bar">
              <div className="xp-fill" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* New player welcome */}
      {isNewPlayer && (
        <div className="pixel-box-cyan p-4 text-center space-y-3 animate-scale-in">
          <p className="text-3xl animate-float">🗼</p>
          <p className="font-pixel text-[9px] text-retro-cyan">ДОБРО ПОЖАЛОВАТЬ!</p>
          <p className="font-rubik text-sm text-white/80">Начни своё путешествие в мир французского языка. Выполняй упражнения — получай XP и монеты!</p>
          <button onClick={() => onNavigate('levels')} className="btn-gold w-full">
            НАЧАТЬ ПРИКЛЮЧЕНИЕ ▶
          </button>
        </div>
      )}

      {/* Daily quest */}
      {!isNewPlayer && (
        <div className="pixel-box p-3 border-l-4 border-retro-cyan">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚔️</span>
            <p className="font-pixel text-[9px] neon-text-cyan">ЕЖЕДНЕВНЫЙ КВЕСТ</p>
          </div>
          <p className="font-rubik text-sm text-white">Ответь правильно на 10 вопросов</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 hp-bar">
              <div className="xp-fill" style={{ width: `${Math.min((player.totalCorrect % 10) * 10, 100)}%` }} />
            </div>
            <span className="font-pixel text-[8px] text-retro-gold">{player.totalCorrect % 10}/10</span>
          </div>
        </div>
      )}

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
            <span className="text-[7px] opacity-80">{a.sub}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="pixel-box p-2 text-center">
          <p className="font-pixel text-[10px] text-retro-gold">{player.level}</p>
          <p className="font-pixel text-[6px] text-retro-border mt-1">УРОВЕНЬ</p>
        </div>
        <div className="pixel-box p-2 text-center">
          <p className="font-pixel text-[10px] text-retro-green">{player.totalCorrect}</p>
          <p className="font-pixel text-[6px] text-retro-border mt-1">ВЕРНЫХ</p>
        </div>
        <div className="pixel-box p-2 text-center">
          <p className="font-pixel text-[10px] text-retro-cyan">{player.streak}</p>
          <p className="font-pixel text-[6px] text-retro-border mt-1">🔥 СЕРИЯ</p>
        </div>
      </div>

      {/* Hint */}
      <div className="pixel-box p-3 flex items-center gap-3">
        <span className="text-xl">💡</span>
        <p className="font-rubik text-xs text-white/70">
          За каждый верный ответ: <span className="text-retro-gold font-medium">+25 XP</span> и <span className="text-retro-gold font-medium">+5 🪙</span>. Трать монеты в магазине на одежду!
        </p>
      </div>
    </div>
  );
}
