# DressMaster MVP - Project Structure

This document provides a comprehensive overview of all files and directories in the DressMaster MVP project.

## Project Overview

DressMaster MVP is a monorepo project consisting of:
- **API**: Backend service built with Fastify and Prisma
- **Mobile**: React Native mobile application
- **Docs**: Project documentation
- **Infra**: Infrastructure configuration

## Directory Structure

```
dressmaster-mvp/
├── .github/                          # GitHub configuration
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md            # Bug report template
│   │   └── deploy_checklist.md      # Deployment checklist template
│   ├── PULL_REQUEST_TEMPLATE.md     # PR template
│   └── workflows/                    # GitHub Actions workflows
│       ├── api-ci.yml               # API CI pipeline
│       ├── deploy-api.yml           # API deployment pipeline
│       └── mobile-ci.yml            # Mobile CI pipeline
│
├── api/                              # Backend API service
│   ├── prisma/                       # Database configuration
│   │   ├── schema.prisma            # Prisma database schema
│   │   └── seed.ts                  # Database seed file
│   ├── src/                          # Source code
│   │   ├── plugins/                  # Fastify plugins
│   │   │   ├── auth.ts              # Authentication plugin
│   │   │   └── prisma.ts            # Prisma plugin
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.ts              # Authentication routes
│   │   │   ├── calendar.ts          # Calendar routes
│   │   │   ├── health.ts            # Health check routes
│   │   │   ├── items.ts             # Wardrobe items routes
│   │   │   └── outfits.ts           # Outfits routes
│   │   ├── services/                 # Business logic services
│   │   │   └── generator.ts         # Outfit generation service
│   │   ├── env.ts                    # Environment configuration
│   │   └── index.ts                  # API entry point
│   ├── tests/                        # Test files
│   │   └── health.test.ts           # Health check tests
│   ├── .env.example                  # Example environment variables
│   ├── Dockerfile                    # Docker configuration
│   ├── README.md                     # API documentation
│   ├── package.json                  # API dependencies
│   └── tsconfig.json                 # TypeScript configuration
│
├── mobile/                           # React Native mobile app
│   ├── src/                          # Source code
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Button.tsx           # Button component
│   │   │   ├── Card.tsx             # Card component
│   │   │   └── Input.tsx            # Input component
│   │   ├── navigation/               # Navigation configuration
│   │   │   └── index.tsx            # Navigation setup
│   │   ├── screens/                  # App screens
│   │   │   ├── GenerateScreen.tsx   # Outfit generation screen
│   │   │   ├── ItemsScreen.tsx      # Wardrobe items screen
│   │   │   └── OnboardingScreen.tsx # Onboarding screen
│   │   ├── services/                 # API services
│   │   │   └── api.ts               # API client
│   │   ├── store/                    # State management
│   │   │   └── useAuth.ts           # Authentication store
│   │   ├── utils/                    # Utility functions
│   │   │   └── colors.ts            # Color definitions
│   │   └── App.tsx                   # App entry point
│   ├── .env.example                  # Example environment variables
│   ├── app.json                      # Expo configuration
│   ├── babel.config.js               # Babel configuration
│   ├── package.json                  # Mobile dependencies
│   └── tsconfig.json                 # TypeScript configuration
│
├── docs/                             # Project documentation
│   ├── ROADMAP.md                    # Project roadmap
│   ├── api-spec.md                   # API specification
│   ├── architecture.md               # Architecture documentation
│   ├── data-model.md                 # Data model documentation
│   └── product-brief.md              # Product brief
│
├── infra/                            # Infrastructure
│   └── docker-compose.yml           # Docker Compose configuration
│
├── .editorconfig                     # Editor configuration
├── .eslintignore                     # ESLint ignore rules
├── .eslintrc.js                      # ESLint configuration
├── .gitignore                        # Git ignore rules
├── .nvmrc                            # Node version specification
├── .prettierrc                       # Prettier configuration
├── LICENSE                           # Project license
├── README.md                         # Main project README
├── package.json                      # Root package configuration
├── pnpm-workspace.yaml              # PNPM workspace configuration
└── render.yaml                       # Render deployment configuration
```

## Technology Stack

### Backend (API)
- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Testing**: Jest/Vitest

### Frontend (Mobile)
- **Framework**: React Native
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Zustand (useAuth)
- **Build Tool**: Expo

### Infrastructure
- **Container**: Docker
- **Orchestration**: Docker Compose
- **Deployment**: Render.com
- **CI/CD**: GitHub Actions

## Database Schema

The project uses PostgreSQL with the following main models:

1. **User** - User accounts
2. **Item** - Wardrobe items (clothes, shoes, accessories)
3. **Outfit** - Generated outfit combinations
4. **CalendarEntry** - Planned outfits for specific dates
5. **Feedback** - User feedback on generated outfits

### Item Categories
- `top` - Tops (shirts, sweaters, etc.)
- `bottom` - Bottoms (pants, skirts, etc.)
- `shoes` - Footwear
- `accessory` - Accessories

## Key Features

1. **Authentication** - User registration and login
2. **Wardrobe Management** - Add, view, and manage clothing items
3. **Outfit Generation** - AI-powered outfit suggestions
4. **Calendar** - Plan outfits for specific dates
5. **Feedback System** - Like/dislike outfit suggestions

## Development Scripts

From the root directory:
- `pnpm dev:api` - Start API in development mode
- `pnpm dev:mobile` - Start mobile app
- `pnpm build:api` - Build API for production
- `pnpm lint` - Lint all projects
- `pnpm test` - Run API tests

## Package Manager

The project uses **PNPM** (version 9.0.0) with workspace support for managing the monorepo.
