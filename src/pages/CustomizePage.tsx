import { useGame, FRAME_COLORS } from '@/lib/gameContext';

const AVATARS = ['⚔️', '🧙', '🏹', '🛡️', '🦊', '🐺', '🦁', '🐯', '🧝', '🧛', '🐉', '🦄'];

interface CustomizePageProps {
  onNavigate: (page: string) => void;
}

export default function CustomizePage({ onNavigate }: CustomizePageProps) {
  const { player, equipItem, setAvatar } = useGame();

  const frameColor = FRAME_COLORS[player.equippedFrame] ?? '#ffd700';

  const ownedHats = player.shop.filter(i => i.type === 'hat' && i.owned);
  const ownedWeapons = player.shop.filter(i => i.type === 'weapon' && i.owned);
  const ownedPets = player.shop.filter(i => i.type === 'pet' && i.owned);
  const ownedFrames = player.shop.filter(i => i.type === 'frame' && i.owned);

  const hat = player.equippedHat ? player.shop.find(i => i.id === player.equippedHat) : null;
  const weapon = player.equippedWeapon ? player.shop.find(i => i.id === player.equippedWeapon) : null;
  const pet = player.equippedPet ? player.shop.find(i => i.id === player.equippedPet) : null;

  function unequip(type: 'hat' | 'weapon' | 'pet') {
    // We can't unequip in current system without adding state — just navigate to shop
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Preview */}
      <div className="pixel-box p-6 flex flex-col items-center gap-3">
        <p className="font-pixel text-[9px] text-retro-gold">ТВОЙ ПЕРСОНАЖ</p>
        <div className="relative">
          <div
            className="w-28 h-28 border-4 flex items-center justify-center text-6xl relative"
            style={{ borderColor: frameColor, boxShadow: `0 0 25px ${frameColor}55` }}
          >
            {AVATARS[player.avatar]}
            {hat && <span className="absolute -top-4 text-3xl">{hat.emoji}</span>}
            {pet && <span className="absolute -right-4 bottom-0 text-2xl">{pet.emoji}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {weapon && <span className="text-2xl">{weapon.emoji}</span>}
          <div className="text-center">
            <p className="font-russo text-sm text-white">Искатель слов</p>
            <div className="bg-retro-gold text-retro-bg font-pixel text-[8px] px-2 py-0.5 inline-block mt-0.5">
              Lv.{player.level}
            </div>
          </div>
        </div>
        <p className="font-pixel text-[8px] text-retro-gold">{player.coins} 🪙 в кошельке</p>
      </div>

      {/* Avatar selection */}
      <div className="pixel-box p-3">
        <p className="font-pixel text-[8px] text-retro-gold mb-3">АВАТАР</p>
        <div className="grid grid-cols-6 gap-2">
          {AVATARS.map((a, i) => (
            <button
              key={i}
              onClick={() => setAvatar(i)}
              className={`h-10 text-xl flex items-center justify-center border-2 transition-all
                ${player.avatar === i ? 'border-retro-gold bg-retro-gold/10' : 'border-retro-border hover:border-retro-gold/50'}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Owned hats */}
      <div className="pixel-box p-3">
        <div className="flex items-center justify-between mb-3">
          <p className="font-pixel text-[8px] text-retro-cyan">🎩 ШЛЯПЫ</p>
          {ownedHats.length === 0 && (
            <button onClick={() => onNavigate('shop')} className="font-pixel text-[7px] text-retro-border hover:text-retro-gold">
              Купить →
            </button>
          )}
        </div>
        {ownedHats.length === 0 ? (
          <p className="font-rubik text-xs text-retro-border/60 text-center py-2">
            Шляп пока нет. Купи в магазине!
          </p>
        ) : (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => equipItem('')}
              className={`w-12 h-12 border-2 flex items-center justify-center font-pixel text-[8px] transition-all
                ${!player.equippedHat ? 'border-retro-gold bg-retro-gold/10 text-retro-gold' : 'border-retro-border text-retro-border'}`}
            >
              ✗
            </button>
            {ownedHats.map(item => (
              <button
                key={item.id}
                onClick={() => equipItem(item.id)}
                className={`w-12 h-12 border-2 text-2xl flex items-center justify-center transition-all
                  ${player.equippedHat === item.id ? 'border-retro-cyan bg-retro-cyan/10' : 'border-retro-border hover:border-retro-cyan/50'}`}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Owned weapons */}
      <div className="pixel-box p-3">
        <div className="flex items-center justify-between mb-3">
          <p className="font-pixel text-[8px] text-retro-pink">⚔️ ОРУЖИЕ</p>
          {ownedWeapons.length === 0 && (
            <button onClick={() => onNavigate('shop')} className="font-pixel text-[7px] text-retro-border hover:text-retro-gold">
              Купить →
            </button>
          )}
        </div>
        {ownedWeapons.length === 0 ? (
          <p className="font-rubik text-xs text-retro-border/60 text-center py-2">Оружия пока нет.</p>
        ) : (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => equipItem('')}
              className={`w-12 h-12 border-2 flex items-center justify-center font-pixel text-[8px] transition-all
                ${!player.equippedWeapon ? 'border-retro-gold bg-retro-gold/10 text-retro-gold' : 'border-retro-border text-retro-border'}`}
            >
              ✗
            </button>
            {ownedWeapons.map(item => (
              <button
                key={item.id}
                onClick={() => equipItem(item.id)}
                className={`w-12 h-12 border-2 text-2xl flex items-center justify-center transition-all
                  ${player.equippedWeapon === item.id ? 'border-retro-pink bg-retro-pink/10' : 'border-retro-border hover:border-retro-pink/50'}`}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Owned pets */}
      <div className="pixel-box p-3">
        <div className="flex items-center justify-between mb-3">
          <p className="font-pixel text-[8px] text-retro-green">🐾 ПИТОМЦЫ</p>
          {ownedPets.length === 0 && (
            <button onClick={() => onNavigate('shop')} className="font-pixel text-[7px] text-retro-border hover:text-retro-gold">
              Купить →
            </button>
          )}
        </div>
        {ownedPets.length === 0 ? (
          <p className="font-rubik text-xs text-retro-border/60 text-center py-2">Питомцев пока нет.</p>
        ) : (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => equipItem('')}
              className={`w-12 h-12 border-2 flex items-center justify-center font-pixel text-[8px] transition-all
                ${!player.equippedPet ? 'border-retro-gold bg-retro-gold/10 text-retro-gold' : 'border-retro-border text-retro-border'}`}
            >
              ✗
            </button>
            {ownedPets.map(item => (
              <button
                key={item.id}
                onClick={() => equipItem(item.id)}
                className={`w-12 h-12 border-2 text-2xl flex items-center justify-center transition-all
                  ${player.equippedPet === item.id ? 'border-retro-green bg-retro-green/10' : 'border-retro-border hover:border-retro-green/50'}`}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Owned frames */}
      <div className="pixel-box p-3">
        <p className="font-pixel text-[8px] text-retro-gold mb-3">🖼️ РАМКА</p>
        <div className="flex gap-2 flex-wrap">
          {ownedFrames.map(item => {
            const color = FRAME_COLORS[item.id] ?? '#ffd700';
            return (
              <button
                key={item.id}
                onClick={() => equipItem(item.id)}
                className={`w-12 h-12 border-4 transition-all flex items-center justify-center
                  ${player.equippedFrame === item.id ? 'scale-110' : 'opacity-60 hover:opacity-90'}`}
                style={{ borderColor: color, background: `${color}22` }}
              >
                {player.equippedFrame === item.id && <span className="font-pixel text-[10px]" style={{ color }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={() => onNavigate('shop')} className="btn-gold w-full">
        🛍️ ПЕРЕЙТИ В МАГАЗИН
      </button>
    </div>
  );
}
