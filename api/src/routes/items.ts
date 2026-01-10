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
    const querySchema = z.object({
      category: z.enum(['top', 'bottom', 'shoes', 'accessory']).optional(),
      color: z.string().optional(),
      season: z.string().optional()
    });
    
    const filters = querySchema.parse(req.query);
    const where: any = { userId: req.user.id };
    
    if (filters.category) where.category = filters.category;
    if (filters.color) where.color = filters.color;
    if (filters.season) where.season = filters.season;
    
    const items = await app.prisma.item.findMany({ where });
    return items;
  });

  app.get('/items/summary', { preHandler: [app.authenticate] }, async (req: any) => {
    const items = await app.prisma.item.findMany({ where: { userId: req.user.id } });
    
    const summary = {
      totalItems: items.length,
      byCategory: {
        top: items.filter(i => i.category === 'top').length,
        bottom: items.filter(i => i.category === 'bottom').length,
        shoes: items.filter(i => i.category === 'shoes').length,
        accessory: items.filter(i => i.category === 'accessory').length
      },
      bySeason: items.reduce((acc: any, item) => {
        if (item.season) {
          acc[item.season] = (acc[item.season] || 0) + 1;
        }
        return acc;
      }, {}),
      byColor: items.reduce((acc: any, item) => {
        if (item.color) {
          acc[item.color] = (acc[item.color] || 0) + 1;
        }
        return acc;
      }, {}),
      diversity: {
        categories: Object.keys({
          top: items.filter(i => i.category === 'top').length,
          bottom: items.filter(i => i.category === 'bottom').length,
          shoes: items.filter(i => i.category === 'shoes').length,
          accessory: items.filter(i => i.category === 'accessory').length
        }).filter(k => items.filter(i => i.category === k).length > 0).length,
        seasons: Object.keys(items.reduce((acc: any, item) => {
          if (item.season) acc[item.season] = true;
          return acc;
        }, {})).length,
        colors: Object.keys(items.reduce((acc: any, item) => {
          if (item.color) acc[item.color] = true;
          return acc;
        }, {})).length
      }
    };
    
    return summary;
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
