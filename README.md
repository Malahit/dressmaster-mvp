# DressMaster MVP

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

1. Clone the repository:
   ```bash
   git clone https://github.com/Malahit/dressmaster-mvp.git
   ```

2. Install dependencies:
   - API:
     ```bash
     cd api
     npm install
     ```
   - Mobile:
     ```bash
     cd mobile
     npm install
     ```

3. Run locally:
   - API:
     ```bash
     cd api
     npm start
     ```
   - Mobile:
     ```bash
     cd mobile
     npm run start
     ```

4. Access the app:
   - API: The backend will be running locally at `http://localhost:3000`
   - Mobile: Emulator or physical device will show the connected mobile app instance.

## CI/CD Workflows

This project uses GitHub Actions for continuous integration and deployment. There are three main workflows:

### API CI Workflow
- **Purpose:** Automate testing and linting for the API service
- **Configuration:** `.github/workflows/api-ci.yml`
- **Triggers:** Runs on every `push` and `pull_request` event
- **Steps:**
  1. Checkout code
  2. Setup Node.js 20
  3. Enable Corepack for pnpm
  4. Install dependencies with `pnpm install --frozen-lockfile`
  5. Generate Prisma client
  6. Run linter with `pnpm lint`
  7. Run tests with `pnpm test`

**Running API CI locally:**
```bash
cd api
pnpm install
pnpm prisma:generate
pnpm lint
pnpm test
```

### Mobile CI Workflow
- **Purpose:** Continuous integration pipeline for the mobile application
- **Configuration:** `.github/workflows/mobile-ci.yml`
- **Triggers:** Runs on every `push` and `pull_request` event
- **Steps:**
  1. Checkout code
  2. Setup Node.js 20
  3. Enable Corepack for pnpm
  4. Install dependencies with `pnpm install --frozen-lockfile`
  5. Run linter with `pnpm lint`
  6. Run tests with `pnpm test` (currently allows failures)

**Running Mobile CI locally:**
```bash
cd mobile
pnpm install
pnpm lint
pnpm test
```

### API Deployment Workflow
- **Purpose:** Automated deployment to production
- **Configuration:** `.github/workflows/deploy-api.yml`
- **Triggers:** Runs on push to `main` branch only
- **Steps:**
  1. Triggers Render.com deployment via webhook
  2. Uses `RENDER_DEPLOY_HOOK_URL` secret for authentication

**Note:** The deployment workflow is fully automated and requires no manual intervention. Ensure all tests pass before merging to main.

## API Integration

### Weather Data Integration

The DressMaster API includes temperature-based outfit recommendations. Currently, the temperature parameter is passed manually when generating outfits.

**Current Implementation:**
- The `/outfits/generate` endpoint accepts an optional `temp` parameter (number)
- Temperature is used to filter appropriate clothing items based on season/formality
- Temperature filtering logic:
  - `temp < 10°C`: Filters for warmer items (formality ≥ 3)
  - `temp > 23°C`: Filters for cooler items (formality ≤ 3)

**Example API Call:**
```bash
POST /outfits/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "occasion": "work",
  "temp": 15
}
```

**Future Integration:**
To integrate with external weather APIs (e.g., OpenWeatherMap, WeatherAPI):
1. Add weather API credentials to `.env` file
2. Create a weather service in `api/src/services/weather.ts`
3. Modify the outfit generation endpoint to fetch current temperature automatically
4. Install required dependencies: `pnpm add axios` (or preferred HTTP client)

### User Preferences Integration

User preferences are stored as attributes on wardrobe items and used during outfit generation:

**Item Attributes:**
- `category`: 'top' | 'bottom' | 'shoes' | 'accessory'
- `color`: String (e.g., 'navy', 'white', 'black')
- `season`: 'S' | 'F' | 'W' | 'SS' (Spring, Fall, Winter, Summer/Spring-Summer)
- `formality`: Number 1-5 (1=casual, 5=formal)
- `imageUrl`: Optional image reference

**How Preferences Are Used:**
1. **Formality Matching:** Algorithm matches item formality to occasion
   - Work/Date: Target formality ~3
   - Sport: Target formality ~2
2. **Color Coordination:** Preferences for color combinations
   - Avoids same color for top/bottom
   - Prefers dark bottoms (navy, black, gray) for office wear
   - Prefers neutral tops (white, blue, light gray) for work
3. **Season/Temperature:** Filters items appropriate for current weather

## Clothing Suggestion Algorithm

The outfit generation algorithm is implemented in `api/src/services/generator.ts` and uses a scoring system to rank outfit combinations.

### How It Works

1. **Item Filtering:**
   - Separates items by category (tops, bottoms, shoes, accessories)
   - Filters by temperature if provided
   - Only considers items from user's wardrobe

2. **Combination Generation:**
   - Creates all possible combinations of top + bottom + shoes
   - Optionally adds accessories

3. **Scoring System:**
   Each outfit receives a score based on three factors:

   **a) Formality Score (0-10 points)**
   - Calculates average formality of top, bottom, and shoes
   - Compares to target formality for the occasion:
     - Work: formality ~3
     - Date: formality ~3
     - Sport: formality ~2
   - Lower deviation = higher score

   **b) Color Harmony Score (0-5 points)**
   - +3 points for dark bottoms (navy, black, gray, charcoal)
   - +2 points for safe/neutral tops (white, lightgray, blue, lightblue)
   - -5 points if top and bottom are the same color

   **c) Accessory Bonus (+1 point)**
   - Adds 1 point if an accessory is included

4. **Ranking and Selection:**
   - Sorts all combinations by total score (descending)
   - Returns top 3 highest-scoring outfits

### Example Scoring

For a work occasion with temperature 18°C:
- Navy trousers + white shirt + black shoes = ~15 points (high formality match + good colors)
- Jeans + t-shirt + sneakers = ~5 points (formality mismatch)

### Algorithm Limitations (MVP)

- No machine learning or user feedback incorporation (planned for future)
- Simple rule-based scoring
- No consideration for patterns or textures
- Limited color matching rules

## Contributing

We welcome contributions to DressMaster! This section will help you get started with development.

### Development Environment Setup

**Prerequisites:**
- Node.js 20 or higher
- pnpm (enabled via Corepack)
- PostgreSQL (for API development)
- For mobile: Expo CLI and either iOS Simulator or Android Emulator

**Initial Setup:**

1. Clone the repository:
   ```bash
   git clone https://github.com/Malahit/dressmaster-mvp.git
   cd dressmaster-mvp
   ```

2. Install dependencies at the root:
   ```bash
   pnpm install
   ```

3. Set up the API:
   ```bash
   cd api
   cp .env.example .env
   # Edit .env with your database credentials and secrets
   pnpm prisma:migrate
   pnpm prisma:generate
   pnpm dev
   ```

4. Set up the mobile app:
   ```bash
   cd mobile
   cp .env.example .env
   # Edit .env with your API URL
   pnpm start
   ```

### Coding Standards

**TypeScript:**
- Use TypeScript for all new code
- Enable strict mode in `tsconfig.json`
- Avoid `any` types where possible

**Linting:**
- ESLint is configured for both API and mobile
- Run `pnpm lint` before committing
- Fix linting errors with `pnpm lint --fix` where possible

**Code Style:**
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Follow existing code patterns in each directory

**API-Specific:**
- Use Fastify plugins for route organization
- Validate all inputs with Zod schemas
- Use Prisma for all database operations
- Always use authentication middleware for protected routes

**Mobile-Specific:**
- Use functional components with hooks
- Follow React Navigation patterns
- Use Zustand for state management
- Store sensitive data with expo-secure-store

### Testing

**API Tests:**
```bash
cd api
pnpm test              # Run all tests
pnpm test -- --watch   # Watch mode for development
```

- Write unit tests for services (e.g., `generator.ts`)
- Write integration tests for API routes using Supertest
- Aim for >70% code coverage on new code

**Mobile Tests:**
```bash
cd mobile
pnpm test
```

Note: Mobile testing infrastructure is minimal in MVP. Focus on manual testing with Expo Go.

### Pull Request Process

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Run checks locally:**
   ```bash
   pnpm lint
   pnpm test
   ```

4. **Commit your changes:**
   - Use clear, descriptive commit messages
   - Reference issues where applicable

5. **Push and create PR:**
   - Push your branch to GitHub
   - Create a pull request with a clear description
   - Link any related issues

6. **Code review:**
   - Address reviewer feedback
   - Ensure CI passes
   - Wait for approval before merging

### Project Structure

Understanding the monorepo structure:

```
dressmaster-mvp/
├── api/                  # Fastify + Prisma backend
│   ├── src/
│   │   ├── routes/      # API route handlers
│   │   ├── services/    # Business logic (e.g., generator)
│   │   └── plugins/     # Fastify plugins
│   ├── prisma/          # Database schema and migrations
│   └── tests/           # API tests
├── mobile/              # React Native (Expo) mobile app
│   └── src/
│       ├── screens/     # Screen components
│       ├── components/  # Reusable components
│       └── stores/      # Zustand state management
├── docs/                # Additional documentation
└── .github/workflows/   # CI/CD configuration
```

## Additional Documentation

For more detailed information, please refer to the following documentation in the `docs/` folder:

- **[Architecture Overview](docs/architecture.md)** - Technical architecture, tech stack, and design decisions
- **[API Specification](docs/api-spec.md)** - Complete API endpoints, request/response formats
- **[Data Model](docs/data-model.md)** - Database schema and entity relationships
- **[Product Brief](docs/product-brief.md)** - Product vision and target users
- **[Roadmap](docs/ROADMAP.md)** - Development phases and milestones

### API-Specific Documentation

- **[API README](api/README.md)** - Backend-specific setup and development guide

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.