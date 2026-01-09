import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export default async function calendarRoutes(app: FastifyInstance) {
  app.get('/calendar', { preHandler: [app.authenticate] }, async (req: any, reply) => {
    const schema = z.object({ month: z.string().regex(/^\d{4}-\d{2}$/) }).partial();
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_query' });

    const where: any = { userId: req.user.id };
    if (parsed.data.month) {
      const [y, m] = parsed.data.month.split('-').map((n) => parseInt(n, 10));
      const start = new Date(Date.UTC(y, m - 1, 1));
      const end = new Date(Date.UTC(y, m, 1));
      where.date = { gte: start, lt: end };
    }

    return app.prisma.calendarEntry.findMany({ where });
  });

  app.post('/calendar', { preHandler: [app.authenticate] }, async (req: any, reply) => {
    const schema = z.object({
      date: z.string(), // ISO date
      outfitId: z.string()
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_body' });

    // Verify the outfit belongs to the user
    const outfit = await app.prisma.outfit.findUnique({
      where: { id: parsed.data.outfitId }
    });
    
    if (!outfit) return reply.code(404).send({ error: 'outfit_not_found' });
    if (outfit.userId !== req.user.id) return reply.code(403).send({ error: 'forbidden' });

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

  app.delete('/calendar/:id', { preHandler: [app.authenticate] }, async (req: any, reply) => {
    const { id } = req.params as { id: string };
    
    // Verify ownership before deleting
    const entry = await app.prisma.calendarEntry.findUnique({ where: { id } });
    if (!entry) return reply.code(404).send({ error: 'entry_not_found' });
    if (entry.userId !== req.user.id) return reply.code(403).send({ error: 'forbidden' });
    
    await app.prisma.calendarEntry.delete({ where: { id } });
    reply.code(204).send();
  });
}
