import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roleRoutes from './routes/roles.js';
import permissionRoutes from './routes/permissions.js';
import resourceRoutes from './routes/resources.js';
import auditRoutes from './routes/audit.js';

// Load environment variables
dotenv.config();

console.log('🚀 Starting RBAC Server...');
console.log('Port:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/audit', auditRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RBAC System is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database sync and server start
const startServer = async () => {
  try {
    console.log('📦 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    await sequelize.sync({ alter: false });
    console.log('✅ Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log('🔐 RBAC System Ready!');
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;