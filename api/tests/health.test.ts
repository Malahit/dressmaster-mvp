import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';
import healthRoutes from '../src/routes/health.js';

describe('health', () => {
  it('returns ok', async () => {
    const app = Fastify();
    await app.register(healthRoutes);
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });
});
