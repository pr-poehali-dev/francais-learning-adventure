import { useState } from 'react';
import Icon from '@/components/ui/icon';

const LANGUAGES = ['Русский', 'English', 'Español', 'Deutsch'];
const DIFFICULTIES = [
  { label: 'Новичок', desc: 'Базовые слова и фразы', emoji: '🌱' },
  { label: 'Средний', desc: 'Грамматика и диалоги', emoji: '⚔️' },
  { label: 'Эксперт', desc: 'Сложные конструкции', emoji: '🔥' },
];

export default function SettingsPage() {
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(15);
  const [difficulty, setDifficulty] = useState(0);
  const [interfaceLang, setInterfaceLang] = useState(0);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 border-2 relative transition-all ${value ? 'border-retro-green bg-retro-green/10' : 'border-retro-border bg-transparent'}`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 transition-all ${value ? 'left-[calc(100%-1.25rem)] bg-retro-green shadow-neon-green' : 'left-0.5 bg-retro-border'}`}
      />
    </button>
  );

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Sound */}
      <div className="pixel-box p-4 space-y-3">
        <p className="font-pixel text-[9px] text-retro-gold">🔊 ЗВУК</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-rubik text-sm text-white">Звуковые эффекты</p>
            <p className="font-pixel text-[7px] text-retro-border">Звуки нажатий и действий</p>
          </div>
          <Toggle value={sound} onChange={() => setSound(!sound)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-rubik text-sm text-white">Фоновая музыка</p>
            <p className="font-pixel text-[7px] text-retro-border">Ретро саундтрек</p>
          </div>
          <Toggle value={music} onChange={() => setMusic(!music)} />
        </div>
      </div>

      {/* Notifications */}
      <div className="pixel-box p-4 space-y-3">
        <p className="font-pixel text-[9px] text-retro-cyan">🔔 УВЕДОМЛЕНИЯ</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-rubik text-sm text-white">Напоминания</p>
            <p className="font-pixel text-[7px] text-retro-border">Ежедневные уведомления</p>
          </div>
          <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />
        </div>
      </div>

      {/* Daily goal */}
      <div className="pixel-box p-4 space-y-3">
        <p className="font-pixel text-[9px] text-retro-pink">⏱️ ЦЕЛЬ В ДЕНЬ</p>
        <div className="flex gap-2">
          {[5, 10, 15, 20, 30].map(min => (
            <button
              key={min}
              onClick={() => setDailyGoal(min)}
              className={`flex-1 py-2 border-2 font-pixel text-[8px] transition-all
                ${dailyGoal === min ? 'border-retro-pink bg-retro-pink/10 text-retro-pink' : 'border-retro-border text-retro-border'}`}
            >
              {min}м
            </button>
          ))}
        </div>
        <p className="font-pixel text-[7px] text-retro-border">Выбрано: {dailyGoal} минут в день</p>
      </div>

      {/* Difficulty */}
      <div className="pixel-box p-4 space-y-3">
        <p className="font-pixel text-[9px] text-retro-gold">⚔️ СЛОЖНОСТЬ</p>
        <div className="space-y-2">
          {DIFFICULTIES.map((d, i) => (
            <button
              key={i}
              onClick={() => setDifficulty(i)}
              className={`w-full flex items-center gap-3 p-3 border-2 transition-all text-left
                ${difficulty === i ? 'border-retro-gold bg-retro-gold/10' : 'border-retro-border hover:border-retro-gold/40'}`}
            >
              <span className="text-xl">{d.emoji}</span>
              <div>
                <p className={`font-russo text-sm ${difficulty === i ? 'text-retro-gold' : 'text-white'}`}>{d.label}</p>
                <p className="font-pixel text-[7px] text-retro-border">{d.desc}</p>
              </div>
              {difficulty === i && <span className="ml-auto font-pixel text-[8px] text-retro-gold">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Interface language */}
      <div className="pixel-box p-4 space-y-3">
        <p className="font-pixel text-[9px] text-retro-purple">🌍 ЯЗЫК ИНТЕРФЕЙСА</p>
        <div className="flex gap-2 flex-wrap">
          {LANGUAGES.map((lang, i) => (
            <button
              key={i}
              onClick={() => setInterfaceLang(i)}
              className={`px-3 py-2 border-2 font-rubik text-sm transition-all
                ${interfaceLang === i ? 'border-retro-purple bg-retro-purple/10 text-retro-purple' : 'border-retro-border text-retro-border'}`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button className="w-full pixel-box p-3 flex items-center justify-center gap-2 border-retro-red text-retro-red hover:bg-retro-red/10 transition-all">
        <Icon name="RotateCcw" size={14} />
        <span className="font-pixel text-[8px]">СБРОСИТЬ ПРОГРЕСС</span>
      </button>

      <div className="pixel-box p-3 text-center">
        <p className="font-pixel text-[7px] text-retro-border">FRANÇAIS QUEST v1.0.0</p>
        <p className="font-pixel text-[6px] text-retro-border/50 mt-1">Поехали! Dev Platform</p>
      </div>
    </div>
  );
}
