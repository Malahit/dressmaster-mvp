import { describe, it, expect } from 'vitest';
import { generateOutfitsRuleBased } from '../src/services/generator.js';
import type { Item } from '@prisma/client';

describe('generator', () => {
  it('generates outfits using rule-based logic when items provided', () => {
    const items: Item[] = [
      {
        id: 'top1',
        userId: 'user1',
        category: 'top',
        color: 'white',
        season: 'SS',
        formality: 3,
        imageUrl: null,
        createdAt: new Date()
      },
      {
        id: 'bottom1',
        userId: 'user1',
        category: 'bottom',
        color: 'navy',
        season: 'SS',
        formality: 3,
        imageUrl: null,
        createdAt: new Date()
      },
      {
        id: 'shoes1',
        userId: 'user1',
        category: 'shoes',
        color: 'black',
        season: null,
        formality: 3,
        imageUrl: null,
        createdAt: new Date()
      }
    ];

    const outfits = generateOutfitsRuleBased(items, 'work');
    
    expect(outfits).toHaveLength(1);
    expect(outfits[0].items.topId).toBe('top1');
    expect(outfits[0].items.bottomId).toBe('bottom1');
    expect(outfits[0].items.shoesId).toBe('shoes1');
    expect(outfits[0].score).toBeGreaterThan(0);
  });

  it('returns empty array when no items provided', () => {
    const outfits = generateOutfitsRuleBased([], 'work');
    expect(outfits).toEqual([]);
  });
});
