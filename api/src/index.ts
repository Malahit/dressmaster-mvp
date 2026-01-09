import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import prismaPlugin from './plugins/prisma.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import itemsRoutes from './routes/items.js';
import outfitsRoutes from './routes/outfits.js';
import calendarRoutes from './routes/calendar.js';
import 'dotenv/config';

const PORT = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Validate JWT_SECRET is set and strong
if (!JWT_SECRET || JWT_SECRET === 'PLEASE_SET_JWT_SECRET' || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set and at least 32 characters long');
}

const app = Fastify({ logger: true });

// Configure CORS - use specific origins in production
const corsOptions = CORS_ORIGIN 
  ? { origin: CORS_ORIGIN.split(',').map(o => o.trim()) }
  : { origin: true }; // Development fallback

await app.register(cors, corsOptions);
await app.register(rateLimit, {
  global: false // We'll enable it per-route where needed
});
await app.register(jwt, { secret: JWT_SECRET });
await app.register(prismaPlugin);

app.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch {
    reply.code(401).send({ error: 'unauthorized' });
  }
});

app.register(healthRoutes);
app.register(authRoutes);
app.register(itemsRoutes);
app.register(outfitsRoutes);
app.register(calendarRoutes);

app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  app.log.info(`API listening on :${PORT}`);
});
