FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY api/package.json api/
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY . .
RUN pnpm -C api prisma:generate && pnpm -C api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/api ./api
WORKDIR /app/api
EXPOSE 3000
CMD ["node", "dist/index.js"]
