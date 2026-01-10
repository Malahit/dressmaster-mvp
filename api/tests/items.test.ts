import { describe, it, expect, beforeEach, vi } from 'vitest';
import Fastify from 'fastify';
import itemsRoutes from '../src/routes/items.js';

describe('items routes', () => {
  let app: any;
  let mockPrisma: any;
  let userId: string;

  beforeEach(async () => {
    userId = 'test-user-123';
    
    mockPrisma = {
      item: {
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
      }
    };

    app = Fastify();
    app.decorate('prisma', mockPrisma);
    app.decorate('authenticate', async (request: any) => {
      request.user = { id: userId };
    });
    await app.register(itemsRoutes);
  });

  describe('GET /items', () => {
    it('returns all items for authenticated user', async () => {
      const mockItems = [
        { id: '1', userId, category: 'top', color: 'blue' },
        { id: '2', userId, category: 'bottom', color: 'black' }
      ];
      mockPrisma.item.findMany.mockResolvedValue(mockItems);

      const res = await app.inject({ method: 'GET', url: '/items' });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual(mockItems);
      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        where: { userId }
      });
    });

    it('filters items by category', async () => {
      const mockItems = [{ id: '1', userId, category: 'top', color: 'blue' }];
      mockPrisma.item.findMany.mockResolvedValue(mockItems);

      const res = await app.inject({ 
        method: 'GET', 
        url: '/items?category=top' 
      });

      expect(res.statusCode).toBe(200);
      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        where: { userId, category: 'top' }
      });
    });

    it('filters items by color', async () => {
      mockPrisma.item.findMany.mockResolvedValue([]);

      const res = await app.inject({ 
        method: 'GET', 
        url: '/items?color=blue' 
      });

      expect(res.statusCode).toBe(200);
      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        where: { userId, color: 'blue' }
      });
    });

    it('filters items by season', async () => {
      mockPrisma.item.findMany.mockResolvedValue([]);

      const res = await app.inject({ 
        method: 'GET', 
        url: '/items?season=S' 
      });

      expect(res.statusCode).toBe(200);
      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        where: { userId, season: 'S' }
      });
    });

    it('filters items by multiple criteria', async () => {
      mockPrisma.item.findMany.mockResolvedValue([]);

      const res = await app.inject({ 
        method: 'GET', 
        url: '/items?category=top&color=blue&season=S' 
      });

      expect(res.statusCode).toBe(200);
      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        where: { userId, category: 'top', color: 'blue', season: 'S' }
      });
    });
  });

  describe('GET /items/summary', () => {
    it('returns wardrobe summary', async () => {
      const mockItems = [
        { id: '1', userId, category: 'top', color: 'blue', season: 'S' },
        { id: '2', userId, category: 'top', color: 'red', season: 'W' },
        { id: '3', userId, category: 'bottom', color: 'black', season: 'S' },
        { id: '4', userId, category: 'shoes', color: 'brown', season: null },
        { id: '5', userId, category: 'accessory', color: 'silver', season: 'SS' }
      ];
      mockPrisma.item.findMany.mockResolvedValue(mockItems);

      const res = await app.inject({ method: 'GET', url: '/items/summary' });

      expect(res.statusCode).toBe(200);
      const summary = res.json();
      
      expect(summary.totalItems).toBe(5);
      expect(summary.byCategory).toEqual({
        top: 2,
        bottom: 1,
        shoes: 1,
        accessory: 1
      });
      expect(summary.bySeason).toEqual({
        S: 2,
        W: 1,
        SS: 1
      });
      expect(summary.byColor.blue).toBe(1);
      expect(summary.byColor.red).toBe(1);
      expect(summary.byColor.black).toBe(1);
      expect(summary.diversity.categories).toBe(4);
      expect(summary.diversity.seasons).toBe(3);
      expect(summary.diversity.colors).toBe(5);
    });

    it('returns empty summary for no items', async () => {
      mockPrisma.item.findMany.mockResolvedValue([]);

      const res = await app.inject({ method: 'GET', url: '/items/summary' });

      expect(res.statusCode).toBe(200);
      const summary = res.json();
      
      expect(summary.totalItems).toBe(0);
      expect(summary.byCategory).toEqual({
        top: 0,
        bottom: 0,
        shoes: 0,
        accessory: 0
      });
      expect(summary.diversity.categories).toBe(0);
      expect(summary.diversity.seasons).toBe(0);
      expect(summary.diversity.colors).toBe(0);
    });
  });

  describe('POST /items', () => {
    it('creates a new item', async () => {
      const newItem = { category: 'top', color: 'blue', season: 'S' };
      const createdItem = { id: '1', userId, ...newItem };
      mockPrisma.item.create.mockResolvedValue(createdItem);

      const res = await app.inject({
        method: 'POST',
        url: '/items',
        payload: newItem
      });

      expect(res.statusCode).toBe(201);
      expect(res.json()).toEqual(createdItem);
    });

    it('returns 400 for invalid item data', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/items',
        payload: { category: 'invalid' }
      });

      expect(res.statusCode).toBe(400);
      expect(res.json()).toEqual({ error: 'invalid_body' });
    });
  });

  describe('PATCH /items/:id', () => {
    it('updates an existing item', async () => {
      const updatedItem = { id: '1', userId, category: 'top', color: 'red' };
      mockPrisma.item.update.mockResolvedValue(updatedItem);

      const res = await app.inject({
        method: 'PATCH',
        url: '/items/1',
        payload: { color: 'red' }
      });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual(updatedItem);
      expect(mockPrisma.item.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { color: 'red' }
      });
    });
  });

  describe('DELETE /items/:id', () => {
    it('deletes an item', async () => {
      mockPrisma.item.delete.mockResolvedValue({});

      const res = await app.inject({
        method: 'DELETE',
        url: '/items/1'
      });

      expect(res.statusCode).toBe(204);
      expect(mockPrisma.item.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
    });
  });
});
