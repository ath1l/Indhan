/* ===================================================
   Dummy Data Service
   Mirrors the API spec from docs/api-spec.md exactly.
   When the real backend is ready, swap fetch calls in.
   =================================================== */

// --- Helpers ---
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const randBetween = (min, max) => Math.random() * (max - min) + min;

// --- Dummy User ---
let currentUser = null;
const USERS = [
  { id: 'usr_001', name: 'Hari Ganesh', email: 'hari@indhan.io', password: 'demo123' },
];

// --- Dummy Cylinders ---
const CYLINDERS = [
  {
    id: 'cyl_001',
    name: 'Kitchen Cylinder',
    location: 'Main Kitchen',
    capacity_kg: 14.2,
    tare_weight_kg: 15.8,
    status: 'active',
    registered_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'cyl_002',
    name: 'Backup Cylinder',
    location: 'Storage Room',
    capacity_kg: 14.2,
    tare_weight_kg: 15.8,
    status: 'active',
    registered_at: '2026-06-15T14:30:00Z',
  },
  {
    id: 'cyl_003',
    name: 'Restaurant Cylinder',
    location: 'Commercial Kitchen',
    capacity_kg: 19.0,
    tare_weight_kg: 17.5,
    status: 'warning',
    registered_at: '2026-05-20T09:00:00Z',
  },
];

// --- Generate Readings (30 days of data) ---
function generateReadings(cylinderId, days = 30) {
  const readings = [];
  const now = Date.now();
  const cyl = CYLINDERS.find((c) => c.id === cylinderId);
  const capacity = cyl ? cyl.capacity_kg : 14.2;
  let weight = capacity;

  for (let i = days; i >= 0; i--) {
    const dailyReadings = i === 0 ? 1 : 4; // 4 readings per day
    for (let j = 0; j < dailyReadings; j++) {
      const ts = now - i * 86400000 + j * 6 * 3600000;
      // Random depletion: 0.15 - 0.35 kg per reading cycle
      weight = Math.max(0.5, weight - randBetween(0.05, 0.12));
      readings.push({
        timestamp: new Date(ts).toISOString(),
        weight_kg: parseFloat(weight.toFixed(2)),
        cylinder_id: cylinderId,
      });
    }
  }
  return readings;
}

// Cache readings per cylinder
const readingsCache = {};
function getReadings(cylinderId) {
  if (!readingsCache[cylinderId]) {
    readingsCache[cylinderId] = generateReadings(cylinderId);
  }
  return readingsCache[cylinderId];
}

// --- Predictions ---
function getPrediction(cylinderId) {
  const readings = getReadings(cylinderId);
  const latest = readings[readings.length - 1];
  const prev = readings[Math.max(0, readings.length - 5)];
  const daysDiff =
    (new Date(latest.timestamp) - new Date(prev.timestamp)) / 86400000 || 1;
  const burnRate = Math.max(
    0.1,
    (prev.weight_kg - latest.weight_kg) / daysDiff
  );
  const daysRemaining = Math.max(0, latest.weight_kg / burnRate);
  const estEmpty = new Date(
    Date.now() + daysRemaining * 86400000
  ).toISOString();

  return {
    cylinder_id: cylinderId,
    current_weight_kg: latest.weight_kg,
    days_remaining: parseFloat(daysRemaining.toFixed(1)),
    est_empty_at: estEmpty,
    burn_rate_kg_per_day: parseFloat(burnRate.toFixed(3)),
    confidence: parseFloat(randBetween(0.78, 0.95).toFixed(2)),
  };
}

// --- Anomalies ---
const ANOMALY_TYPES = ['leak', 'spike', 'sudden_drop'];
function getAnomalies(cylinderId) {
  const count = Math.floor(randBetween(0, 4));
  const anomalies = [];
  for (let i = 0; i < count; i++) {
    const type = ANOMALY_TYPES[Math.floor(Math.random() * ANOMALY_TYPES.length)];
    anomalies.push({
      id: `anom_${cylinderId}_${i}`,
      cylinder_id: cylinderId,
      type,
      severity: type === 'leak' ? 'critical' : type === 'sudden_drop' ? 'warning' : 'info',
      message:
        type === 'leak'
          ? 'Possible gas leak detected — weight dropping faster than normal'
          : type === 'sudden_drop'
          ? 'Sudden weight drop detected — check connections'
          : 'Unusual usage spike in the last 2 hours',
      detected_at: new Date(
        Date.now() - Math.floor(randBetween(1, 72)) * 3600000
      ).toISOString(),
      acknowledged: false,
    });
  }
  return anomalies;
}

// Cache anomalies
const anomaliesCache = {};
function getCylAnomalies(cylinderId) {
  if (!anomaliesCache[cylinderId]) {
    anomaliesCache[cylinderId] = getAnomalies(cylinderId);
  }
  return anomaliesCache[cylinderId];
}

// --- Cost ---
const LPG_PRICE_PER_KG = 62.5; // ₹/kg approximate
function getCost(cylinderId) {
  const pred = getPrediction(cylinderId);
  const dailyCost = pred.burn_rate_kg_per_day * LPG_PRICE_PER_KG;
  return {
    cylinder_id: cylinderId,
    price_per_kg: LPG_PRICE_PER_KG,
    daily_cost: parseFloat(dailyCost.toFixed(2)),
    monthly_cost: parseFloat((dailyCost * 30).toFixed(2)),
    remaining_value: parseFloat(
      (pred.current_weight_kg * LPG_PRICE_PER_KG).toFixed(2)
    ),
  };
}

// --- Usage Patterns ---
function getUsagePatterns(cylinderId) {
  return {
    cylinder_id: cylinderId,
    peak_hours: ['07:00-09:00', '12:00-14:00', '19:00-21:00'],
    avg_daily_usage_kg: parseFloat(randBetween(0.3, 0.6).toFixed(2)),
    baseline_burn_rate: parseFloat(randBetween(0.15, 0.25).toFixed(3)),
    usage_trend: 'stable',
  };
}

// --- Notifications ---
function getNotifications() {
  return [
    {
      id: 'notif_1',
      type: 'warning',
      title: 'Low Gas Level',
      message: 'Kitchen Cylinder is below 30% — consider ordering a refill.',
      cylinder_id: 'cyl_001',
      created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      read: false,
    },
    {
      id: 'notif_2',
      type: 'critical',
      title: 'Anomaly Detected',
      message:
        'Restaurant Cylinder shows unusual weight drop. Possible leak.',
      cylinder_id: 'cyl_003',
      created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
      read: false,
    },
    {
      id: 'notif_3',
      type: 'info',
      title: 'Refill Reminder',
      message:
        'Backup Cylinder estimated to run out in 4 days. Plan ahead!',
      cylinder_id: 'cyl_002',
      created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
      read: true,
    },
    {
      id: 'notif_4',
      type: 'success',
      title: 'Refill Complete',
      message: 'Kitchen Cylinder was refilled successfully 3 days ago.',
      cylinder_id: 'cyl_001',
      created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
      read: true,
    },
  ];
}

// --- Dashboard Summary ---
function getDashboardSummary() {
  return CYLINDERS.map((cyl) => {
    const pred = getPrediction(cyl.id);
    const readings = getReadings(cyl.id);
    const latest = readings[readings.length - 1];
    const anomalies = getCylAnomalies(cyl.id);
    const cost = getCost(cyl.id);
    const pct = (pred.current_weight_kg / cyl.capacity_kg) * 100;

    return {
      ...cyl,
      latest_reading: latest,
      prediction: pred,
      anomalies_count: anomalies.filter((a) => !a.acknowledged).length,
      cost,
      gas_percentage: Math.min(100, Math.max(0, parseFloat(pct.toFixed(1)))),
      status:
        pct < 15
          ? 'critical'
          : pct < 30
          ? 'warning'
          : 'active',
    };
  });
}

// ======================================================
// PUBLIC API — all return promises to mimic real fetches
// ======================================================
export const api = {
  // Auth
  login: async (email, password) => {
    await delay(600);
    const user = USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error('Invalid credentials');
    currentUser = user;
    localStorage.setItem('indhan_token', 'dummy_jwt_token');
    localStorage.setItem('indhan_user', JSON.stringify(user));
    return { token: 'dummy_jwt_token', user };
  },

  register: async (name, email, password) => {
    await delay(600);
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      password,
    };
    USERS.push(newUser);
    currentUser = newUser;
    localStorage.setItem('indhan_token', 'dummy_jwt_token');
    localStorage.setItem('indhan_user', JSON.stringify(newUser));
    return { token: 'dummy_jwt_token', user: newUser };
  },

  logout: async () => {
    await delay(100);
    currentUser = null;
    localStorage.removeItem('indhan_token');
    localStorage.removeItem('indhan_user');
  },

  getUser: () => {
    const stored = localStorage.getItem('indhan_user');
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated: () => !!localStorage.getItem('indhan_token'),

  // Dashboard
  getDashboardSummary: async () => {
    await delay(400);
    return getDashboardSummary();
  },

  // Cylinders
  getCylinders: async () => {
    await delay(300);
    return CYLINDERS;
  },

  getCylinder: async (id) => {
    await delay(200);
    const cyl = CYLINDERS.find((c) => c.id === id);
    if (!cyl) throw new Error('Cylinder not found');
    return cyl;
  },

  // Readings
  getReadings: async (cylinderId, _params) => {
    await delay(300);
    return getReadings(cylinderId);
  },

  getLatestReading: async (cylinderId) => {
    await delay(100);
    const readings = getReadings(cylinderId);
    return readings[readings.length - 1];
  },

  // Predictions
  getPrediction: async (cylinderId) => {
    await delay(200);
    return getPrediction(cylinderId);
  },

  // Anomalies
  getAnomalies: async (cylinderId) => {
    await delay(200);
    return getCylAnomalies(cylinderId);
  },

  acknowledgeAnomaly: async (cylinderId, anomalyId) => {
    await delay(200);
    const anomalies = getCylAnomalies(cylinderId);
    const a = anomalies.find((x) => x.id === anomalyId);
    if (a) a.acknowledged = true;
    return { success: true };
  },

  // Cost
  getCost: async (cylinderId) => {
    await delay(150);
    return getCost(cylinderId);
  },

  getCurrentPricing: async () => {
    await delay(100);
    return { price_per_kg: LPG_PRICE_PER_KG, currency: 'INR', updated_at: new Date().toISOString() };
  },

  // Usage
  getUsagePatterns: async (cylinderId) => {
    await delay(200);
    return getUsagePatterns(cylinderId);
  },

  // Notifications
  getNotifications: async () => {
    await delay(200);
    return getNotifications();
  },
};

export default api;
