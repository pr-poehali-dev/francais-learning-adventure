import { useState } from 'react';
import Icon from '@/components/ui/icon';

type ExerciseType = 'translate' | 'fill' | 'match' | 'listen' | 'order';

interface Exercise {
  type: ExerciseType;
  question: string;
  hint?: string;
  options?: string[];
  correct: string | number;
  pairs?: { fr: string; ru: string }[];
}

const EXERCISES: Exercise[] = [
  {
    type: 'translate',
    question: 'Как переводится слово «maison»?',
    hint: 'Подсказка: место где живут',
    options: ['Машина', 'Дом', 'Магазин', 'Школа'],
    correct: 1,
  },
  {
    type: 'fill',
    question: 'Je ___ français. (изучаю)',
    options: ['mange', 'apprends', 'parle', 'lis'],
    correct: 1,
  },
  {
    type: 'match',
    question: 'Соедини слова:',
    pairs: [
      { fr: 'chat', ru: 'кот' },
      { fr: 'chien', ru: 'собака' },
      { fr: 'oiseau', ru: 'птица' },
    ],
    correct: 0,
  },
  {
    type: 'order',
    question: 'Составь фразу: «Я хочу кофе»',
    options: ['veux', 'Je', 'café', 'un'],
    correct: 'Je veux un café',
  },
];

export default function ExercisePage({ onBack }: { onBack: () => void }) {
  const [currentEx, setCurrentEx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wordOrder, setWordOrder] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const ex = EXERCISES[currentEx];
  const progress = ((currentEx) / EXERCISES.length) * 100;

  function checkAnswer(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === ex.correct) setCorrect(c => c + 1);
  }

  function nextEx() {
    if (currentEx >= EXERCISES.length - 1) {
      setFinished(true);
      return;
    }
    setCurrentEx(e => e + 1);
    setSelected(null);
    setAnswered(false);
    setWordOrder([]);
  }

  function addWord(word: string) {
    setWordOrder(w => [...w, word]);
  }

  function removeWord(i: number) {
    setWordOrder(w => w.filter((_, idx) => idx !== i));
  }

  if (finished) {
    const stars = correct >= 4 ? 3 : correct >= 2 ? 2 : 1;
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-160px)] space-y-4 animate-scale-in">
        <div className="pixel-box-gold p-8 text-center space-y-4">
          <p className="text-5xl animate-float">🏆</p>
          <p className="font-pixel text-[9px] text-retro-gold">УРОК ЗАВЕРШЁН!</p>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3].map(s => (
              <span key={s} className={`text-3xl ${s <= stars ? 'neon-text-gold' : 'text-retro-border'}`}>★</span>
            ))}
          </div>
          <p className="font-rubik text-white">Правильно: {correct}/{EXERCISES.length}</p>
          <p className="font-pixel text-[8px] text-retro-gold">+{correct * 25} XP</p>
        </div>
        <button className="btn-gold w-full" onClick={onBack}>← ВЕРНУТЬСЯ К УРОВНЯМ</button>
        <button className="btn-cyan w-full" onClick={() => { setCurrentEx(0); setCorrect(0); setFinished(false); setAnswered(false); setSelected(null); }}>
          🔄 ПОВТОРИТЬ
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="btn-cyan text-[8px] px-3 py-2">←</button>
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="font-pixel text-[7px] text-retro-border">Вопрос {currentEx + 1}/{EXERCISES.length}</span>
            <span className="font-pixel text-[7px] text-retro-gold">{correct} ✓</span>
          </div>
          <div className="hp-bar">
            <div className="xp-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="pixel-box-gold p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[8px] text-retro-border uppercase">
            {{ translate: '📖 Перевод', fill: '✍️ Заполни', match: '🔗 Сопоставь', order: '🔀 Составь', listen: '👂 Слушай' }[ex.type]}
          </span>
        </div>
        <p className="font-russo text-base text-white">{ex.question}</p>
        {ex.hint && <p className="font-rubik text-xs text-retro-border italic">{ex.hint}</p>}
      </div>

      {/* Answer area */}
      {(ex.type === 'translate' || ex.type === 'fill') && ex.options && (
        <div className="grid grid-cols-2 gap-2">
          {ex.options.map((opt, i) => {
            let cls = 'border-retro-border text-white';
            if (answered) {
              if (i === ex.correct) cls = 'border-retro-green bg-retro-green/10 text-retro-green';
              else if (i === selected) cls = 'border-retro-red bg-retro-red/10 text-retro-red';
              else cls = 'border-retro-border text-retro-border opacity-50';
            } else if (selected === i) {
              cls = 'border-retro-gold bg-retro-gold/10 text-retro-gold';
            }
            return (
              <button
                key={i}
                onClick={() => checkAnswer(i)}
                className={`p-3 border-2 font-rubik text-sm text-left transition-all ${cls}`}
              >
                <span className="font-pixel text-[7px] opacity-60 mr-2">{i + 1}.</span>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {ex.type === 'order' && ex.options && (
        <div className="space-y-3">
          <div className="pixel-box p-3 min-h-12 flex flex-wrap gap-2">
            {wordOrder.length === 0 ? (
              <p className="font-pixel text-[7px] text-retro-border self-center">Нажми на слова ниже...</p>
            ) : wordOrder.map((w, i) => (
              <button key={i} onClick={() => removeWord(i)} className="btn-gold text-[8px] px-2 py-1">
                {w}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {ex.options.filter(w => !wordOrder.includes(w)).map((w, i) => (
              <button key={i} onClick={() => addWord(w)} className="btn-cyan text-[8px] px-3 py-2">
                {w}
              </button>
            ))}
          </div>
          {wordOrder.length === ex.options.length && !answered && (
            <button
              className="btn-gold w-full"
              onClick={() => {
                const result = wordOrder.join(' ');
                setAnswered(true);
                if (result === ex.correct) setCorrect(c => c + 1);
              }}
            >
              ПРОВЕРИТЬ ✓
            </button>
          )}
          {answered && (
            <div className={`pixel-box p-3 border-2 ${wordOrder.join(' ') === ex.correct ? 'border-retro-green text-retro-green' : 'border-retro-red text-retro-red'}`}>
              <p className="font-pixel text-[8px]">{wordOrder.join(' ') === ex.correct ? '✓ ВЕРНО!' : `✗ Правильно: ${ex.correct}`}</p>
            </div>
          )}
        </div>
      )}

      {answered && (
        <button className="btn-gold w-full animate-fade-in" onClick={nextEx}>
          {currentEx >= EXERCISES.length - 1 ? 'ЗАВЕРШИТЬ 🏆' : 'ДАЛЕЕ →'}
        </button>
      )}
    </div>
  );
}
