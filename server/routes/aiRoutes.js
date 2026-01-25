import express from 'express';
import { getPricingSuggestions, getInventoryForecast } from '../controllers/aiController.js';

const router = express.Router();

/**
 * AI Routes
 * Prefixed with /api/ai
 */

// In a real app, these should be protected by an Admin middleware
// e.g., router.get('/pricing-suggestions', protect, admin, getPricingSuggestions);

router.get('/pricing-suggestions', getPricingSuggestions);
router.get('/inventory-forecast', getInventoryForecast);

export default router;
