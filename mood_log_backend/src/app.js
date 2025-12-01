import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import moodsRoutes from './routes/moods.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: env.CORS_ORIGIN || '*',
    credentials: true
  })
);
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Healthy' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/moods', moodsRoutes);
app.use('/analytics', analyticsRoutes);

// 404 and centralized error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
