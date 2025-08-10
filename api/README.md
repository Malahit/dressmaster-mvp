# Dressmaster API

Fastify-сервер, который управляет гардеробом, образами и календарём пользователя.

## Запуск

```bash
pnpm install
pnpm -C api prisma:migrate
pnpm -C api prisma:generate
pnpm -C api dev
