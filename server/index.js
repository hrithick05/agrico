const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');

// Import routes
const equipmentRoutes = require('./routes/equipment');
const bulkDealsRoutes = require('./routes/bulkDeals');
const forumRoutes = require('./routes/forum');
const lendingRoutes = require('./routes/lending');
const expensesRoutes = require('./routes/expenses');
const marketRoutes = require('./routes/market');
const schemesRoutes = require('./routes/schemes');

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AgroConnect Backend Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API Routes
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bulk-deals', bulkDealsRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/lending', lendingRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/schemes', schemesRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AgroConnect Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      equipment: '/api/equipment',
      bulkDeals: '/api/bulk-deals',
      forum: '/api/forum',
      lending: '/api/lending',
      expenses: '/api/expenses',
      market: '/api/market',
      schemes: '/api/schemes',
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 AgroConnect Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🌐 CORS enabled for: ${config.cors.origin}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API docs: http://localhost:${PORT}/`);
});

module.exports = app;
