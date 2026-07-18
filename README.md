# Indhan

Team Bourbon | Hack X '26

Project Indhan is a smart LPG cylinder monitoring system.

## Project Structure

- `docs/`: Contains the architecture, API spec, and pitch deck. The single source of truth for API contracts is in `docs/api-spec.md`.
- `backend/`: Node.js/Express backend providing the REST API.
- `ml-engine/`: Python-based ML engine for depletion regression, anomaly detection, and synthetic data generation.
- `frontend/`: React-based web dashboard.
- `shared/`: Shared types and interfaces.
- `scripts/`: Helper scripts for seeding demo data.

For details on the work split and API specifications, refer to [docs/api-spec.md](./docs/api-spec.md).

## Environment Setup

The backend expects specific environment variables to function correctly. Ensure you create a `.env` file in the `backend/` directory if you intend to customize the connection. By default, it will fall back to local MongoDB.

**`backend/.env`**
```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/indhan

# Server Port (default: 5000)
PORT=3000
```
*(Note: Ensure your MongoDB server is running locally or provide a valid Atlas URI).*

## Running the Application

This project is set up as a monorepo. You can install all dependencies and start the full stack (Frontend + Backend) with a single command from the root directory.

### 1. Install Dependencies
Make sure you have run `npm install` in both the `frontend/` and `backend/` directories, and then install the root dependencies:
```bash
npm install
```

### 2. Seed the Database
To ensure the dashboard has historical demo data to render immediately upon startup, run the seed script:
```bash
cd backend
npm run seed
cd ..
```

### 3. Start the Full Stack
Launch the backend and frontend simultaneously using `concurrently`:
```bash
npm start
```

The frontend will be available at `http://localhost:5173` and the backend will run at `http://localhost:3000`.
