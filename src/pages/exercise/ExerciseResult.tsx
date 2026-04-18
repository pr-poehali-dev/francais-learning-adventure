import { useGame } from '@/lib/gameContext';
import { EXERCISES } from './exerciseTypes';

interface ExerciseResultProps {
  correct: number;
  onBack: () => void;
  onRepeat: () => void;
}

export function ExerciseResult({ correct, onBack, onRepeat }: ExerciseResultProps) {
  const { player } = useGame();
  const stars = correct >= EXERCISES.length ? 3 : correct >= Math.ceil(EXERCISES.length * 0.6) ? 2 : 1;
  const earnedXP = correct * 25;
  const earnedCoins = correct * 5;

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
        <div className="flex gap-4 justify-center">
          <div className="pixel-box px-3 py-2 text-center">
            <p className="font-pixel text-[10px] text-retro-gold">+{earnedXP}</p>
            <p className="font-pixel text-[7px] text-retro-border">XP</p>
          </div>
          <div className="pixel-box px-3 py-2 text-center">
            <p className="font-pixel text-[10px] text-retro-gold">+{earnedCoins}</p>
            <p className="font-pixel text-[7px] text-retro-border">🪙</p>
          </div>
        </div>
        <p className="font-pixel text-[8px] text-retro-cyan">Монет в кошельке: {player.coins} 🪙</p>
      </div>
      <button className="btn-gold w-full" onClick={onBack}>← ВЕРНУТЬСЯ К УРОВНЯМ</button>
      <button className="btn-cyan w-full" onClick={onRepeat}>🔄 ПОВТОРИТЬ</button>
    </div>
  );
}
