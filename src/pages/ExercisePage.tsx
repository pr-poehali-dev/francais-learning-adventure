import { useState, useRef } from 'react';
import { useGame } from '@/lib/gameContext';
import { EXERCISES, TYPE_LABELS } from './exercise/exerciseTypes';
import { GuessExercise, MatchExercise, SpellingExercise, ListenExercise } from './exercise/ExerciseWidgets';
import { ExerciseResult } from './exercise/ExerciseResult';

export default function ExercisePage({ onBack }: { onBack: () => void }) {
  const { addXP, addCoins, player } = useGame();
  const [currentEx, setCurrentEx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wordOrder, setWordOrder] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const rewardGiven = useRef(false);

  const ex = EXERCISES[currentEx];
  const progress = (currentEx / EXERCISES.length) * 100;

  function showFeedback(ok: boolean) {
    setFeedback(ok ? 'correct' : 'wrong');
    if (ok) {
      setCorrect(c => c + 1);
      addXP(25);
      addCoins(5);
    }
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

  function handleRepeat() {
    setCurrentEx(0);
    setCorrect(0);
    setFinished(false);
    setAnswered(false);
    setSelected(null);
    setFeedback(null);
    setWordOrder([]);
    rewardGiven.current = false;
  }

  if (finished) {
    return <ExerciseResult correct={correct} onBack={onBack} onRepeat={handleRepeat} />;
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
                if (ok) {
                  setCorrect(c => c + 1);
                  addXP(25);
                  addCoins(5);
                }
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
          onResult={(ok) => { setFeedback(ok ? 'correct' : 'wrong'); if (ok) { setCorrect(c => c + 1); addXP(25); addCoins(5); } setAnswered(true); }}
        />
      )}

      {ex.type === 'match' && ex.pairs && (
        <MatchExercise
          pairs={ex.pairs}
          onResult={(ok) => { setFeedback(ok ? 'correct' : 'wrong'); if (ok) { setCorrect(c => c + 1); addXP(25); addCoins(5); } setAnswered(true); }}
        />
      )}

      {ex.type === 'listen' && ex.hint && ex.options && (
        <ListenExercise
          word={ex.hint}
          options={ex.options}
          correct={ex.correct as number}
          onResult={(ok) => { setFeedback(ok ? 'correct' : 'wrong'); if (ok) { setCorrect(c => c + 1); addXP(25); addCoins(5); } setAnswered(true); }}
        />
      )}

      {ex.type === 'spelling' && ex.options && (
        <SpellingExercise
          correct={ex.correct as string}
          letters={ex.options}
          onResult={(ok) => { setFeedback(ok ? 'correct' : 'wrong'); if (ok) { setCorrect(c => c + 1); addXP(25); addCoins(5); } setAnswered(true); }}
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
