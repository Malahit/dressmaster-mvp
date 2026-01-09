# Dressmaster

Помощник, который собирает образы из вашего гардероба под событие и погоду — быстро и без стресса.

## Пакеты
- /api — Fastify + Prisma + PostgreSQL
- /mobile — Expo React Native
- /docs — спеки и дорожная карта

## Документация
- [WEAKNESSES.md](./WEAKNESSES.md) - Полный анализ слабых сторон проекта
- [SECURITY.md](./SECURITY.md) - Информация о безопасности и исправленных уязвимостях
- [docs/architecture.md](./docs/architecture.md) - Архитектура проекта
- [docs/ROADMAP.md](./docs/ROADMAP.md) - Дорожная карта развития

## Быстрый старт
1) Поднять Postgres (см. infra/docker-compose.yml)
2) API:
```bash
pnpm i
pnpm -C api prisma:generate
pnpm -C api dev
