import Icon from '@/components/ui/icon';

const PLAYERS = [
  { rank: 1, name: 'Marie_FR', level: 24, xp: 12450, streak: 45, avatar: '🦊', isMe: false },
  { rank: 2, name: 'PierreParis', level: 21, xp: 10200, streak: 32, avatar: '🐺', isMe: false },
  { rank: 3, name: 'LinguaQueen', level: 19, xp: 9870, streak: 28, avatar: '🦁', isMe: false },
  { rank: 4, name: 'BonjourBob', level: 18, xp: 8540, streak: 21, avatar: '🐯', isMe: false },
  { rank: 5, name: 'FrenchDream', level: 16, xp: 7200, streak: 15, avatar: '🐻', isMe: false },
  { rank: 6, name: 'AmiAmie', level: 15, xp: 6890, streak: 12, avatar: '🐸', isMe: false },
  { rank: 7, name: 'Искатель_слов', level: 7, xp: 3420, streak: 7, avatar: '⚔️', isMe: true },
  { rank: 8, name: 'NouvelleVague', level: 6, xp: 2980, streak: 4, avatar: '🐧', isMe: false },
  { rank: 9, name: 'ParisStudent', level: 5, xp: 2100, streak: 2, avatar: '🦉', isMe: false },
  { rank: 10, name: 'FrenchBeginner', level: 4, xp: 1540, streak: 1, avatar: '🐱', isMe: false },
];

const RANK_COLORS = [
  'border-retro-gold text-retro-gold shadow-neon-gold',
  'border-gray-300 text-gray-300',
  'border-orange-400 text-orange-400',
];

const TABS = ['Неделя', 'Месяц', 'Всего'];

export default function RatingPage() {
  const top3 = PLAYERS.slice(0, 3);
  const rest = PLAYERS.slice(3);

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-1">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`flex-1 font-pixel text-[8px] py-2 border-2 transition-all
              ${i === 0 ? 'border-retro-gold bg-retro-gold/10 text-retro-gold' : 'border-retro-border text-retro-border'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="pixel-box p-4">
        <p className="font-pixel text-[9px] text-retro-gold text-center mb-4">🏆 ТОП ИГРОКОВ</p>
        <div className="flex items-end justify-center gap-3">
          {[top3[1], top3[0], top3[2]].map((p, podiumIdx) => {
            const actualRank = podiumIdx === 1 ? 1 : podiumIdx === 0 ? 2 : 3;
            const heights = ['h-16', 'h-24', 'h-12'];
            const rankIdx = actualRank - 1;
            return (
              <div key={p.rank} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{p.avatar}</span>
                <p className="font-pixel text-[7px] text-white text-center">{p.name.slice(0, 8)}</p>
                <div className={`${heights[podiumIdx]} w-16 border-2 ${RANK_COLORS[rankIdx]} flex items-center justify-center`}>
                  <span className="font-pixel text-lg">{actualRank}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* My position */}
      <div className="pixel-box-gold p-3 flex items-center gap-3">
        <span className="font-pixel text-lg text-retro-gold">#7</span>
        <span className="text-2xl">⚔️</span>
        <div className="flex-1">
          <p className="font-russo text-sm text-white">Искатель_слов (Вы)</p>
          <p className="font-pixel text-[7px] text-retro-gold mt-0.5">3 420 XP · Серия: 7 🔥</p>
        </div>
        <div className="text-right">
          <p className="font-pixel text-[7px] text-retro-border">До #6:</p>
          <p className="font-pixel text-[8px] text-retro-cyan">3 470 XP</p>
        </div>
      </div>

      {/* Full list */}
      <div className="space-y-1.5">
        {rest.map((p) => (
          <div
            key={p.rank}
            className={`flex items-center gap-3 p-3 border-2 transition-all
              ${p.isMe ? 'border-retro-gold bg-retro-gold/5' : 'border-retro-border hover:border-retro-border/80'}`}
          >
            <span className={`font-pixel text-[9px] w-6 text-center ${p.isMe ? 'text-retro-gold' : 'text-retro-border'}`}>
              #{p.rank}
            </span>
            <span className="text-xl">{p.avatar}</span>
            <div className="flex-1">
              <p className={`font-rubik text-sm font-medium ${p.isMe ? 'text-retro-gold' : 'text-white'}`}>{p.name}</p>
              <p className="font-pixel text-[7px] text-retro-border">Lv.{p.level}</p>
            </div>
            <div className="text-right">
              <p className={`font-pixel text-[8px] ${p.isMe ? 'text-retro-gold' : 'text-white'}`}>{p.xp.toLocaleString()} XP</p>
              <p className="font-pixel text-[7px] text-retro-border">{p.streak}🔥</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
