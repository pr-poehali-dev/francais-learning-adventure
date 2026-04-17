import { useState } from 'react';
import Icon from '@/components/ui/icon';

const CHARACTERS = [
  {
    id: 1,
    name: 'Профессор Дюпон',
    role: 'Учитель',
    emoji: '👨‍🏫',
    color: 'gold',
    unlocked: true,
    topic: 'Грамматика и базовые фразы',
    level: 1,
  },
  {
    id: 2,
    name: 'Марсель',
    role: 'Официант',
    emoji: '🧑‍🍳',
    color: 'cyan',
    unlocked: true,
    topic: 'В кафе и ресторане',
    level: 3,
  },
  {
    id: 3,
    name: 'Клод',
    role: 'Торговец',
    emoji: '🧑‍🌾',
    color: 'green',
    unlocked: true,
    topic: 'На рынке — еда и числа',
    level: 5,
  },
  {
    id: 4,
    name: 'Принцесса Элен',
    role: 'Аристократка',
    emoji: '👸',
    color: 'pink',
    unlocked: false,
    topic: 'Светские беседы и этикет',
    level: 12,
  },
];

const DEMO_DIALOG = [
  { speaker: 'Марсель', emoji: '🧑‍🍳', text: 'Bonjour! Bienvenue au café. Que désirez-vous?', translation: 'Здравствуйте! Добро пожаловать в кафе. Что желаете?' },
  { speaker: 'Вы', emoji: '⚔️', text: '', isInput: true, options: ['Un café, s\'il vous plaît', 'Je voudrais du thé', 'L\'addition, s\'il vous plaît'] },
  { speaker: 'Марсель', emoji: '🧑‍🍳', text: 'Très bien! Un café pour vous. Un moment...', translation: 'Очень хорошо! Кофе для вас. Одну минуту...' },
];

const COLOR_MAP: Record<string, string> = {
  gold: 'pixel-box-gold',
  cyan: 'pixel-box-cyan',
  green: 'pixel-box-green',
  pink: 'pixel-box-pink',
};

export default function DialogsPage() {
  const [activeDialog, setActiveDialog] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [step, setStep] = useState(0);

  if (activeDialog !== null) {
    const char = CHARACTERS[activeDialog];
    return (
      <div className="p-4 space-y-4 animate-fade-in flex flex-col min-h-[calc(100vh-160px)]">
        <div className="flex items-center gap-3">
          <button onClick={() => { setActiveDialog(null); setStep(0); setSelectedOption(null); }} className="btn-cyan text-[8px] px-3 py-2">
            ← НАЗАД
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">{char.emoji}</span>
            <div>
              <p className="font-russo text-sm text-white">{char.name}</p>
              <p className="font-pixel text-[7px] text-retro-border">{char.role}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {DEMO_DIALOG.slice(0, step + 1).map((msg, i) => {
            if (msg.isInput) {
              return (
                <div key={i} className="space-y-2">
                  <p className="font-pixel text-[8px] text-retro-gold text-right">ВАШ ОТВЕТ:</p>
                  {msg.options?.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => { setSelectedOption(oi); setTimeout(() => setStep(s => Math.min(s + 1, DEMO_DIALOG.length - 1)), 500); }}
                      className={`w-full text-left p-3 border-2 font-rubik text-sm transition-all
                        ${selectedOption === oi ? 'border-retro-gold bg-retro-gold/10 text-retro-gold' : 'border-retro-border text-white hover:border-retro-cyan'}`}
                    >
                      <span className="font-pixel text-[7px] text-retro-border mr-2">{oi + 1}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              );
            }
            return (
              <div key={i} className={`flex gap-2 ${msg.speaker === 'Вы' ? 'flex-row-reverse' : ''}`}>
                <span className="text-2xl shrink-0 mt-1">{msg.emoji}</span>
                <div className={`pixel-box p-3 max-w-[80%] ${msg.speaker === 'Вы' ? 'border-retro-gold' : 'border-retro-cyan'}`}>
                  <p className="font-russo text-sm text-white">{msg.text}</p>
                  {msg.translation && (
                    <p className="font-rubik text-xs text-retro-border mt-1 italic">{msg.translation}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {step === 0 && (
          <button className="btn-gold w-full" onClick={() => setStep(1)}>
            НАЧАТЬ ДИАЛОГ ▶
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="pixel-box p-3 border-l-4 border-retro-cyan">
        <p className="font-pixel text-[8px] text-retro-cyan mb-1">РЕЖИМ ДИАЛОГОВ</p>
        <p className="font-rubik text-sm text-white/80">Практикуй разговорный французский с персонажами — каждый учит тебя новым фразам!</p>
      </div>

      <div className="space-y-3">
        {CHARACTERS.map((char, i) => (
          <div
            key={char.id}
            className={`${COLOR_MAP[char.color]} p-4 ${!char.unlocked ? 'opacity-50' : 'cursor-pointer hover:scale-[1.01] transition-transform'}`}
            onClick={() => char.unlocked && setActiveDialog(i)}
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 border-2 border-current flex items-center justify-center text-3xl shrink-0">
                {char.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-russo text-base text-white">{char.name}</h3>
                  {!char.unlocked && (
                    <div className="flex items-center gap-1">
                      <Icon name="Lock" size={12} className="text-retro-border" />
                      <span className="font-pixel text-[7px] text-retro-border">Lv.{char.level}</span>
                    </div>
                  )}
                </div>
                <p className="font-pixel text-[7px] text-retro-border mt-0.5">{char.role}</p>
                <p className="font-rubik text-xs text-white/70 mt-1">{char.topic}</p>
                {char.unlocked && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-pixel text-[7px] text-retro-green">● ДОСТУПЕН</span>
                    <span className="font-pixel text-[7px] text-retro-border">· Нажми для диалога</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
