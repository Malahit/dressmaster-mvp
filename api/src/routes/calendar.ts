import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';

type CalendarQuery = { month?: string };
type AuthRequest = FastifyRequest<{ Querystring: CalendarQuery }> & {
  user: { id: string };
  query: CalendarQuery;
};

export default async function calendarRoutes(app: FastifyInstance) {
  app.get('/calendar', { preHandler: [app.authenticate] }, async (req: AuthRequest, reply) => {
    const schema = z.object({ month: z.string().regex(/^\d{4}-\d{2}$/) }).partial();
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_query' });

    const where: { userId: string; date?: { gte: Date; lt: Date } } = { userId: req.user.id };
    if (parsed.data.month) {
      const [y, m] = parsed.data.month.split('-').map((n) => parseInt(n, 10));
      const start = new Date(Date.UTC(y, m - 1, 1));
      const end = new Date(Date.UTC(y, m, 1));
      where.date = { gte: start, lt: end };
    }

    return app.prisma.calendarEntry.findMany({ where });
  });

  app.post('/calendar', { preHandler: [app.authenticate] }, async (req: AuthRequest, reply) => {
    const schema = z.object({
      date: z.string(), // ISO date
      outfitId: z.string()
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_body' });

    const entry = await app.prisma.calendarEntry.create({
      data: {
        userId: req.user.id,
        outfitId: parsed.data.outfitId,
        date: new Date(parsed.data.date)
      }
    });

    reply.code(201);
    return entry;
  });

  app.delete('/calendar/:id', { preHandler: [app.authenticate] }, async (req: AuthRequest, reply) => {
    const { id } = req.params as { id: string };
    await app.prisma.calendarEntry.delete({ where: { id } });
    reply.code(204).send();
  });
}
