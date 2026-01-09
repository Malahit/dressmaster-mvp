import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

type AppWithConfig = FastifyInstance & { config?: { JWT_SECRET?: string } };
type AuthRequest = FastifyRequest & { user: { id: string; email: string } };

export default fp(async (app: AppWithConfig) => {
  const secret = app.config?.JWT_SECRET || 'PLEASE_SET_JWT_SECRET';
  app.register(jwt, { secret });

  app.decorate('authenticate', async (request: AuthRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (_err) {
      reply.code(401).send({ error: 'unauthorized' });
    }
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: AuthRequest, reply: FastifyReply) => Promise<void>;
    config?: { JWT_SECRET?: string };
  }
  interface FastifyRequest {
    user: { id: string; email: string };
  }
}
