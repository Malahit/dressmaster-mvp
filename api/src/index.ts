import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import prismaPlugin from './plugins/prisma.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import itemsRoutes from './routes/items.js';
import outfitsRoutes from './routes/outfits.js';
import calendarRoutes from './routes/calendar.js';
import 'dotenv/config';

const PORT = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'PLEASE_SET_JWT_SECRET';

type AuthenticatedRequest = FastifyRequest & { user: { id: string; email: string } };

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(jwt, { secret: JWT_SECRET });
await app.register(prismaPlugin);

app.decorate('authenticate', async (request: AuthenticatedRequest, reply: FastifyReply) => {
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
