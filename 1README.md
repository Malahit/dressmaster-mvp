# Dressmaster

Помощник, который собирает образы из вашего гардероба под событие и погоду — быстро и без стресса.

## Пакеты
- /api — Fastify + Prisma + PostgreSQL
- /mobile — Expo React Native
- /docs — спеки и дорожная карта

## Быстрый старт
1) Поднять Postgres (см. infra/docker-compose.yml)
2) API:
```bash
pnpm i
pnpm -C api prisma:generate
pnpm -C api dev
