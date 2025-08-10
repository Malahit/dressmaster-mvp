import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

export default fp(async (app) => {
  app.register(jwt, { secret: app.config.JWT_SECRET || 'PLEASE_SET_JWT_SECRET' } as any);

  app.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'unauthorized' });
    }
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
    config: any;
  }
  interface FastifyRequest {
    user: { id: string; email: string };
  }
}
