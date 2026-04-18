import { createContext, useContext, useState, ReactNode } from 'react';

export interface ShopItem {
  id: string;
  type: 'hat' | 'weapon' | 'pet' | 'frame';
  emoji: string;
  name: string;
  price: number;
  owned: boolean;
  equipped: boolean;
}

export interface PlayerState {
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  streak: number;
  totalCorrect: number;
  avatar: number;
  equippedHat: string | null;
  equippedWeapon: string | null;
  equippedPet: string | null;
  equippedFrame: string;
  shop: ShopItem[];
}

interface GameContextType {
  player: PlayerState;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  buyItem: (id: string) => boolean;
  equipItem: (id: string) => void;
  setAvatar: (idx: number) => void;
}

const XP_PER_LEVEL = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250];

const INITIAL_SHOP: ShopItem[] = [
  { id: 'hat_beret', type: 'hat', emoji: '🎩', name: 'Берет', price: 50, owned: false, equipped: false },
  { id: 'hat_crown', type: 'hat', emoji: '👑', name: 'Корона', price: 150, owned: false, equipped: false },
  { id: 'hat_helmet', type: 'hat', emoji: '⛑️', name: 'Каска', price: 80, owned: false, equipped: false },
  { id: 'hat_grad', type: 'hat', emoji: '🎓', name: 'Диплом', price: 120, owned: false, equipped: false },
  { id: 'hat_magic', type: 'hat', emoji: '🪄', name: 'Волшебная шляпа', price: 200, owned: false, equipped: false },
  { id: 'weapon_sword', type: 'weapon', emoji: '⚔️', name: 'Меч', price: 60, owned: false, equipped: false },
  { id: 'weapon_book', type: 'weapon', emoji: '📚', name: 'Книга знаний', price: 40, owned: false, equipped: false },
  { id: 'weapon_pen', type: 'weapon', emoji: '🖊️', name: 'Волшебное перо', price: 70, owned: false, equipped: false },
  { id: 'weapon_crystal', type: 'weapon', emoji: '🔮', name: 'Хрустальный шар', price: 180, owned: false, equipped: false },
  { id: 'weapon_guitar', type: 'weapon', emoji: '🎸', name: 'Гитара', price: 130, owned: false, equipped: false },
  { id: 'pet_fox', type: 'pet', emoji: '🦊', name: 'Лис', price: 100, owned: false, equipped: false },
  { id: 'pet_cat', type: 'pet', emoji: '🐱', name: 'Кот', price: 80, owned: false, equipped: false },
  { id: 'pet_dragon', type: 'pet', emoji: '🐉', name: 'Дракон', price: 300, owned: false, equipped: false },
  { id: 'pet_owl', type: 'pet', emoji: '🦉', name: 'Сова', price: 150, owned: false, equipped: false },
  { id: 'pet_parrot', type: 'pet', emoji: '🦜', name: 'Попугай', price: 120, owned: false, equipped: false },
  { id: 'frame_gold', type: 'frame', emoji: '🟡', name: 'Золотая рамка', price: 0, owned: true, equipped: true },
  { id: 'frame_cyan', type: 'frame', emoji: '🔵', name: 'Синяя рамка', price: 90, owned: false, equipped: false },
  { id: 'frame_pink', type: 'frame', emoji: '🩷', name: 'Розовая рамка', price: 90, owned: false, equipped: false },
  { id: 'frame_green', type: 'frame', emoji: '🟢', name: 'Зелёная рамка', price: 90, owned: false, equipped: false },
  { id: 'frame_fire', type: 'frame', emoji: '🔥', name: 'Огненная рамка', price: 250, owned: false, equipped: false },
];

const FRAME_COLORS: Record<string, string> = {
  frame_gold: '#ffd700',
  frame_cyan: '#00ffff',
  frame_pink: '#ff69b4',
  frame_green: '#39ff14',
  frame_fire: '#ff4500',
};

export { FRAME_COLORS };

const INITIAL_STATE: PlayerState = {
  level: 1,
  xp: 0,
  xpToNext: 100,
  coins: 0,
  streak: 1,
  totalCorrect: 0,
  avatar: 0,
  equippedHat: null,
  equippedWeapon: null,
  equippedPet: null,
  equippedFrame: 'frame_gold',
  shop: INITIAL_SHOP,
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerState>(INITIAL_STATE);

  function addXP(amount: number) {
    setPlayer(p => {
      let xp = p.xp + amount;
      let level = p.level;
      let xpToNext = XP_PER_LEVEL[level] ?? 999999;

      while (xp >= xpToNext && level < 10) {
        xp -= xpToNext;
        level++;
        xpToNext = XP_PER_LEVEL[level] ?? 999999;
      }

      return { ...p, xp, level, xpToNext };
    });
  }

  function addCoins(amount: number) {
    setPlayer(p => ({ ...p, coins: p.coins + amount }));
  }

  function buyItem(id: string): boolean {
    let success = false;
    setPlayer(p => {
      const item = p.shop.find(i => i.id === id);
      if (!item || item.owned || p.coins < item.price) return p;
      success = true;
      return {
        ...p,
        coins: p.coins - item.price,
        shop: p.shop.map(i => i.id === id ? { ...i, owned: true } : i),
      };
    });
    return success;
  }

  function equipItem(id: string) {
    setPlayer(p => {
      const item = p.shop.find(i => i.id === id);
      if (!item || !item.owned) return p;

      const newShop = p.shop.map(i => {
        if (i.type === item.type) return { ...i, equipped: i.id === id };
        return i;
      });

      const update: Partial<PlayerState> = { shop: newShop };
      if (item.type === 'hat') update.equippedHat = id;
      if (item.type === 'weapon') update.equippedWeapon = id;
      if (item.type === 'pet') update.equippedPet = id;
      if (item.type === 'frame') update.equippedFrame = id;

      return { ...p, ...update };
    });
  }

  function setAvatar(idx: number) {
    setPlayer(p => ({ ...p, avatar: idx }));
  }

  return (
    <GameContext.Provider value={{ player, addXP, addCoins, buyItem, equipItem, setAvatar }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
