# dressmaster-mvp
dressmaster-mvp/
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  │  ├─ bug_report.md
│  │  └─ feature_request.md
│  ├─ PULL_REQUEST_TEMPLATE.md
│  └─ workflows/
│     ├─ api-ci.yml
│     └─ mobile-ci.yml
├─ api/
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  └─ seed.ts
│  ├─ src/
│  │  ├─ index.ts
│  │  ├─ env.ts
│  │  ├─ plugins/
│  │  │  ├─ prisma.ts
│  │  │  └─ auth.ts
│  │  ├─ routes/
│  │  │  ├─ health.ts
│  │  │  ├─ auth.ts
│  │  │  ├─ items.ts
│  │  │  ├─ outfits.ts
│  │  │  └─ calendar.ts
│  │  └─ services/
│  │     └─ generator.ts
│  ├─ tests/
│  │  └─ health.test.ts
│  ├─ .env.example
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ README.md
├─ mobile/
│  ├─ src/
│  │  ├─ App.tsx
│  │  ├─ navigation/
│  │  │  └─ index.tsx
│  │  ├─ screens/
│  │  │  ├─ OnboardingScreen.tsx
│  │  │  ├─ ItemsScreen.tsx
│  │  │  ├─ AddItemScreen.tsx
│  │  │  ├─ GenerateScreen.tsx
│  │  │  ├─ OutfitScreen.tsx
│  │  │  └─ CalendarScreen.tsx
│  │  ├─ components/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Card.tsx
│  │  │  └─ Input.tsx
│  │  ├─ services/
│  │  │  └─ api.ts
│  │  ├─ store/
│  │  │  └─ useAuth.ts
│  │  └─ utils/
│  │     └─ colors.ts
│  ├─ .env.example
│  ├─ app.json
│  ├─ babel.config.js
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ README.md
├─ docs/
│  ├─ ROADMAP.md
│  ├─ api-spec.md
│  ├─ data-model.md
│  ├─ architecture.md
│  └─ product-brief.md
├─ infra/
│  └─ docker-compose.yml
├─ .editorconfig
├─ .eslintignore
├─ .eslintrc.js
├─ .gitignore
├─ .nvmrc
├─ .prettierrc
├─ LICENSE
├─ README.md
├─ package.json
└─ pnpm-workspace.yaml
