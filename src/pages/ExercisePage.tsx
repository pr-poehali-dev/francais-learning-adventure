import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

type ExerciseType = 'translate' | 'fill' | 'order' | 'match' | 'guess' | 'listen' | 'picture' | 'spelling';

interface MatchPair {
  fr: string;
  ru: string;
}

interface Exercise {
  type: ExerciseType;
  question: string;
  hint?: string;
  options?: string[];
  correct: string | number;
  pairs?: MatchPair[];
  word?: string;
  pictures?: { emoji: string; label: string }[];
  audio?: string;
}

const EXERCISES: Exercise[] = [
  {
    type: 'translate',
    question: 'Как переводится слово «maison»?',
    hint: 'Место, где живут люди',
    options: ['Машина', 'Дом', 'Магазин', 'Школа'],
    correct: 1,
  },
  {
    type: 'picture',
    question: 'Выбери картинку, которая соответствует слову «chat»',
    pictures: [
      { emoji: '🐶', label: 'chien' },
      { emoji: '🐱', label: 'chat' },
      { emoji: '🐟', label: 'poisson' },
      { emoji: '🐦', label: 'oiseau' },
    ],
    correct: 1,
  },
  {
    type: 'fill',
    question: 'Je ___ français. (изучаю)',
    options: ['mange', 'apprends', 'parle', 'lis'],
    correct: 1,
  },
  {
    type: 'guess',
    question: 'Угадай слово по подсказкам',
    hint: '🥖 Французская выпечка, длинная и хрустящая',
    word: 'BAGUETTE',
    correct: 'BAGUETTE',
  },
  {
    type: 'order',
    question: 'Составь фразу: «Я хочу кофе»',
    options: ['veux', 'Je', 'café', 'un'],
    correct: 'Je veux un café',
  },
  {
    type: 'match',
    question: 'Соедини французские слова с переводом',
    pairs: [
      { fr: 'chat', ru: '🐱 кот' },
      { fr: 'chien', ru: '🐶 собака' },
      { fr: 'oiseau', ru: '🐦 птица' },
    ],
    correct: 0,
  },
  {
    type: 'listen',
    question: 'Послушай слово и выбери правильный перевод',
    hint: 'bonjour',
    options: ['До свидания', 'Спасибо', 'Здравствуйте', 'Пожалуйста'],
    correct: 2,
  },
  {
    type: 'spelling',
    question: 'Напиши по-французски: «спасибо»',
    hint: 'Начинается на M...',
    correct: 'merci',
    options: ['m', 'e', 'r', 'c', 'i', 'a', 'o', 'u'],
  },
];

const TYPE_LABELS: Record<ExerciseType, string> = {
  translate: '📖 Перевод',
  fill: '✍️ Заполни пропуск',
  order: '🔀 Составь фразу',
  match: '🔗 Сопоставь пары',
  guess: '🔮 Угадай слово',
  listen: '👂 Аудирование',
  picture: '🖼️ Выбери картинку',
  spelling: '⌨️ Напиши слово',
};

// Guess-the-word component
function GuessExercise({ word, onResult }: { word: string; onResult: (ok: boolean) => void }) {
  const [revealed, setRevealed] = useState<boolean[]>(Array(word.length).fill(false));
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const alphabet = 'ABCDEFGHIJKLMNOPRSTUVWYÉÈÊÀÂÙÇ'.split('');
  const guessed = new Set(revealed.map((r, i) => r ? word[i] : ''));
  const wrongLetters: string[] = [];

  function guess(letter: string) {
    if (done) return;
    if (word.includes(letter)) {
      const next = revealed.map((r, i) => r || word[i] === letter);
      setRevealed(next);
      if (next.every(Boolean)) {
        setDone(true);
        setIsCorrect(true);
        onResult(true);
      }
    } else {
      const newWrong = wrong + 1;
      setWrong(newWrong);
      wrongLetters.push(letter);
      if (newWrong >= 6) {
        setDone(true);
        setIsCorrect(false);
        onResult(false);
      }
    }
  }

  const usedLetters = new Set<string>();
  alphabet.forEach(l => {
    if (guessed.has(l) || wrongLetters.includes(l)) usedLetters.add(l);
  });

  const hangmanParts = ['😵', '💀', '👻', '☠️', '🩸', '⚰️'];

  return (
    <div className="space-y-4">
      {/* Hangman lives */}
      <div className="flex items-center gap-2">
        <span className="font-pixel text-[7px] text-retro-border">ПОПЫТКИ:</span>
        <div className="flex gap-1">
          {Array(6).fill(0).map((_, i) => (
            <span key={i} className={`text-lg ${i < 6 - wrong ? 'opacity-100' : 'opacity-20'}`}>❤️</span>
          ))}
        </div>
        {wrong > 0 && <span className="text-xl">{hangmanParts[wrong - 1]}</span>}
      </div>

      {/* Word display */}
      <div className="flex gap-2 flex-wrap justify-center">
        {word.split('').map((letter, i) => (
          <div key={i} className={`w-8 h-10 border-b-2 flex items-end justify-center pb-1 transition-all
            ${revealed[i] ? 'border-retro-gold' : 'border-retro-border'}`}>
            {revealed[i] ? (
              <span className="font-pixel text-sm text-retro-gold">{letter}</span>
            ) : (
              <span className="font-pixel text-sm text-transparent">_</span>
            )}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      {!done && (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {'ABCDEFGHIJKLMNOPRSTUVWY'.split('').map(letter => {
            const inWord = word.includes(letter) && revealed[word.indexOf(letter)];
            const missed = !word.includes(letter) && usedLetters.has(letter);
            return (
              <button
                key={letter}
                onClick={() => !usedLetters.has(letter) && guess(letter)}
                disabled={usedLetters.has(letter)}
                className={`w-8 h-8 border font-pixel text-[8px] transition-all
                  ${inWord ? 'border-retro-green bg-retro-green/20 text-retro-green' : ''}
                  ${missed ? 'border-retro-border/30 text-retro-border/30' : ''}
                  ${!usedLetters.has(letter) ? 'border-retro-border text-white hover:border-retro-gold hover:text-retro-gold' : ''}`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      )}

      {done && (
        <div className={`pixel-box p-3 border-2 text-center ${isCorrect ? 'border-retro-green text-retro-green' : 'border-retro-red text-retro-red'}`}>
          <p className="font-pixel text-[9px]">{isCorrect ? '✓ ОТЛИЧНО!' : `✗ Слово: ${word}`}</p>
        </div>
      )}
    </div>
  );
}

// Match pairs component
function MatchExercise({ pairs, onResult }: { pairs: MatchPair[]; onResult: (ok: boolean) => void }) {
  const [selectedFr, setSelectedFr] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const ruOrder = useRef([...pairs].map((_, i) => i).sort(() => Math.random() - 0.5));

  function selectFr(i: number) {
    if (matched.includes(i)) return;
    setSelectedFr(i);
  }

  function selectRu(ruIdx: number) {
    const frIdx = ruOrder.current[ruIdx];
    if (selectedFr === null) return;
    if (frIdx === selectedFr) {
      const next = [...matched, selectedFr];
      setMatched(next);
      setSelectedFr(null);
      setWrong(null);
      if (next.length === pairs.length) onResult(true);
    } else {
      setWrong(ruIdx);
      setTimeout(() => { setWrong(null); setSelectedFr(null); }, 700);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <p className="font-pixel text-[7px] text-retro-cyan text-center mb-2">ФРАНЦУЗСКИЙ</p>
        {pairs.map((p, i) => (
          <button
            key={i}
            onClick={() => !matched.includes(i) && selectFr(i)}
            className={`w-full p-3 border-2 font-russo text-sm transition-all text-left
              ${matched.includes(i) ? 'border-retro-green bg-retro-green/10 text-retro-green opacity-60' : ''}
              ${selectedFr === i ? 'border-retro-gold bg-retro-gold/10 text-retro-gold' : ''}
              ${!matched.includes(i) && selectedFr !== i ? 'border-retro-border text-white hover:border-retro-cyan' : ''}`}
          >
            {p.fr}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <p className="font-pixel text-[7px] text-retro-pink text-center mb-2">РУССКИЙ</p>
        {ruOrder.current.map((origIdx, ruIdx) => (
          <button
            key={ruIdx}
            onClick={() => !matched.includes(origIdx) && selectRu(ruIdx)}
            className={`w-full p-3 border-2 font-rubik text-sm transition-all text-left
              ${matched.includes(origIdx) ? 'border-retro-green bg-retro-green/10 text-retro-green opacity-60' : ''}
              ${wrong === ruIdx ? 'border-retro-red bg-retro-red/10 text-retro-red' : ''}
              ${!matched.includes(origIdx) && wrong !== ruIdx ? 'border-retro-border text-white hover:border-retro-pink' : ''}`}
          >
            {pairs[origIdx].ru}
          </button>
        ))}
      </div>
    </div>
  );
}

// Spelling component
function SpellingExercise({ correct, letters, onResult }: { correct: string; letters: string[]; onResult: (ok: boolean) => void }) {
  const [typed, setTyped] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function addLetter(l: string) {
    if (done || typed.length >= correct.length) return;
    setTyped(t => [...t, l]);
  }

  function remove() {
    setTyped(t => t.slice(0, -1));
  }

  function check() {
    const result = typed.join('').toLowerCase() === correct.toLowerCase();
    setDone(true);
    setIsCorrect(result);
    onResult(result);
  }

  return (
    <div className="space-y-4">
      {/* Answer display */}
      <div className="pixel-box p-3 min-h-12 flex items-center gap-1 flex-wrap">
        {Array(correct.length).fill(0).map((_, i) => (
          <div key={i} className={`w-8 h-10 border-b-2 flex items-end justify-center pb-1
            ${typed[i] ? 'border-retro-gold' : 'border-retro-border'}`}>
            <span className="font-pixel text-sm text-retro-gold">{typed[i] || ''}</span>
          </div>
        ))}
      </div>

      {/* Letter buttons */}
      {!done && (
        <>
          <div className="flex flex-wrap gap-2 justify-center">
            {letters.map((l, i) => (
              <button
                key={i}
                onClick={() => addLetter(l)}
                className="w-10 h-10 border-2 border-retro-border text-white font-pixel text-sm hover:border-retro-gold hover:text-retro-gold transition-all"
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={remove} className="btn-pink flex-1 text-[8px]">⌫ УДАЛИТЬ</button>
            {typed.length === correct.length && (
              <button onClick={check} className="btn-gold flex-1 text-[8px]">ПРОВЕРИТЬ ✓</button>
            )}
          </div>
        </>
      )}

      {done && (
        <div className={`pixel-box p-3 border-2 ${isCorrect ? 'border-retro-green text-retro-green' : 'border-retro-red text-retro-red'}`}>
          <p className="font-pixel text-[8px]">{isCorrect ? '✓ ПРАВИЛЬНО!' : `✗ Правильно: ${correct}`}</p>
        </div>
      )}
    </div>
  );
}

// Listen exercise component
function ListenExercise({ word, options, correct, onResult }: { word: string; options: string[]; correct: number; onResult: (ok: boolean) => void }) {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  function speak() {
    if (!window.speechSynthesis) return;
    setPlaying(true);
    const utt = new SpeechSynthesisUtterance(word);
    utt.lang = 'fr-FR';
    utt.rate = 0.8;
    utt.onend = () => { setPlaying(false); setPlayed(true); };
    window.speechSynthesis.speak(utt);
  }

  function choose(i: number) {
    if (answered || !played) return;
    setSelected(i);
    setAnswered(true);
    onResult(i === correct);
  }

  return (
    <div className="space-y-4">
      <button
        onClick={speak}
        className={`w-full p-6 border-2 flex flex-col items-center gap-3 transition-all
          ${playing ? 'border-retro-cyan bg-retro-cyan/10 animate-pulse' : 'border-retro-border hover:border-retro-cyan'}`}
      >
        <span className="text-4xl">{playing ? '🔊' : '▶️'}</span>
        <span className="font-pixel text-[8px] text-retro-cyan">{playing ? 'ВОСПРОИЗВЕДЕНИЕ...' : 'НАЖМИ ЧТОБЫ СЛУШАТЬ'}</span>
      </button>

      {!played && (
        <p className="font-pixel text-[7px] text-retro-border text-center">Сначала послушай слово</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt, i) => {
          let cls = played ? 'border-retro-border text-white hover:border-retro-gold' : 'border-retro-border/30 text-retro-border/30 cursor-not-allowed';
          if (answered) {
            if (i === correct) cls = 'border-retro-green bg-retro-green/10 text-retro-green';
            else if (i === selected) cls = 'border-retro-red bg-retro-red/10 text-retro-red';
            else cls = 'border-retro-border text-retro-border opacity-40';
          }
          return (
            <button key={i} onClick={() => choose(i)} className={`p-3 border-2 font-rubik text-sm text-left transition-all ${cls}`}>
              <span className="font-pixel text-[7px] opacity-60 mr-2">{i + 1}.</span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ExercisePage({ onBack }: { onBack: () => void }) {
  const [currentEx, setCurrentEx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wordOrder, setWordOrder] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const ex = EXERCISES[currentEx];
  const progress = (currentEx / EXERCISES.length) * 100;

  function showFeedback(ok: boolean) {
    setFeedback(ok ? 'correct' : 'wrong');
    if (ok) setCorrect(c => c + 1);
    setAnswered(true);
  }

  function checkAnswer(idx: number) {
    if (answered) return;
    setSelected(idx);
    showFeedback(idx === ex.correct);
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
    setFeedback(null);
  }

  function addWord(word: string) {
    setWordOrder(w => [...w, word]);
  }

  function removeWord(i: number) {
    setWordOrder(w => w.filter((_, idx) => idx !== i));
  }

  if (finished) {
    const stars = correct >= EXERCISES.length ? 3 : correct >= Math.ceil(EXERCISES.length * 0.6) ? 2 : 1;
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-160px)] space-y-4 animate-scale-in">
        <div className="pixel-box-gold p-8 text-center space-y-4 w-full">
          <p className="text-5xl animate-float">🏆</p>
          <p className="font-pixel text-[9px] text-retro-gold">УРОК ЗАВЕРШЁН!</p>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3].map(s => (
              <span key={s} className={`text-3xl ${s <= stars ? 'neon-text-gold' : 'text-retro-border'}`}>★</span>
            ))}
          </div>
          <p className="font-rubik text-white">Правильно: {correct}/{EXERCISES.length}</p>
          <p className="font-pixel text-[8px] text-retro-gold">+{correct * 25} XP получено!</p>
        </div>
        <button className="btn-gold w-full" onClick={onBack}>← ВЕРНУТЬСЯ К УРОВНЯМ</button>
        <button
          className="btn-cyan w-full"
          onClick={() => {
            setCurrentEx(0); setCorrect(0); setFinished(false);
            setAnswered(false); setSelected(null); setFeedback(null); setWordOrder([]);
          }}
        >
          🔄 ПОВТОРИТЬ
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="btn-cyan text-[8px] px-3 py-2">←</button>
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="font-pixel text-[7px] text-retro-border">
              {currentEx + 1}/{EXERCISES.length}
            </span>
            <span className="font-pixel text-[7px] text-retro-gold">{correct} ✓</span>
          </div>
          <div className="hp-bar">
            <div className="xp-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Exercise type badge + question */}
      <div className="pixel-box-gold p-4 space-y-2">
        <span className="font-pixel text-[8px] text-retro-border">{TYPE_LABELS[ex.type]}</span>
        <p className="font-russo text-base text-white leading-snug">{ex.question}</p>
        {ex.hint && ex.type !== 'guess' && (
          <p className="font-rubik text-xs text-retro-border italic">{ex.hint}</p>
        )}
      </div>

      {/* === Exercise types === */}

      {(ex.type === 'translate' || ex.type === 'fill') && ex.options && (
        <div className="grid grid-cols-2 gap-2">
          {ex.options.map((opt, i) => {
            let cls = 'border-retro-border text-white hover:border-retro-gold';
            if (answered) {
              if (i === ex.correct) cls = 'border-retro-green bg-retro-green/10 text-retro-green';
              else if (i === selected) cls = 'border-retro-red bg-retro-red/10 text-retro-red';
              else cls = 'border-retro-border text-retro-border opacity-40';
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

      {ex.type === 'picture' && ex.pictures && (
        <div className="grid grid-cols-2 gap-3">
          {ex.pictures.map((pic, i) => {
            let cls = 'border-retro-border hover:border-retro-gold';
            if (answered) {
              if (i === ex.correct) cls = 'border-retro-green bg-retro-green/10';
              else if (i === selected) cls = 'border-retro-red bg-retro-red/10';
              else cls = 'border-retro-border opacity-40';
            }
            return (
              <button
                key={i}
                onClick={() => checkAnswer(i)}
                className={`border-2 p-4 flex flex-col items-center gap-2 transition-all ${cls}`}
              >
                <span className="text-4xl">{pic.emoji}</span>
                <span className="font-pixel text-[7px] text-retro-border">{pic.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {ex.type === 'order' && ex.options && (
        <div className="space-y-3">
          <div className="pixel-box p-3 min-h-14 flex flex-wrap gap-2 items-center">
            {wordOrder.length === 0 ? (
              <p className="font-pixel text-[7px] text-retro-border">Нажми на слова ниже...</p>
            ) : wordOrder.map((w, i) => (
              <button key={i} onClick={() => !answered && removeWord(i)} className="btn-gold text-[8px] px-2 py-1">
                {w}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {ex.options.filter(w => !wordOrder.includes(w)).map((w, i) => (
              <button key={i} onClick={() => !answered && addWord(w)} className="btn-cyan text-[8px] px-3 py-2">
                {w}
              </button>
            ))}
          </div>
          {wordOrder.length === ex.options.length && !answered && (
            <button
              className="btn-gold w-full"
              onClick={() => {
                const result = wordOrder.join(' ');
                const ok = result === ex.correct;
                setAnswered(true);
                setFeedback(ok ? 'correct' : 'wrong');
                if (ok) setCorrect(c => c + 1);
              }}
            >
              ПРОВЕРИТЬ ✓
            </button>
          )}
          {answered && (
            <div className={`pixel-box p-3 border-2 ${wordOrder.join(' ') === ex.correct ? 'border-retro-green text-retro-green' : 'border-retro-red text-retro-red'}`}>
              <p className="font-pixel text-[8px]">
                {wordOrder.join(' ') === ex.correct ? '✓ ВЕРНО!' : `✗ Правильно: ${ex.correct}`}
              </p>
            </div>
          )}
        </div>
      )}

      {ex.type === 'guess' && ex.word && (
        <GuessExercise
          word={ex.word}
          onResult={(ok) => { setFeedback(ok ? 'correct' : 'wrong'); if (ok) setCorrect(c => c + 1); setAnswered(true); }}
        />
      )}

      {ex.type === 'match' && ex.pairs && (
        <MatchExercise
          pairs={ex.pairs}
          onResult={(ok) => { setFeedback(ok ? 'correct' : 'wrong'); if (ok) setCorrect(c => c + 1); setAnswered(true); }}
        />
      )}

      {ex.type === 'listen' && ex.hint && ex.options && (
        <ListenExercise
          word={ex.hint}
          options={ex.options}
          correct={ex.correct as number}
          onResult={(ok) => { setFeedback(ok ? 'correct' : 'wrong'); if (ok) setCorrect(c => c + 1); setAnswered(true); }}
        />
      )}

      {ex.type === 'spelling' && ex.options && (
        <SpellingExercise
          correct={ex.correct as string}
          letters={ex.options}
          onResult={(ok) => { setFeedback(ok ? 'correct' : 'wrong'); if (ok) setCorrect(c => c + 1); setAnswered(true); }}
        />
      )}

      {/* Feedback banner */}
      {feedback && ex.type !== 'guess' && ex.type !== 'match' && ex.type !== 'spelling' && ex.type !== 'order' && ex.type !== 'listen' && (
        <div className={`pixel-box p-3 border-2 animate-fade-in flex items-center gap-3
          ${feedback === 'correct' ? 'border-retro-green bg-retro-green/10' : 'border-retro-red bg-retro-red/10'}`}>
          <span className="text-2xl">{feedback === 'correct' ? '✓' : '✗'}</span>
          <p className={`font-pixel text-[8px] ${feedback === 'correct' ? 'text-retro-green' : 'text-retro-red'}`}>
            {feedback === 'correct' ? 'ПРАВИЛЬНО! +25 XP' : 'НЕВЕРНО — попробуй ещё раз!'}
          </p>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button className="btn-gold w-full animate-fade-in" onClick={nextEx}>
          {currentEx >= EXERCISES.length - 1 ? 'ЗАВЕРШИТЬ 🏆' : 'ДАЛЕЕ →'}
        </button>
      )}
    </div>
  );
}
