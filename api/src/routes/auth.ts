import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default async function authRoutes(app: FastifyInstance) {
  // Rate limiting configuration for auth routes
  const rateLimitConfig = {
    max: 5, // max 5 requests
    timeWindow: '15 minutes' // per 15 minutes
  };

  app.post('/auth/register', { config: { rateLimit: rateLimitConfig } }, async (req, reply) => {
    const parsed = credsSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_body' });
    const { email, password } = parsed.data;

    const existing = await app.prisma.user.findUnique({ where: { email } });
    if (existing) return reply.code(409).send({ error: 'email_exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await app.prisma.user.create({ data: { email, passwordHash } });
    const token = app.jwt.sign({ id: user.id, email: user.email });
    return { token };
  });

  app.post('/auth/login', { config: { rateLimit: rateLimitConfig } }, async (req, reply) => {
    const parsed = credsSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_body' });
    const { email, password } = parsed.data;

    const user = await app.prisma.user.findUnique({ where: { email } });
    if (!user) return reply.code(401).send({ error: 'invalid_credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return reply.code(401).send({ error: 'invalid_credentials' });

    const token = app.jwt.sign({ id: user.id, email: user.email });
    return { token };
  });

  app.get('/me', { preHandler: [app.authenticate] }, async (req: any) => {
    return { id: req.user.id, email: req.user.email };
  });
}
