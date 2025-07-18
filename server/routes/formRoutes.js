import express from 'express';
const router = express.Router();
import { createForm, getFormById, getMyForms, getStats } from '../controllers/formController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createForm).get(protect, getMyForms);
router.get('/stats', protect, getStats)
router.route('/:id').get(getFormById);

export default router;