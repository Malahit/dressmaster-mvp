# Архитектура

Монорепо (pnpm workspaces):
- API: Fastify + Prisma + Postgres, JWT auth
- Mobile: Expo RN + React Navigation + Zustand + Axios
- Аналитика: PostHog (клиент в mobile)

Важное:
- Простые правила генерации (без ML на MVP)
- Загрузка фото на этапе MVP — локально/заглушка, позже S3
