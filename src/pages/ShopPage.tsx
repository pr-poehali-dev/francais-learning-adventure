import { useState } from 'react';
import { useGame, ShopItem } from '@/lib/gameContext';

const TABS: { label: string; type: ShopItem['type'] | 'all'; emoji: string }[] = [
  { label: 'Все', type: 'all', emoji: '🛍️' },
  { label: 'Шляпы', type: 'hat', emoji: '🎩' },
  { label: 'Оружие', type: 'weapon', emoji: '⚔️' },
  { label: 'Питомцы', type: 'pet', emoji: '🐱' },
  { label: 'Рамки', type: 'frame', emoji: '🖼️' },
];

export default function ShopPage() {
  const { player, buyItem, equipItem } = useGame();
  const [activeTab, setActiveTab] = useState<ShopItem['type'] | 'all'>('all');
  const [toast, setToast] = useState<string | null>(null);

  const filtered = activeTab === 'all'
    ? player.shop
    : player.shop.filter(i => i.type === activeTab);

  function handleBuy(item: ShopItem) {
    if (item.owned) {
      equipItem(item.id);
      showToast(`${item.emoji} ${item.name} надет!`);
      return;
    }
    const ok = buyItem(item.id);
    if (ok) {
      showToast(`✅ Куплено: ${item.name}!`);
    } else {
      showToast(`❌ Недостаточно монет!`);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  const isEquipped = (item: ShopItem) => {
    if (item.type === 'hat') return player.equippedHat === item.id;
    if (item.type === 'weapon') return player.equippedWeapon === item.id;
    if (item.type === 'pet') return player.equippedPet === item.id;
    if (item.type === 'frame') return player.equippedFrame === item.id;
    return false;
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pixel-box-gold px-4 py-2 animate-scale-in">
          <p className="font-pixel text-[8px] text-white whitespace-nowrap">{toast}</p>
        </div>
      )}

      {/* Coins balance */}
      <div className="pixel-box-gold p-4 flex items-center justify-between">
        <div>
          <p className="font-pixel text-[8px] text-retro-border">КОШЕЛЁК</p>
          <p className="font-pixel text-xl text-retro-gold">{player.coins} 🪙</p>
        </div>
        <div className="text-right">
          <p className="font-pixel text-[7px] text-retro-border">Зарабатывай монеты</p>
          <p className="font-pixel text-[7px] text-retro-cyan">выполняя упражнения!</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`shrink-0 flex items-center gap-1 px-3 py-2 border-2 font-pixel text-[7px] transition-all
              ${activeTab === tab.type
                ? 'border-retro-gold bg-retro-gold/10 text-retro-gold'
                : 'border-retro-border text-retro-border hover:border-retro-gold/40'}`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(item => {
          const equipped = isEquipped(item);
          const canAfford = player.coins >= item.price;
          return (
            <div
              key={item.id}
              className={`pixel-box p-3 flex flex-col items-center gap-2 transition-all
                ${equipped ? 'border-retro-green bg-retro-green/5' : ''}
                ${item.owned && !equipped ? 'border-retro-cyan/50' : ''}`}
            >
              {/* Item preview */}
              <div className={`w-16 h-16 border-2 flex items-center justify-center text-4xl
                ${equipped ? 'border-retro-green' : item.owned ? 'border-retro-cyan' : 'border-retro-border'}`}>
                {item.emoji}
              </div>

              {/* Name */}
              <p className="font-pixel text-[7px] text-white text-center leading-tight">{item.name}</p>

              {/* Status badge */}
              {equipped && (
                <span className="font-pixel text-[6px] text-retro-green bg-retro-green/10 border border-retro-green px-1.5 py-0.5">
                  ✓ НАДЕТО
                </span>
              )}

              {/* Button */}
              {item.owned && !equipped && (
                <button
                  onClick={() => handleBuy(item)}
                  className="btn-cyan text-[7px] px-3 py-1.5 w-full"
                >
                  НАДЕТЬ
                </button>
              )}
              {!item.owned && (
                <button
                  onClick={() => handleBuy(item)}
                  className={`text-[7px] px-3 py-1.5 w-full border-2 font-pixel transition-all
                    ${canAfford
                      ? 'btn-gold'
                      : 'border-retro-border text-retro-border opacity-50 cursor-not-allowed'}`}
                >
                  {item.price} 🪙
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="pixel-box p-8 text-center">
          <p className="font-pixel text-[8px] text-retro-border">НЕТ ПРЕДМЕТОВ</p>
        </div>
      )}
    </div>
  );
}
