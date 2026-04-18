import { useState, useRef } from 'react';
import { MatchPair } from './exerciseTypes';

// Guess-the-word component
export function GuessExercise({ word, onResult }: { word: string; onResult: (ok: boolean) => void }) {
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
      <div className="flex items-center gap-2">
        <span className="font-pixel text-[7px] text-retro-border">ПОПЫТКИ:</span>
        <div className="flex gap-1">
          {Array(6).fill(0).map((_, i) => (
            <span key={i} className={`text-lg ${i < 6 - wrong ? 'opacity-100' : 'opacity-20'}`}>❤️</span>
          ))}
        </div>
        {wrong > 0 && <span className="text-xl">{hangmanParts[wrong - 1]}</span>}
      </div>

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
export function MatchExercise({ pairs, onResult }: { pairs: MatchPair[]; onResult: (ok: boolean) => void }) {
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
export function SpellingExercise({ correct, letters, onResult }: { correct: string; letters: string[]; onResult: (ok: boolean) => void }) {
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
      <div className="pixel-box p-3 min-h-12 flex items-center gap-1 flex-wrap">
        {Array(correct.length).fill(0).map((_, i) => (
          <div key={i} className={`w-8 h-10 border-b-2 flex items-end justify-center pb-1
            ${typed[i] ? 'border-retro-gold' : 'border-retro-border'}`}>
            <span className="font-pixel text-sm text-retro-gold">{typed[i] || ''}</span>
          </div>
        ))}
      </div>

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
export function ListenExercise({ word, options, correct, onResult }: { word: string; options: string[]; correct: number; onResult: (ok: boolean) => void }) {
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
