import Icon from '@/components/ui/icon';

const WEEKLY = [
  { day: 'Пн', xp: 45, words: 8 },
  { day: 'Вт', xp: 80, words: 14 },
  { day: 'Ср', xp: 30, words: 5 },
  { day: 'Чт', xp: 95, words: 18 },
  { day: 'Пт', xp: 60, words: 11 },
  { day: 'Сб', xp: 110, words: 22 },
  { day: 'Вс', xp: 50, words: 9 },
];

const MAX_XP = 120;

const SKILLS = [
  { name: 'Чтение', level: 7, progress: 65, emoji: '📖', color: 'xp-fill' },
  { name: 'Письмо', level: 5, progress: 42, emoji: '✍️', color: 'xp-fill' },
  { name: 'Говорение', level: 4, progress: 30, emoji: '🗣️', color: 'hp-fill' },
  { name: 'Слушание', level: 6, progress: 58, emoji: '👂', color: 'hp-fill' },
  { name: 'Грамматика', level: 3, progress: 20, emoji: '📝', color: 'xp-fill' },
];

const STREAKS = [
  { label: 'Текущая серия', value: '7 дней', emoji: '🔥', glow: 'neon-text-gold' },
  { label: 'Рекорд', value: '21 день', emoji: '⚡', glow: 'neon-text-cyan' },
  { label: 'Всего XP', value: '3 420', emoji: '💎', glow: 'neon-text-pink' },
];

export default function ProgressPage() {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Streak cards */}
      <div className="grid grid-cols-3 gap-2">
        {STREAKS.map((s, i) => (
          <div key={i} className="pixel-box p-3 text-center">
            <div className="text-2xl mb-1">{s.emoji}</div>
            <p className={`font-pixel text-[9px] ${s.glow}`}>{s.value}</p>
            <p className="font-pixel text-[6px] text-retro-border mt-1 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="pixel-box p-4">
        <p className="font-pixel text-[9px] text-retro-gold mb-4">📊 АКТИВНОСТЬ ЗА НЕДЕЛЮ</p>
        <div className="flex items-end justify-between gap-1 h-24">
          {WEEKLY.map((d, i) => {
            const height = Math.round((d.xp / MAX_XP) * 100);
            const isToday = i === 5;
            return (
              <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                  <div
                    className="w-full transition-all"
                    style={{
                      height: `${height}%`,
                      background: isToday
                        ? 'linear-gradient(0deg, #ffd700, #ff8c00)'
                        : 'linear-gradient(0deg, #00ffff44, #00ffff88)',
                      boxShadow: isToday ? '0 0 8px #ffd700' : '0 0 4px #00ffff44',
                      border: `1px solid ${isToday ? '#ffd700' : '#00ffff44'}`,
                    }}
                  />
                </div>
                <span className={`font-pixel text-[6px] ${isToday ? 'text-retro-gold' : 'text-retro-border'}`}>{d.day}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-pixel text-[7px] text-retro-border">Всего за неделю:</span>
          <span className="font-pixel text-[7px] text-retro-gold">470 XP</span>
        </div>
      </div>

      {/* Skills */}
      <div className="pixel-box p-4">
        <p className="font-pixel text-[9px] text-retro-gold mb-3">⚔️ НАВЫКИ</p>
        <div className="space-y-3">
          {SKILLS.map((skill, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{skill.emoji}</span>
                  <span className="font-rubik text-sm text-white">{skill.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[7px] text-retro-border">{skill.progress}%</span>
                  <div className="bg-retro-gold text-retro-bg font-pixel text-[7px] px-1.5 py-0.5">
                    Lv.{skill.level}
                  </div>
                </div>
              </div>
              <div className="hp-bar">
                <div className={skill.color} style={{ width: `${skill.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Level progress */}
      <div className="pixel-box-gold p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-pixel text-[9px] text-retro-gold">УРОВЕНЬ 7</p>
          <p className="font-pixel text-[9px] text-retro-gold">→ УРОВЕНЬ 8</p>
        </div>
        <div className="hp-bar">
          <div className="xp-fill" style={{ width: '45%' }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-pixel text-[7px] text-retro-border">1 350 / 3 000 XP</span>
          <span className="font-pixel text-[7px] text-retro-gold">ещё 1 650 XP</span>
        </div>
      </div>
    </div>
  );
}
