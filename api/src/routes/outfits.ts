import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { generateOutfits } from '../services/generator.js';

type AuthRequest = FastifyRequest & { user: { id: string } };

export default async function outfitsRoutes(app: FastifyInstance) {
  app.post('/outfits/generate', { preHandler: [app.authenticate] }, async (req: AuthRequest, reply) => {
    const schema = z.object({
      occasion: z.enum(['work', 'date', 'sport']),
      temp: z.number().optional()
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_body' });

    const items = await app.prisma.item.findMany({ where: { userId: req.user.id } });
    const gen = generateOutfits(items, parsed.data.occasion, parsed.data.temp);
    reply.code(200);
    return gen;
  });

  app.post('/outfits', { preHandler: [app.authenticate] }, async (req: AuthRequest, reply) => {
    const schema = z.object({
      items: z.object({
        topId: z.string(),
        bottomId: z.string(),
        shoesId: z.string(),
        accessoryIds: z.array(z.string()).optional()
      }),
      occasion: z.string().optional()
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_body' });

    const outfit = await app.prisma.outfit.create({
      data: {
        userId: req.user.id,
        topId: parsed.data.items.topId,
        bottomId: parsed.data.items.bottomId,
        shoesId: parsed.data.items.shoesId,
        accessoryIds: parsed.data.items.accessoryIds ?? [],
        occasion: parsed.data.occasion
      }
    });
    reply.code(201);
    return outfit;
  });

  app.get('/outfits', { preHandler: [app.authenticate] }, async (req: AuthRequest) => {
    return app.prisma.outfit.findMany({ where: { userId: req.user.id } });
  });
}
