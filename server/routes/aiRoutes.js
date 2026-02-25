import express from 'express';
import { getPricingSuggestions, getInventoryForecast } from '../controllers/aiController.js';
import authSeller from '../middlewares/authSeller.js';

const router = express.Router();

/**
 * AI Routes
 * Prefixed with /api/ai
 * Protected by seller authentication
 */

router.get('/pricing-suggestions', authSeller, getPricingSuggestions);
router.get('/inventory-forecast', authSeller, getInventoryForecast);

export default router;
