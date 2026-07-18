# Indhan — Team Work Split, API Spec & Repo Structure
**Team Bourbon | Hack X '26**

Assumption: 4-person team, mapped to the timeline already in your abstract (Hours 0–24). Adjust names/roles below to your actual squad.

---

## 1. Work Division

| Member | Role | Owns | Hours (approx) |
|---|---|---|---|
| **A — Data Engineer** | Data & Simulation | Synthetic weight-sensor generator, refill resets, injected anomalies, seed data | 0–4 (build), 18–22 (support testing) |
| **B — ML/Analytics Engineer** | Prediction & Intelligence | Depletion regression, anomaly detection (z-score/rate-of-change), cost calculator | 4–10 (build), 10–18 (integrate w/ B), 18–22 (tune) |
| **C — Backend Engineer** | API & Data Layer | REST API, DB schema, auth, wiring ML outputs to endpoints | 4–18 (build in parallel with B once data contract is set), 18–22 (bugfix) |
| **D — Frontend Engineer** | Dashboard & Demo | Web dashboard, charts, alerts UI, pitch deck | 6–18 (build against mocked API first, swap to real API once C is ready), 22–24 (pitch) |

**Handoff points (critical — agree on these first):**
- **A → B**: reading schema (`timestamp, cylinder_id, weight_kg`) — lock this by Hour 2 so B isn't blocked.
- **B → C**: what a "prediction object" and "anomaly object" look like (see JSON shapes below) — lock by Hour 6.
- **C → D**: finalize API contract (this doc) so D can build against mocked responses starting Hour 4–6, then swap to live API once C deploys.
- **Hours 18–22**: everyone tests end-to-end together; Hours 22–24: pitch + demo run-through as a team.

**Git workflow (shared repo):**
- `main` = always demoable/stable
- Branches: `feat/data-sim`, `feat/ml-prediction`, `feat/api`, `feat/dashboard`
- Small, frequent PRs into `main`; whoever isn't blocked reviews
- Agree on the API contract (Section 2) as the source of truth so backend/frontend/ML can work in parallel without blocking each other

---

## 2. API Endpoints (REST, base path `/api/v1`)

### Auth (minimal, for prototype)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Create user account |
| POST | `/auth/login` | Login, returns token |
| GET | `/users/{userId}` | Get user profile |

### Cylinders
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/cylinders` | Register a new cylinder/node (tare weight, capacity, owner) |
| GET | `/cylinders` | List all cylinders for logged-in user |
| GET | `/cylinders/{id}` | Get single cylinder details |
| PUT | `/cylinders/{id}` | Update cylinder metadata |
| DELETE | `/cylinders/{id}` | Remove cylinder |

### Readings (sensor ingestion — simulated for demo)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/cylinders/{id}/readings` | Ingest a new weight reading `{timestamp, weight_kg}` |
| GET | `/cylinders/{id}/readings` | Historical readings — query params `from`, `to`, `limit` |
| GET | `/cylinders/{id}/readings/latest` | Most recent reading |

### Predictions (Depletion)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/cylinders/{id}/prediction` | Current depletion prediction: `{days_remaining, est_empty_at, confidence}` |
| GET | `/cylinders/{id}/prediction/history` | How the prediction has evolved over time |

### Anomalies
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/cylinders/{id}/anomalies` | List detected anomalies (leak, spike, drop) |
| GET | `/cylinders/{id}/anomalies/{anomalyId}` | Anomaly detail |
| POST | `/cylinders/{id}/anomalies/{anomalyId}/acknowledge` | Mark reviewed/dismissed |

### Cost Intelligence
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/cylinders/{id}/cost` | Projected daily & monthly cost at current price |
| GET | `/pricing/current` | Current LPG market price (₹/kg) |
| PUT | `/pricing/current` | Manually update price (admin/demo override) |

### Usage Insights
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/cylinders/{id}/usage/patterns` | Peak usage hours, burn-rate baseline |
| GET | `/users/{id}/cylinders/compare` | Efficiency comparison across multiple cylinders |

### Notifications
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/notifications` | List alerts (low balance, anomaly, refill reminder) |
| POST | `/notifications/subscribe` | Register device/webhook for push alerts |

### Dashboard Aggregate
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/dashboard/summary` | Single call returning all cylinders + latest reading + prediction + alerts, for the main dashboard view |

### Realtime (optional, if time permits)
| Type | Endpoint | Purpose |
|---|---|---|
| WS | `/ws/cylinders/{id}` | Push live weight updates to dashboard without polling |

**Example response shape** (prediction endpoint, for the B↔C↔D contract):
```json
{
  "cylinder_id": "cyl_001",
  "current_weight_kg": 5.26,
  "days_remaining": 6.2,
  "est_empty_at": "2026-07-24T18:00:00Z",
  "burn_rate_kg_per_day": 0.21,
  "confidence": 0.87
}
```

---

## 3. Telemetry Ingestion & Database Seed Schema (Sensor Readings)

This schema defines the telemetry data generated by the synthetic weight-sensor simulations (Member A). It is ingested by Member C's backend and used by Member B's ML/analytics engine.

### 3.1 Sensor Reading Telemetry Schema
```json
{
  "timestamp": "2026-07-18T10:00:00Z",
  "cylinder_id": "cyl_001",
  "weight_kg": 14.20
}
```

#### Field Definitions & Formats
* **`timestamp`** (String): ISO 8601 format with UTC indicator (`YYYY-MM-DDTHH:MM:SSZ`).
* **`cylinder_id`** (String): Unique identifier with a consistent prefix format (`cyl_xxx`).
* **`weight_kg`** (Float): Net gas weight in kilograms, formatted to exactly 2 decimal places. 

#### Gross vs. Net Weight Decision
* **Decision:** We use **Net Gas Weight** (weight of the gas inside the cylinder only) for the simulated `weight_kg` values in the telemetry readings.
* **Reasoning:** Simpler logic for Member B's depletion regression models (since the sensor reading is directly proportional to remaining fuel, from `14.2 kg` full to `0.0 kg` empty).
* **Sensor Logic:** Even though a physical scale measures gross weight, the simulated sensor firmware subtracts the cylinder's tare weight before transmitting the payload to keep downstream services simple.

### 3.2 Cylinder Metadata Specification
Member C (Backend Engineer) requires static cylinder metadata to register cylinders on the backend. We will generate a matching registry seed file alongside the telemetry data.

#### Metadata Schema
```json
{
  "cylinder_id": "cyl_001",
  "tare_weight_kg": 15.30,
  "gas_capacity_kg": 14.20,
  "full_weight_kg": 29.50,
  "user_id": "usr_001"
}
```

#### Field Definitions
* **`cylinder_id`** (String): Primary key matching the telemetry data.
* **`tare_weight_kg`** (Float): Weight of the empty physical cylinder shell.
* **`gas_capacity_kg`** (Float): Maximum capacity of LPG gas (net).
* **`full_weight_kg`** (Float): Total weight when fully filled (`tare_weight_kg` + `gas_capacity_kg`).
* **`user_id`** (String): Mocked user ID associated with the cylinder.

### 3.3 Simulation Defaults
* **Reading Interval:** Every **60 minutes** (hourly).
* **Standard Depletion Rate:** ~`0.25 kg` of gas per day (varies slightly by household usage patterns in simulation).
