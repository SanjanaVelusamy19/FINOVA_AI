import express from 'express';
import { getDashboardMetrics, getApprovalAnalytics, getAiLogs } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();
router.get('/dashboard', protect, asyncHandler(getDashboardMetrics));
router.get('/approval', protect, asyncHandler(getApprovalAnalytics));
router.get('/ai-logs', protect, asyncHandler(getAiLogs));

export default router;
