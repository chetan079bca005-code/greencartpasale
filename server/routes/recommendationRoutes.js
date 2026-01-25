import express from 'express';
import { 
    getFrequentlyBoughtTogether, 
    getPersonalizedRecommendations,
    getSimilarUsersRecommendations,
    getCartRecommendations,
    getRecommendationStats
} from '../controllers/recommendationController.js';

const router = express.Router();

// GET /api/recommendations/frequently-bought/:productId - Item-based CF
router.get('/frequently-bought/:productId', getFrequentlyBoughtTogether);

// GET /api/recommendations/personalized - Hybrid CF (User + Item based)
router.get('/personalized', getPersonalizedRecommendations);

// GET /api/recommendations/similar-users - User-based CF
router.get('/similar-users', getSimilarUsersRecommendations);

// POST /api/recommendations/cart - Cart-based recommendations
router.post('/cart', getCartRecommendations);

// GET /api/recommendations/stats - Engine statistics (for debugging)
router.get('/stats', getRecommendationStats);

export default router;