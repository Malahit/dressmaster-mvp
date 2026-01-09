import type { Item } from '@prisma/client';
type Occasion = 'work' | 'date' | 'sport';

export function generateOutfits(items: Item[], occasion: Occasion, temp?: number) {
  const tops = items.filter((i) => i.category === 'top');
  const bottoms = items.filter((i) => i.category === 'bottom');
  const shoes = items.filter((i) => i.category === 'shoes');
  const accessories = items.filter((i) => i.category === 'accessory');

  const ft = filterByTemp(tops, temp);
  const fb = filterByTemp(bottoms, temp);
  const fs = filterByTemp(shoes, temp);

  const combos: { top: Item; bottom: Item; shoes: Item; accessory?: Item; score: number }[] = [];
  for (const t of ft) for (const b of fb) for (const s of fs) {
    const acc = accessories[0];
    const score = scoreFormality(t, b, s, occasion) + scoreColors(t, b, s) + (acc ? 1 : 0);
    combos.push({ top: t, bottom: b, shoes: s, accessory: acc, score });
  }
  combos.sort((a, b) => b.score - a.score);
  return combos.slice(0, 3).map((c) => ({
    items: { 
      topId: c.top.id, 
      bottomId: c.bottom.id, 
      shoesId: c.shoes.id, 
      accessoryIds: c.accessory ? [c.accessory.id] : [] 
    },
    score: c.score
  }));
}

function filterByTemp(items: Item[], temp?: number) {
  if (temp == null) return items;
  return items.filter((i) => {
    const f = i.formality ?? 3;
    if (temp < 10) return f >= 3;
    if (temp > 23) return f <= 3;
    return true;
  });
}

function scoreFormality(t: Item, b: Item, s: Item, occasion: Occasion) {
  const target = occasion === 'work' ? 3 : occasion === 'date' ? 3 : 2;
  const f = (i: Item) => i.formality ?? target;
  const delta = Math.abs((f(t) + f(b) + f(s)) / 3 - target);
  return Math.max(0, 10 - delta * 3);
}

function scoreColors(t: Item, b: Item, _s: Item) {
  // Для офиса: темные низы + нейтральные верха (синий/серый/белый)
  const darkBottoms = ['navy', 'black', 'gray', 'charcoal'];
  const safeTops = ['white', 'lightgray', 'blue', 'lightblue'];
  
  let score = 0;
  if (darkBottoms.includes(b.color?.toLowerCase() || '')) score += 3;
  if (safeTops.includes(t.color?.toLowerCase() || '')) score += 2;
  if (t.color === b.color) score -= 5; // один цвет = плохо
  return Math.max(0, score);
}