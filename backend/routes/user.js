import express from 'express';
import { body } from 'express-validator';
import {
  updateProfile,
  getUserProfile,
  getDashboard
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const profileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters')
];

router.put('/profile', protect, profileValidation, updateProfile);
router.get('/profile/:id', getUserProfile);
router.get('/dashboard', protect, getDashboard);

export default router;