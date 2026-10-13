require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes         = require('./routes/auth');
const hubRoutes          = require('./routes/hubs');
const jobRoutes          = require('./routes/jobs');
const adRoutes           = require('./routes/ads');
const updateRoutes       = require('./routes/updates');
const transactionRoutes  = require('./routes/transactions');
const subscriptionRoutes = require('./routes/subscriptions');
const errorHandler       = require('./middleware/errorHandler');

const app = express();

// ─── Core Middleware ───────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'PitStop API', version: '1.0.0', time: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/hubs',          hubRoutes);
app.use('/api/jobs',          jobRoutes);
app.use('/api/ads',           adRoutes);
app.use('/api/updates',       updateRoutes);
app.use('/api/transactions',  transactionRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ─── Central Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('  ██████╗ ██╗████████╗███████╗████████╗ ██████╗ ██████╗ ');
  console.log('  ██╔══██╗██║╚══██╔══╝██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗');
  console.log('  ██████╔╝██║   ██║   ███████╗   ██║   ██║   ██║██████╔╝');
  console.log('  ██╔═══╝ ██║   ██║   ╚════██║   ██║   ██║   ██║██╔═══╝ ');
  console.log('  ██║     ██║   ██║   ███████║   ██║   ╚██████╔╝██║     ');
  console.log('  ╚═╝     ╚═╝   ╚═╝   ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ');
  console.log('');
  console.log(`  🚀 PitStop API running at http://localhost:${PORT}`);
  console.log(`  📋 Health check:  http://localhost:${PORT}/api/health`);
  console.log(`  🔐 Auth:          http://localhost:${PORT}/api/auth`);
  console.log(`  🏪 Hubs:          http://localhost:${PORT}/api/hubs`);
  console.log(`  💼 Jobs:          http://localhost:${PORT}/api/jobs`);
  console.log(`  📢 Ads:           http://localhost:${PORT}/api/ads`);
  console.log(`  📰 Updates:       http://localhost:${PORT}/api/updates`);
  console.log(`  💳 Transactions:  http://localhost:${PORT}/api/transactions`);
  console.log(`  💎 Subscriptions: http://localhost:${PORT}/api/subscriptions`);
  console.log('');
});
