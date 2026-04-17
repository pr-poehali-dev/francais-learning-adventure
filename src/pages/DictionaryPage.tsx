import { useState } from 'react';
import Icon from '@/components/ui/icon';

const CATEGORIES = ['Все', 'Еда', 'Числа', 'Приветствия', 'Цвета', 'Семья'];

const WORDS = [
  { fr: 'bonjour', ru: 'здравствуйте', cat: 'Приветствия', mastery: 90, emoji: '👋' },
  { fr: 'merci', ru: 'спасибо', cat: 'Приветствия', mastery: 85, emoji: '🙏' },
  { fr: 'baguette', ru: 'багет', cat: 'Еда', mastery: 100, emoji: '🥖' },
  { fr: 'croissant', ru: 'круассан', cat: 'Еда', mastery: 75, emoji: '🥐' },
  { fr: 'fromage', ru: 'сыр', cat: 'Еда', mastery: 60, emoji: '🧀' },
  { fr: 'un', ru: 'один', cat: 'Числа', mastery: 95, emoji: '1️⃣' },
  { fr: 'deux', ru: 'два', cat: 'Числа', mastery: 90, emoji: '2️⃣' },
  { fr: 'rouge', ru: 'красный', cat: 'Цвета', mastery: 70, emoji: '🔴' },
  { fr: 'bleu', ru: 'синий', cat: 'Цвета', mastery: 55, emoji: '🔵' },
  { fr: 'famille', ru: 'семья', cat: 'Семья', mastery: 40, emoji: '👨‍👩‍👧' },
  { fr: 'mère', ru: 'мать', cat: 'Семья', mastery: 50, emoji: '👩' },
  { fr: 'père', ru: 'отец', cat: 'Семья', mastery: 45, emoji: '👨' },
];

function getMasteryColor(m: number) {
  if (m >= 80) return 'text-retro-green border-retro-green';
  if (m >= 50) return 'text-retro-gold border-retro-gold';
  return 'text-retro-pink border-retro-pink';
}

export default function DictionaryPage() {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [search, setSearch] = useState('');
  const [flipped, setFlipped] = useState<number | null>(null);

  const filtered = WORDS.filter(w => {
    const matchCat = activeCategory === 'Все' || w.cat === activeCategory;
    const matchSearch = w.fr.includes(search.toLowerCase()) || w.ru.includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Stats bar */}
      <div className="flex gap-2">
        <div className="pixel-box p-2 flex-1 text-center">
          <p className="font-pixel text-[8px] text-retro-gold">240</p>
          <p className="font-pixel text-[7px] text-retro-border mt-1">СЛОВ</p>
        </div>
        <div className="pixel-box p-2 flex-1 text-center">
          <p className="font-pixel text-[8px] text-retro-green">182</p>
          <p className="font-pixel text-[7px] text-retro-border mt-1">ИЗУЧЕНО</p>
        </div>
        <div className="pixel-box p-2 flex-1 text-center">
          <p className="font-pixel text-[8px] text-retro-cyan">58</p>
          <p className="font-pixel text-[7px] text-retro-border mt-1">В РАБОТЕ</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-retro-border" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск слова..."
          className="w-full bg-retro-panel border-2 border-retro-border pl-8 pr-4 py-2 font-rubik text-sm text-white placeholder:text-retro-border/50 outline-none focus:border-retro-cyan transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 font-pixel text-[7px] px-3 py-2 border-2 transition-all
              ${activeCategory === cat
                ? 'border-retro-gold bg-retro-gold/10 text-retro-gold'
                : 'border-retro-border text-retro-border hover:border-retro-gold/50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Word cards */}
      <div className="space-y-2">
        {filtered.map((word, i) => (
          <div
            key={i}
            className={`pixel-box p-3 cursor-pointer transition-all hover:border-retro-cyan/50`}
            onClick={() => setFlipped(flipped === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl shrink-0">{word.emoji}</span>
              <div className="flex-1">
                {flipped === i ? (
                  <div className="animate-scale-in">
                    <p className="font-rubik text-base text-white font-medium">{word.ru}</p>
                    <p className="font-pixel text-[8px] text-retro-cyan mt-0.5">{word.fr}</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-russo text-base text-white">{word.fr}</p>
                    <p className="font-pixel text-[7px] text-retro-border mt-0.5">{word.cat}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`w-8 h-8 border-2 flex items-center justify-center font-pixel text-[8px] ${getMasteryColor(word.mastery)}`}>
                  {word.mastery}%
                </div>
              </div>
            </div>
            {flipped === i && (
              <div className="mt-2 flex gap-2">
                <button className="btn-cyan text-[7px] px-2 py-1 flex-1">🔊 Слушать</button>
                <button className="btn-pink text-[7px] px-2 py-1 flex-1">✏️ Практика</button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="pixel-box p-8 text-center">
            <p className="font-pixel text-[8px] text-retro-border">СЛОВА НЕ НАЙДЕНЫ</p>
          </div>
        )}
      </div>
    </div>
  );
}
