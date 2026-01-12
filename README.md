# DressMaster MVP

A smart wardrobe management and outfit planning application that helps users organize their clothing items and generate outfit suggestions.

## Technology Stack

### Backend (API)
- **Runtime:** Node.js 20
- **Framework:** Fastify (high-performance web framework)
- **Database:** PostgreSQL 15
- **ORM:** Prisma
- **Language:** TypeScript
- **Authentication:** JWT (JSON Web Tokens)
- **Testing:** Vitest
- **Linting:** ESLint

### Mobile Application
- **Framework:** React Native
- **Platform:** Expo (~50.0.6)
- **Language:** TypeScript
- **Navigation:** React Navigation
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Analytics:** PostHog
- **Linting:** ESLint

### DevOps & Infrastructure
- **Package Manager:** pnpm
- **CI/CD:** GitHub Actions
- **Deployment:** Render.com (API), Expo EAS (Mobile)
- **Containerization:** Docker
- **Database Hosting:** PostgreSQL (via Docker or cloud provider)

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **Authentication** |
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT token | No |
| GET | `/me` | Get current user info | Yes |
| **Items Management** |
| GET | `/items` | List all wardrobe items | Yes |
| POST | `/items` | Create a new item | Yes |
| PATCH | `/items/:id` | Update an item | Yes |
| DELETE | `/items/:id` | Delete an item | Yes |
| **Outfits** |
| POST | `/outfits/generate` | Generate outfit suggestions | Yes |
| POST | `/outfits` | Save a custom outfit | Yes |
| GET | `/outfits` | List all saved outfits | Yes |
| **Calendar** |
| GET | `/calendar` | Get calendar entries (optional month filter) | Yes |
| POST | `/calendar` | Schedule an outfit for a date | Yes |
| DELETE | `/calendar/:id` | Delete a calendar entry | Yes |
| **Health** |
| GET | `/health` | Health check endpoint | No |

For detailed API documentation with request/response examples and curl commands, see [API Documentation](./docs/api.md).

## Project Structure

```
project-root/
│
├── api/                 # Backend API implementation
├── mobile/              # Mobile application source code
├── ci-scripts/          # Common CI/CD scripts
└── ...                  # Other supporting folders
```
- **API Directory:** Contains all files related to the backend API service for the DressMaster MVP.
- **Mobile Directory:** Houses the mobile app implemented for DressMaster MVP.
- **CI Scripts:** Scripts related to automated integration, testing, and deployment.

## Development Quick Start

### Prerequisites
- Node.js 20 or higher
- pnpm (enabled via corepack)
- Docker and Docker Compose (for local database)

### 1. Clone the repository
```bash
git clone https://github.com/Malahit/dressmaster-mvp.git
cd dressmaster-mvp
```

### 2. Setup PostgreSQL Database with Docker

The easiest way to run PostgreSQL locally is using Docker Compose:

```bash
cd infra
docker-compose up -d
```

This will start a PostgreSQL 15 container with:
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `dressmaster`
- **User:** `dressmaster`
- **Password:** `dressmaster`

The database data will persist in a Docker volume named `pgdata`.

**Alternative: Manual PostgreSQL Setup**

If you prefer to install PostgreSQL manually:

1. Install PostgreSQL 15 or higher
2. Create a database named `dressmaster`
3. Update your `.env` file with your database connection string

**Database Connection String Format:**
```
DATABASE_URL="postgresql://username:password@localhost:5432/dressmaster"
```

### 3. Setup and Run the API

```bash
cd api

# Copy environment variables template
cp .env.example .env

# Update .env with your configuration
# DATABASE_URL=postgresql://dressmaster:dressmaster@localhost:5432/dressmaster
# JWT_SECRET=your-secret-key-here

# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# (Optional) Seed the database with sample data
pnpm prisma:seed

# Start the development server
pnpm dev
```

The API will be running at `http://localhost:3000`

**API Management Commands:**
```bash
pnpm lint          # Run ESLint
pnpm test          # Run tests
pnpm build         # Build for production
pnpm start         # Start production server
```

### 4. Setup and Run the Mobile App

```bash
cd mobile

# Copy environment variables template
cp .env.example .env

# Update .env with your API URL
# API_BASE_URL=http://localhost:3000 (or your deployed API URL)

# Install dependencies
pnpm install

# Start Expo development server
pnpm start
```

**Mobile Development Commands:**
```bash
pnpm start         # Start Expo dev server
pnpm android       # Run on Android emulator/device
pnpm ios           # Run on iOS simulator/device
pnpm lint          # Run ESLint
pnpm test          # Run tests
```

**Note:** For iOS development, you need a Mac with Xcode installed.

### 5. Access the Application

- **API:** `http://localhost:3000`
- **Mobile:** Scan the QR code from Expo Go app or run on emulator/simulator
- **API Health Check:** `http://localhost:3000/health`

### Stopping the Database

To stop the PostgreSQL container:

```bash
cd infra
docker-compose down
```

To stop and remove the database data:

```bash
cd infra
docker-compose down -v
```

## CI/CD Workflows

### API CI Workflow
- **Purpose:** Automate testing, linting, and deployment for the API service.
- **Configuration:** Defined in `.github/workflows/api-ci.yml`
- **Triggers:** Runs on `push` and `pull_request` events.
- **Steps:**
  1. Lint code with ESLint
  2. Run tests with coverage check (80% threshold required)
  3. Deploy to Render.com free tier (only on `main` branch)
- **Requirements:**
  - GitHub Secret: `RENDER_DEPLOY_HOOK_URL` (for automatic deployment)

### Mobile CI Workflow
- **Purpose:** Continuous integration and build pipeline for the Mobile application.
- **Configuration:** Defined in `.github/workflows/mobile-ci.yml`
- **Triggers:** Runs on `push` and `pull_request` events.
- **Steps:**
  1. Lint code with ESLint
  2. Run tests
  3. Build mobile app with Expo EAS Build (only on `main` branch)
- **Requirements:**
  - GitHub Secret: `EXPO_TOKEN` (for EAS Build authentication)
  
### Deploy API Workflow
- **Purpose:** Dedicated deployment workflow for production API.
- **Configuration:** Defined in `.github/workflows/deploy-api.yml`
- **Triggers:** Runs on push to `main` branch.
- **Steps:**
  1. Trigger Render deployment via webhook

### General Information
- Workflows are managed through GitHub Actions.
- Ensure any new features update their respective directories and workflows to automate validations.
- All secrets should be configured in the repository settings under Settings → Secrets and variables → Actions.