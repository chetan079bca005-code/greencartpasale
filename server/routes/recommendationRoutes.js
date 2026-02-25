import express from 'express';
import { 
    getFrequentlyBoughtTogether, 
    getPersonalizedRecommendations,
    getSimilarUsersRecommendations,
    getCartRecommendations,
    getRecommendationStats
} from '../controllers/recommendationController.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';

const router = express.Router();

// GET /api/recommendations/frequently-bought/:productId - Item-based CF (public)
router.get('/frequently-bought/:productId', getFrequentlyBoughtTogether);

// GET /api/recommendations/personalized - Hybrid CF (User + Item based)
router.get('/personalized', getPersonalizedRecommendations);

// GET /api/recommendations/similar-users - User-based CF
router.get('/similar-users', authUser, getSimilarUsersRecommendations);

// POST /api/recommendations/cart - Cart-based recommendations
router.post('/cart', getCartRecommendations);

// GET /api/recommendations/stats - Engine statistics (admin only)
router.get('/stats', authSeller, getRecommendationStats);

export default router;