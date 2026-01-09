import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import prismaPlugin from './plugins/prisma.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import itemsRoutes from './routes/items.js';
import outfitsRoutes from './routes/outfits.js';
import calendarRoutes from './routes/calendar.js';
import { env } from './env.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(jwt, { secret: env.JWT_SECRET });
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

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  app.log.info(`API listening on :${env.PORT}`);
});
