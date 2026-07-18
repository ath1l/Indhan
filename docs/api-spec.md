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
