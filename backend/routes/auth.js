import express from 'express';
import { login, register } from '../controllers/authController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();
router.post('/login', asyncHandler(login));
router.post('/register', asyncHandler(register));

export default router;
