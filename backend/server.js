import dns from 'node:dns';
dns.setServers(['1.1.1.1', '1.0.0.1']);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { ensureSeeded } from './utils/seedRunner.js';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import analyticsRoutes from './routes/analytics.js';
import workflowRoutes from './routes/workflow.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'finova-dev-jwt-secret-change-in-production';
  console.warn('JWT_SECRET not set — using development default.');
}

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

connectDB();

mongoose.connection.once('open', () => {
  void ensureSeeded();
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/workflow', workflowRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FINOVA AI backend',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`FINOVA API listening on port ${PORT}`));
