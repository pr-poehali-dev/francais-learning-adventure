import { useState } from 'react';

const AVATARS = ['⚔️', '🧙', '🏹', '🛡️', '🦊', '🐺', '🦁', '🐯', '🧝', '🧛', '🐉', '🦄'];
const HATS = ['🎩', '👑', '⛑️', '🪖', '🎓', '🧢', '🎭', '❌'];
const WEAPONS = ['⚔️', '🪄', '📚', '🖊️', '🔮', '🎸', '❌'];
const PETS = ['🦊', '🐱', '🐶', '🦜', '🐍', '🐉', '❌'];

const COLORS = [
  { name: 'Золото', value: '#ffd700', cls: 'border-retro-gold' },
  { name: 'Киан', value: '#00ffff', cls: 'border-retro-cyan' },
  { name: 'Розовый', value: '#ff69b4', cls: 'border-retro-pink' },
  { name: 'Зелёный', value: '#39ff14', cls: 'border-retro-green' },
  { name: 'Фиолет', value: '#bf5fff', cls: 'border-retro-purple' },
  { name: 'Оранжевый', value: '#ff8c00', cls: 'border-retro-orange' },
];

const TITLES = ['Искатель слов', 'Знаток Парижа', 'Языковой рыцарь', 'Мастер диалогов', 'Гуру фразеологии'];

export default function CustomizePage() {
  const [avatar, setAvatar] = useState(0);
  const [hat, setHat] = useState(0);
  const [weapon, setWeapon] = useState(0);
  const [pet, setPet] = useState(0);
  const [color, setColor] = useState(0);
  const [title, setTitle] = useState(0);

  const selectedColor = COLORS[color].value;

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Preview */}
      <div className="pixel-box p-4 flex flex-col items-center gap-3">
        <p className="font-pixel text-[9px] text-retro-gold">ПРЕДПРОСМОТР</p>
        <div
          className="w-24 h-24 border-4 flex items-center justify-center text-5xl relative"
          style={{ borderColor: selectedColor, boxShadow: `0 0 20px ${selectedColor}66` }}
        >
          <span>{AVATARS[avatar]}</span>
          {HATS[hat] !== '❌' && <span className="absolute -top-3 text-2xl">{HATS[hat]}</span>}
          {PETS[pet] !== '❌' && <span className="absolute -right-3 bottom-0 text-xl">{PETS[pet]}</span>}
        </div>
        <p className="font-pixel text-[8px]" style={{ color: selectedColor }}>{TITLES[title]}</p>
        <div className="flex items-center gap-2">
          {WEAPONS[weapon] !== '❌' && <span className="text-xl">{WEAPONS[weapon]}</span>}
          <div className="bg-retro-gold text-retro-bg font-pixel text-[8px] px-2 py-1">Lv.7</div>
        </div>
      </div>

      {/* Avatar */}
      <div className="pixel-box p-3">
        <p className="font-pixel text-[8px] text-retro-gold mb-3">АВАТАР</p>
        <div className="grid grid-cols-6 gap-2">
          {AVATARS.map((a, i) => (
            <button
              key={i}
              onClick={() => setAvatar(i)}
              className={`h-10 text-xl flex items-center justify-center border-2 transition-all
                ${avatar === i ? 'border-retro-gold bg-retro-gold/10' : 'border-retro-border hover:border-retro-gold/50'}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Hat */}
      <div className="pixel-box p-3">
        <p className="font-pixel text-[8px] text-retro-cyan mb-3">ГОЛОВНОЙ УБОР</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {HATS.map((h, i) => (
            <button
              key={i}
              onClick={() => setHat(i)}
              className={`shrink-0 w-12 h-12 text-2xl flex items-center justify-center border-2 transition-all
                ${hat === i ? 'border-retro-cyan bg-retro-cyan/10' : 'border-retro-border hover:border-retro-cyan/50'}`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Weapon & Pet */}
      <div className="grid grid-cols-2 gap-3">
        <div className="pixel-box p-3">
          <p className="font-pixel text-[7px] text-retro-pink mb-2">ОРУЖИЕ</p>
          <div className="flex flex-wrap gap-1.5">
            {WEAPONS.map((w, i) => (
              <button
                key={i}
                onClick={() => setWeapon(i)}
                className={`w-9 h-9 text-lg flex items-center justify-center border-2 transition-all
                  ${weapon === i ? 'border-retro-pink bg-retro-pink/10' : 'border-retro-border'}`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
        <div className="pixel-box p-3">
          <p className="font-pixel text-[7px] text-retro-green mb-2">ПИТОМЕЦ</p>
          <div className="flex flex-wrap gap-1.5">
            {PETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setPet(i)}
                className={`w-9 h-9 text-lg flex items-center justify-center border-2 transition-all
                  ${pet === i ? 'border-retro-green bg-retro-green/10' : 'border-retro-border'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color */}
      <div className="pixel-box p-3">
        <p className="font-pixel text-[8px] text-retro-gold mb-3">ЦВЕТ РАМКИ</p>
        <div className="flex gap-2">
          {COLORS.map((c, i) => (
            <button
              key={i}
              onClick={() => setColor(i)}
              className={`flex-1 h-8 border-4 transition-all ${c.cls} ${color === i ? 'scale-110' : 'opacity-60 hover:opacity-80'}`}
              style={{ background: `${c.value}22` }}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="pixel-box p-3">
        <p className="font-pixel text-[8px] text-retro-gold mb-3">ТИТУЛ</p>
        <div className="space-y-1.5">
          {TITLES.map((t, i) => (
            <button
              key={i}
              onClick={() => setTitle(i)}
              className={`w-full text-left p-2 border-2 font-rubik text-sm transition-all
                ${title === i ? 'border-retro-gold bg-retro-gold/10 text-retro-gold' : 'border-retro-border text-retro-border hover:border-retro-gold/50'}`}
            >
              {i < 2 ? '' : '🔒 '}{t}
            </button>
          ))}
        </div>
      </div>

      <button className="btn-gold w-full text-center">
        💾 СОХРАНИТЬ ПЕРСОНАЖА
      </button>
    </div>
  );
}
