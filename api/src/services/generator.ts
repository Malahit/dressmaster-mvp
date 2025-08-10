import type { Item } from '@prisma/client';

type Occasion = 'work' | 'date' | 'sport';

export function generateOutfits(
  items: Item[],
  occasion: Occasion,
  temp?: number,
) {
  const tops = items.filter((i) => i.category === 'top');
  const bottoms = items.filter((i) => i.category === 'bottom');
  const shoes = items.filter((i) => i.category === 'shoes');
  const accessories = items.filter((i) => i.category === 'accessory');

  // simple filters by season and temp (placeholder)
  const filteredTop = filterByTemp(tops, temp);
  const filteredBottom = filterByTemp(bottoms, temp);
  const filteredShoes = filterByTemp(shoes, temp);

  const combos: { top: Item; bottom: Item; shoes: Item; accessory?: Item; score: number }[] = [];

  for (const t of filteredTop) {
    for (const b of filteredBottom) {
      for (const s of filteredShoes) {
        const acc = accessories[0]; // optional: first accessory
        const score =
          scoreFormality(t, b, s, occasion) +
          scoreColors(t, b, s) +
          (acc ? 1 : 0);
        combos.push({ top: t, bottom: b, shoes: s, accessory: acc, score });
      }
    }
  }

  combos.sort((a, b) => b.score - a.score);
  return combos.slice(0, 3).map((c) => ({
    items: { topId: c.top.id, bottomId: c.bottom.id, shoesId: c.shoes.id, accessoryIds: c.accessory ? [c.accessory.id] : [] },
    score: c.score
  }));
}

function filterByTemp(items: Item[], temp?: number) {
  if (temp == null) return items;
  // naive: if cold (<10C) prefer formality>=3 (тёплые слои предполагаются)
  return items.filter((i) => {
    if (!i.formality) return true;
    if (temp < 10) return i.formality >= 3;
    if (temp > 23) return i.formality <= 3;
    return true;
  });
}

function scoreFormality(t: Item, b: Item, s: Item, occasion: Occasion) {
  const target = occasion === 'work' ? 3 : occasion === 'date' ? 3 : 2;
  const f = (i: Item) => i.formality ?? target;
  const delta = Math.abs((f(t) + f(b) + f(s)) / 3 - target);
  return Math.max(0, 10 - delta * 3);
}

function scoreColors(_t: Item, _b: Item, _s: Item) {
  // placeholder: neutral colors get small bonus
  return 2;
}
