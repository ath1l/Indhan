const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database (mocked if MongoDB isn't running)
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const cylindersRoutes = require('./routes/cylinders');
const readingsRoutes = require('./routes/readings');
const predictionsRoutes = require('./routes/predictions');
const anomaliesRoutes = require('./routes/anomalies');
const costRoutes = require('./routes/cost');
const dashboardRoutes = require('./routes/dashboard');

// Mount Routes
const API_BASE = '/api/v1';

app.use(`${API_BASE}/auth`, authRoutes);
app.use(`${API_BASE}/cylinders`, cylindersRoutes);

// Nested routes for cylinders
app.use(`${API_BASE}/cylinders/:id/readings`, readingsRoutes);
app.use(`${API_BASE}/cylinders/:id/prediction`, predictionsRoutes);
app.use(`${API_BASE}/cylinders/:id/anomalies`, anomaliesRoutes);

// Cost and pricing routes are mixed in cost.js, but need to be mounted at API_BASE
// because cost.js defines routes for both /cylinders/:id/cost and /pricing/current
app.use(`${API_BASE}`, costRoutes);

// Dashboard aggregate route
app.use(`${API_BASE}/dashboard`, dashboardRoutes);

// Basic root endpoint
app.get('/', (req, res) => {
  res.send('Indhan Backend API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
