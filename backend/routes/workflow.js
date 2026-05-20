import express from 'express';
import { getWorkflowHistory, getTasks, updateTaskStatus } from '../controllers/workflowController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();
router.get('/history', protect, asyncHandler(getWorkflowHistory));
router.get('/tasks', protect, asyncHandler(getTasks));
router.patch('/tasks/:id', protect, asyncHandler(updateTaskStatus));

export default router;
