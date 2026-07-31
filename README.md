# 🔥 Indhan

**Smart LPG Cylinder Monitoring System**  
*Team Bourbon — Hack X '26*

Indhan ("fuel" in Hindi) is a full-stack IoT-inspired platform that turns raw weight-sensor data from an LPG cylinder into actionable intelligence: real-time depletion forecasts, anomaly alerts (leaks, spikes, drops), and cost projections — all on a live web dashboard.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Depletion Prediction** | Linear-regression model estimates days remaining and projected empty date with a confidence score |
| **Anomaly Detection** | Z-score + rate-of-change heuristics flag leaks, weight spikes, and sudden drops |
| **Cost Intelligence** | Projects daily and monthly LPG spend based on live burn-rate and current market price (₹/kg) |
| **Usage Patterns** | Identifies peak consumption hours and baseline burn-rate |
| **Live Dashboard** | React web app with real-time weight trend charts and per-cylinder drill-downs |
| **Simulation Panel** | Seed or inject demo readings directly from the UI without touching the database |
| **Auth** | JWT-based register/login flow with bcrypt password hashing |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│            React + Vite Dashboard (port 5173)               │
│   Dashboard · CylinderDetail · Login · SimulationPanel      │
└────────────────────────┬────────────────────────────────────┘
                         │  REST API (axios)
┌────────────────────────▼────────────────────────────────────┐
│               Node.js / Express Backend (port 3000)         │
│   Routes → Controllers → Services → Mongoose Models        │
│                     MongoDB Atlas / local                    │
└──────────┬──────────────────────────────────────────────────┘
           │  child_process (stdin/stdout JSON)
┌──────────▼──────────────────────────────────────────────────┐
│                   Python ML Engine                          │
│   gateway.py → depletion_regression | anomaly_detection    │
│                  cost_calculator                            │
└─────────────────────────────────────────────────────────────┘
```

The backend spawns the Python ML engine as a child process, passing sensor readings via `stdin` as JSON and receiving predictions/anomalies back on `stdout`. This keeps the ML code fully decoupled from Node — no REST hop needed between them.

---

## 📁 Project Structure

```
indhan/
├── backend/                 # Node.js / Express API
│   ├── src/
│   │   ├── app.js           # Express entry point, route mounting
│   │   ├── config/          # DB connection (Mongoose)
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas (User, Cylinder, Reading …)
│   │   ├── routes/          # Express routers (auth, cylinders, readings …)
│   │   └── services/        # Business logic & ML-engine bridge
│   └── scripts/
│       └── seed.js          # Populates DB with synthetic demo data
│
├── ml-engine/               # Python analytics & ML
│   ├── gateway.py           # CLI entry point; dispatches to model modules
│   ├── models/
│   │   ├── depletion_regression.py   # Linear regression depletion forecast
│   │   ├── anomaly_detection.py      # Z-score + rate-of-change anomaly flags
│   │   └── cost_calculator.py        # Daily/monthly cost projection
│   ├── data_generator/      # Synthetic weight-sensor data simulation
│   └── tests/               # Unit tests for ML models
│
├── frontend/                # React web dashboard (Vite)
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.jsx        # All-cylinders overview
│       │   ├── CylinderDetail.jsx   # Per-cylinder analytics
│       │   └── Login.jsx            # Auth screen
│       └── components/
│           ├── WeightTrendChart.jsx  # Recharts line graph
│           ├── DaysRemainingCard.jsx # Countdown + burn-rate card
│           ├── AnomalyAlert.jsx      # Anomaly list with severity badges
│           └── SimulationPanel.jsx   # Demo data injection UI
│
├── docs/
│   ├── api-spec.md          # Complete REST API contract (source of truth)
│   └── architecture.md      # System architecture notes
│
├── scripts/                 # Root-level helper scripts
├── package.json             # Root monorepo config (concurrently)
└── README.md
```

---

## 🤖 ML Engine — How It Works

### 1 · Depletion Regression (`depletion_regression.py`)
- Sorts all readings chronologically
- Computes the **burn rate** (kg/day) as a simple linear slope between the first and last readings
- Divides the remaining usable weight by the burn rate to get **days_remaining**
- **Confidence** score scales between 0.5–0.99 based on how much weight has been consumed relative to cylinder capacity
- Outputs: `current_weight_kg`, `days_remaining`, `est_empty_at`, `burn_rate_kg_per_day`, `confidence`

### 2 · Anomaly Detection (`anomaly_detection.py`)
Two complementary strategies run together:
- **Z-score**: flags any reading where `|value − μ| > 2.5 × σ` as a `spike` or `drop`
- **Rate-of-change**: flags any reading where weight changed by more than **12%** between consecutive readings (catches fast leaks even if the absolute value stays within z-score bounds)
- Severity is `high` if the relative change exceeds 15%, otherwise `medium`

### 3 · Cost Calculator (`cost_calculator.py`)
- Takes `burn_rate_kg_per_day` and `price_per_kg_inr`
- Returns projected daily cost and 30-day cost estimate

### Gateway (`gateway.py`)
Single CLI script invoked by the Node backend:
```
python gateway.py <action> <cylinder_id>  < readings.json
```
| Action | Returns |
|---|---|
| `prediction` | Depletion forecast object |
| `history` | Array of incremental forecasts (how prediction evolved) |
| `anomalies` | Array of flagged anomalies |
| `usage` | Peak hours & baseline burn rate |

---

## 🌐 REST API Overview

Base path: `/api/v1`

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Create account |
| `POST` | `/auth/login` | Login → returns JWT |

### Cylinders
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/cylinders` | Register a new cylinder |
| `GET` | `/cylinders` | List all cylinders for the user |
| `GET` | `/cylinders/:id` | Get single cylinder details |
| `PUT` | `/cylinders/:id` | Update cylinder metadata |
| `DELETE` | `/cylinders/:id` | Remove cylinder |

### Readings
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/cylinders/:id/readings` | Ingest a weight reading |
| `GET` | `/cylinders/:id/readings` | Historical readings (`from`, `to`, `limit`) |
| `GET` | `/cylinders/:id/readings/latest` | Most recent reading |

### Predictions & Intelligence
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/cylinders/:id/prediction` | Current depletion forecast |
| `GET` | `/cylinders/:id/prediction/history` | How forecast has evolved |
| `GET` | `/cylinders/:id/anomalies` | All flagged anomalies |
| `POST` | `/cylinders/:id/anomalies/:anomalyId/acknowledge` | Dismiss an anomaly |
| `GET` | `/cylinders/:id/cost` | Projected daily & monthly cost |
| `GET` | `/cylinders/:id/usage/patterns` | Peak hours & baseline |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/summary` | All cylinders + latest reading + prediction + alerts in one call |

**Example — Prediction Response:**
```json
{
  "cylinder_id": "cyl_001",
  "current_weight_kg": 5.26,
  "days_remaining": 6.2,
  "est_empty_at": "2026-08-06T18:00:00Z",
  "burn_rate_kg_per_day": 0.21,
  "confidence": 0.87
}
```

For the full API contract, see [`docs/api-spec.md`](./docs/api-spec.md).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, React Router v7, Recharts, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express 4, Mongoose, JWT, bcryptjs |
| **Database** | MongoDB (local or Atlas) |
| **ML Engine** | Python 3, standard-library only (no NumPy/pandas dependency) |
| **Dev Tooling** | concurrently (monorepo scripts), oxlint (frontend), node --watch (backend) |

---

## ⚙️ Environment Setup

Create a `.env` file in the `backend/` directory:

```env
# MongoDB connection string (default: local MongoDB)
MONGO_URI=mongodb://localhost:27017/indhan

# Server port (default: 3000)
PORT=3000

# JWT secret key
JWT_SECRET=your_secret_key_here
```

> **Note:** If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.  
> **Note:** Python 3 must be installed and available on your `PATH` for the ML engine to work.

---

## 🚀 Running the Application

This is a monorepo. All commands below are run from the **project root** unless noted otherwise.

### Prerequisites
- Node.js ≥ 18
- Python 3.8+
- MongoDB running locally (or a valid Atlas URI in `backend/.env`)

### 1 · Install Dependencies

Install root, backend, and frontend dependencies:

```bash
# Root dependencies (concurrently, etc.)
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 2 · Seed the Database

Populate the database with synthetic demo data so the dashboard renders immediately:

```bash
cd backend
npm run seed
cd ..
```

### 3 · Start the Full Stack

Launches backend and frontend simultaneously:

```bash
npm start
```

| Service | URL |
|---|---|
| Frontend Dashboard | http://localhost:5173 |
| Backend API | http://localhost:3000 |

### 4 · Development Mode (with auto-reload)

```bash
# Backend only (with --watch)
cd backend && npm run dev

# Frontend only (Vite HMR)
cd frontend && npm run dev
```

---

## 🧪 Running ML Tests

```bash
cd ml-engine
python -m pytest tests/
```

---

## 📖 Docs

- [`docs/api-spec.md`](./docs/api-spec.md) — Full REST API contract, team work split, and example response shapes

---

## 👥 Team

**Team Bourbon** — Built at Hack X '26 in 24 hours.

| Role | Owns |
|---|---|
| Data Engineer | Synthetic sensor data generator, refill resets, seed data |
| ML Engineer | Depletion regression, anomaly detection, cost calculator |
| Backend Engineer | REST API, DB schema, auth, ML-engine bridge |
| Frontend Engineer | React dashboard, charts, anomaly alerts UI |

---

## 📄 License

MIT
