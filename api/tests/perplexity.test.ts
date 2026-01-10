import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getPerplexityOutfitSuggestions } from '../src/services/perplexity.js';
import type { Item } from '@prisma/client';
import { env } from '../src/env.js';

describe('perplexity', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns null when API key is not configured', async () => {
    const originalKey = env.PERPLEXITY_API_KEY;
    env.PERPLEXITY_API_KEY = '';

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
      }
    ];

    const result = await getPerplexityOutfitSuggestions(items, 'work');
    expect(result).toBeNull();

    env.PERPLEXITY_API_KEY = originalKey;
  });

  it('returns null when API call fails', async () => {
    const originalKey = env.PERPLEXITY_API_KEY;
    env.PERPLEXITY_API_KEY = 'test-key';

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

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
      }
    ];

    const result = await getPerplexityOutfitSuggestions(items, 'work');
    expect(result).toBeNull();

    env.PERPLEXITY_API_KEY = originalKey;
  });

  it('parses valid Perplexity response correctly', async () => {
    const originalKey = env.PERPLEXITY_API_KEY;
    env.PERPLEXITY_API_KEY = 'test-key';

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

    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify([
              {
                topId: 'top1',
                bottomId: 'bottom1',
                shoesId: 'shoes1',
                accessoryIds: [],
                reasoning: 'Classic office look'
              }
            ])
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const result = await getPerplexityOutfitSuggestions(items, 'work');
    
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result![0].topId).toBe('top1');
    expect(result![0].reasoning).toBe('Classic office look');

    env.PERPLEXITY_API_KEY = originalKey;
  });
});
