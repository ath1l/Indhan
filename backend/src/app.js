const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes (wrapping in dummy routers in case files are empty)
const safeRequire = (path) => {
  const mod = require(path);
  return typeof mod === 'function' ? mod : express.Router();
};

const authRoutes = safeRequire('./routes/auth');
const cylindersRoutes = safeRequire('./routes/cylinders');
const readingsRoutes = safeRequire('./routes/readings');
const predictionsRoutes = safeRequire('./routes/predictions');
const anomaliesRoutes = safeRequire('./routes/anomalies');
const costRoutes = safeRequire('./routes/cost');
const dashboardRoutes = safeRequire('./routes/dashboard');

// Mount Routes
const API_BASE = '/api/v1';

app.use(`${API_BASE}/auth`, authRoutes);
app.use(`${API_BASE}/cylinders`, cylindersRoutes);
app.use(`${API_BASE}/cylinders/:id/readings`, readingsRoutes);
app.use(`${API_BASE}/cylinders/:id/prediction`, predictionsRoutes);
app.use(`${API_BASE}/cylinders/:id/anomalies`, anomaliesRoutes);
app.use(`${API_BASE}`, costRoutes);
app.use(`${API_BASE}/dashboard`, dashboardRoutes);

// Basic root endpoint
app.get('/', (req, res) => {
  res.send('Indhan Backend API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
