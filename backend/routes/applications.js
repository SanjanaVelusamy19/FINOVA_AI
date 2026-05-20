import express from 'express';
import { createApplication, getApplications, getApplicationById, assignOfficer } from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();
router.get('/', protect, asyncHandler(getApplications));
router.get('/:id', protect, asyncHandler(getApplicationById));
router.post('/', protect, asyncHandler(createApplication));
router.post('/:id/assign', protect, asyncHandler(assignOfficer));

export default router;
