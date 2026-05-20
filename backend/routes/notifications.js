import express from 'express';
import { getNotifications, markNotificationRead, getUnreadCount } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();
router.get('/', protect, asyncHandler(getNotifications));
router.get('/count', protect, asyncHandler(getUnreadCount));
router.patch('/:id/read', protect, asyncHandler(markNotificationRead));

export default router;
