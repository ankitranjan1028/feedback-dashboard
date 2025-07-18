import express from 'express';
const router = express.Router();
import { submitResponse, getResponsesForForm, exportResponses } from '../controllers/responseController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/:formId').post(submitResponse).get(protect, getResponsesForForm);
router.route('/:formId/export').get(protect, exportResponses);

export default router;