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

### API CI Workflow
- **Purpose:** Automate testing and deployment for the API service.
- **Configuration:** Defined in `.github/workflows/api.yml`
  - Runs tests upon `push` and `pull request` events.
  - Deploys to staging on successful tests.
  
### Mobile CI Workflow
- **Purpose:** Continuous integration pipeline for the Mobile application.
- **Configuration:** Defined in `.github/workflows/mobile.yml`
  - Checks syntax and runs automated tests upon repository events.
  - Builds mobile app release artifacts.

### General Information
- Workflows are managed through GitHub Actions.
- Ensure any new features update their respective directories and workflows to automate validations.