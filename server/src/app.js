const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const settingRoutes = require('./routes/settingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

const path = require('path');
const fs = require('fs');

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS configuration (Supporting Admin domain & dev origins)
const rawOrigins = [
  config.clientUrl,
  config.adminUrl,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

const allowedOrigins = rawOrigins
  .flatMap(url => (url ? url.split(',') : []))
  .map(url => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

function isAllowedOrigin(origin) {
  const cleanOrigin = origin.trim().replace(/\/$/, '');
  if (allowedOrigins.includes(cleanOrigin)) return true;

  try {
    const hostname = new URL(cleanOrigin).hostname.toLowerCase();
    const appDomain = String(config.appDomain || '').trim().toLowerCase();
    return Boolean(appDomain) && (hostname === appDomain || hostname.endsWith(`.${appDomain}`));
  } catch {
    return false;
  }
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (config.nodeEnv === 'development' || isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not permitted by CORS policy.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-event-id', 'x-razorpay-signature']
}));

// Body parsers with raw body capturing for Razorpay Webhook signature verification
app.use(express.json({
  limit: '2mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Golden Zone Backend API is healthy & running',
    timestamp: new Date().toISOString()
  });
});

// ==========================================================
// 1. Backend REST API Routes (/api/*)
// ==========================================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notes', noteRoutes);

// ==========================================================
// 2. Client Production Build Serving (/* -> client/dist)
// ==========================================================
const clientDistPath = path.resolve(__dirname, '../../client/dist');

if (fs.existsSync(clientDistPath)) {
  // Serve static assets from client/dist
  app.use(express.static(clientDistPath, {
    maxAge: '1d',
    index: false
  }));

  // Handle SPA routing: serve index.html for all non-API GET routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// 404 handler for unmatched API routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;

// If executed directly, run the server entry point
if (require.main === module) {
  require('./server');
}
