import { FastifyInstance } from 'fastify';
import { z } from 'zod';

const itemSchema = z.object({
  category: z.enum(['top', 'bottom', 'shoes', 'accessory']),
  color: z.string().optional(),
  season: z.string().optional(), // 'S'|'F'|'W'|'SS'
  formality: z.number().min(1).max(5).optional(),
  imageUrl: z.string().url().optional()
});

export default async function itemsRoutes(app: FastifyInstance) {
  app.get('/items', { preHandler: [app.authenticate] }, async (req: any) => {
    const items = await app.prisma.item.findMany({ where: { userId: req.user.id } });
    return items;
  });

  app.post('/items', { preHandler: [app.authenticate] }, async (req: any, reply) => {
    const parsed = itemSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_body' });
    const item = await app.prisma.item.create({
      data: { ...parsed.data, userId: req.user.id }
    });
    reply.code(201);
    return item;
  });

  app.patch('/items/:id', { preHandler: [app.authenticate] }, async (req: any, reply) => {
    const { id } = req.params as { id: string };
    const parsed = itemSchema.partial().safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_body' });
    const updated = await app.prisma.item.update({
      where: { id },
      data: parsed.data
    });
    return updated;
  });

  app.delete('/items/:id', { preHandler: [app.authenticate] }, async (req: any, reply) => {
    const { id } = req.params as { id: string };
    await app.prisma.item.delete({ where: { id } });
    reply.code(204).send();
  });
}
