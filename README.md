# Dressmaster

Помощник, который собирает образы из вашего гардероба под событие и погоду — быстро и без стресса.

## Пакеты
- /api — Fastify + Prisma + PostgreSQL
- /mobile — Expo React Native
- /docs — спеки и дорожная карта

## Быстрый старт
1) Установите Node.js 20 (см. `.nvmrc`, можно выполнить `nvm use`) и включите pnpm через `corepack enable`.
2) Поднимите Postgres.
```bash
docker compose -f infra/docker-compose.yml up -d
```
3) Создайте файлы окружения (сразу пропишите корректный `API_BASE_URL` для мобильного клиента).
```bash
cp api/.env.example api/.env
cp mobile/.env.example mobile/.env
```
4) Установите зависимости и соберите Prisma Client.
```bash
pnpm install
pnpm -C api prisma:generate
pnpm -C api prisma:migrate   # локальные миграции
```
5) Запустите сервисы.
```bash
pnpm dev:api     # API на http://localhost:3000
pnpm dev:mobile  # Expo/Metro Bundler для мобильного клиента
```

## Проверки качества
- `pnpm test` — API тесты (Vitest)
- `pnpm lint` — ESLint для API и мобильного приложения

## Для прод-запуска
- Задайте безопасные значения `JWT_SECRET`, `DATABASE_URL`, `POSTHOG_*`.
- Для запуска API используйте `pnpm -C api build` и `pnpm -C api start` (применит миграции перед стартом).
- Используйте управляемую базу или тома для Postgres из `infra/docker-compose.yml`.

Полезные детали по доменной модели и API — в каталоге `docs/`.
