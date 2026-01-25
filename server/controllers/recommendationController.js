import Order from '../models/Order.js';
import Product from '../models/Product.js';
import CollaborativeFiltering from '../utils/collaborativeFiltering.js';
import contentBasedFiltering from '../utils/contentBasedFiltering.js';

/**
 * Recommendation Controller
 * 
 * Handles product recommendations using Collaborative Filtering algorithm.
 * Provides personalized recommendations, similar products, and cart suggestions.
 * 
 * @module RecommendationController
 * @version 2.0.0 - Upgraded from Association Mining to Collaborative Filtering
 */

// Initialize the Collaborative Filtering engine
const cfEngine = new CollaborativeFiltering({
    similarityThreshold: 0.05,  // Lower threshold for smaller datasets
    maxNeighbors: 15,
    maxRecommendations: 10
});

// Cache management
let lastMatrixUpdate = null;
const MATRIX_UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutes

/**
 * Refreshes the user-item matrix from order data
 * Called periodically to keep recommendations up-to-date
 */
const refreshMatrix = async () => {
    try {
        const orders = await Order.find({
            status: { $ne: 'Cancelled' }
        }).lean();

        const products = await Product.find().lean();

        if (orders.length < 3) {
            console.log('[CF] Not enough orders for collaborative filtering');
            return;
        }

        cfEngine.buildMatrix(orders, products);
        contentBasedFiltering.buildVectorSpace(products); // Initialize Content-Based Engine

        lastMatrixUpdate = new Date();

        const stats = cfEngine.getStats();
        console.log(`[CF] Matrix refreshed: ${stats.totalUsers} users, ${stats.totalProducts} products`);
    } catch (error) {
        console.error('[CF] Error refreshing matrix:', error);
    }
};

// Initial build
refreshMatrix();

/**
 * Ensures the matrix is up-to-date before generating recommendations
 */
const ensureMatrixFresh = async () => {
    if (!lastMatrixUpdate || (Date.now() - lastMatrixUpdate > MATRIX_UPDATE_INTERVAL)) {
        await refreshMatrix();
    }
};

/**
 * GET /api/recommendations/frequently-bought/:productId
 * 
 * Returns products frequently bought together with the specified product
 * Uses Item-Based Collaborative Filtering with smart fallbacks
 * 
 * ALGORITHM PRIORITY:
 * 1. Collaborative Filtering (if sufficient purchase data exists)
 * 2. Content-Based Filtering using NLP + Attribute matching
 * 3. Category-based filtering (same category products)
 * 
 * @param {string} productId - The product ID to find related products for
 * @returns {Object} { recommended: Product[], type: string }
 */
export const getFrequentlyBoughtTogether = async (req, res) => {
    try {
        const { productId } = req.params;

        await ensureMatrixFresh();

        // First, get the target product to understand its attributes
        const targetProduct = await Product.findById(productId);
        if (!targetProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        console.log(`[Recommendation] Finding similar products for: ${targetProduct.name} (${targetProduct.category})`);

        // STEP 1: Try Collaborative Filtering (purchase history based)
        const cfSimilarProducts = cfEngine.getSimilarProducts(productId);
        
        if (cfSimilarProducts.length >= 3) {
            // We have good CF data - use it
            const productIds = cfSimilarProducts.map(p => p.productId);
            const recommendedProducts = await Product.find({
                _id: { $in: productIds },
                inStock: true
            });

            // Sort by similarity score
            const sortedProducts = productIds
                .map(id => recommendedProducts.find(p => p._id.toString() === id))
                .filter(Boolean);

            if (sortedProducts.length > 0) {
                console.log(`[Recommendation] CF returned ${sortedProducts.length} products`);
                return res.json({
                    recommended: sortedProducts,
                    type: 'collaborative-filtering',
                    message: 'Users who bought this also bought'
                });
            }
        }

        // STEP 2: Content-Based Filtering (NLP + Attribute matching)
        const contentBasedRecs = contentBasedFiltering.getSimilarProducts(productId, 6);
        
        if (contentBasedRecs.length > 0) {
            // Filter to only include products from the SAME category for better relevance
            const sameCategoryRecs = contentBasedRecs.filter(r => 
                r.product.category?.toLowerCase() === targetProduct.category?.toLowerCase()
            );

            const recsToUse = sameCategoryRecs.length >= 2 ? sameCategoryRecs : contentBasedRecs;
            
            console.log(`[Recommendation] Content-based returned ${recsToUse.length} products`);
            return res.json({
                recommended: recsToUse.map(r => r.product),
                type: 'content-based',
                message: 'Similar products you might like'
            });
        }

        // STEP 3: Ultimate Fallback - Same Category Products (excluding current)
        const fallbackProducts = await Product.find({
            category: targetProduct.category,
            _id: { $ne: productId },
            inStock: true
        })
        .sort({ rating: -1, createdAt: -1 }) // Prioritize highly rated and newer products
        .limit(4);

        console.log(`[Recommendation] Category fallback returned ${fallbackProducts.length} products`);
        return res.json({
            recommended: fallbackProducts,
            type: 'category-based',
            message: `More from ${targetProduct.category}`
        });

    } catch (error) {
        console.error('[Recommendation] Error in getFrequentlyBoughtTogether:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/recommendations/personalized
 * 
 * Returns personalized product recommendations for a user
 * Uses Hybrid Collaborative Filtering (User-Based + Item-Based)
 * 
 * @query {string} userId - The user ID to generate recommendations for
 * @returns {Array<Product>} Array of recommended products
 */
export const getPersonalizedRecommendations = async (req, res) => {
    try {
        const { userId } = req.query;

        await ensureMatrixFresh();

        // If no user, return popular products (cold start)
        if (!userId) {
            const popularRecs = cfEngine.getPopularProducts();

            if (popularRecs.length > 0) {
                const productIds = popularRecs.map(p => p.productId);
                const products = await Product.find({
                    _id: { $in: productIds },
                    inStock: true
                });
                return res.json({
                    recommendations: products,
                    type: 'popular',
                    message: 'Trending products'
                });
            }

            // Ultimate fallback: top rated products
            const topProducts = await Product.find({ inStock: true })
                .sort({ rating: -1 })
                .limit(8);
            return res.json({
                recommendations: topProducts,
                type: 'top-rated',
                message: 'Top rated products'
            });
        }

        // Get hybrid recommendations for the user
        const recommendations = cfEngine.recommendHybrid(userId, 0.6);

        if (recommendations.length > 0) {
            const productIds = recommendations.map(r => r.productId);
            const products = await Product.find({
                _id: { $in: productIds },
                inStock: true
            });

            // Sort by recommendation score
            const sortedProducts = productIds
                .map(id => products.find(p => p._id.toString() === id))
                .filter(Boolean);

            return res.json({
                recommendations: sortedProducts,
                type: 'collaborative-filtering',
                message: 'Personalized for you'
            });
        }

        // Fallback: Category-based recommendations from purchase history
        const userOrders = await Order.find({ userId }).lean();
        const purchasedIds = userOrders
            .map(order => order.items.map(i => i.product?.toString()))
            .flat()
            .filter(Boolean);

        const boughtProducts = await Product.find({ _id: { $in: purchasedIds } });

        // Find preferred categories
        const categoryCount = {};
        boughtProducts.forEach(p => {
            categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
        });

        const topCategory = Object.keys(categoryCount)
            .sort((a, b) => categoryCount[b] - categoryCount[a])[0];

        if (topCategory) {
            const categoryProducts = await Product.find({
                category: topCategory,
                _id: { $nin: purchasedIds },
                inStock: true
            }).limit(8);

            return res.json({
                recommendations: categoryProducts,
                type: 'category-based',
                message: `More from ${topCategory}`
            });
        }

        // Final fallback: New arrivals
        const newArrivals = await Product.find({ inStock: true })
            .sort({ createdAt: -1 })
            .limit(8);

        res.json({
            recommendations: newArrivals,
            type: 'new-arrivals',
            message: 'Fresh arrivals'
        });

    } catch (error) {
        console.error('[CF] Error in getPersonalizedRecommendations:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/recommendations/similar-users
 * 
 * Returns products purchased by users with similar tastes
 * Uses User-Based Collaborative Filtering
 * 
 * @query {string} userId - The user ID to find similar users for
 * @returns {Object} { recommendations: Product[], similarUsers: number }
 */
export const getSimilarUsersRecommendations = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        await ensureMatrixFresh();

        // Get user-based recommendations
        const recommendations = cfEngine.recommendForUser(userId);

        if (recommendations.length === 0) {
            return res.json({
                recommendations: [],
                type: 'no-similar-users',
                message: 'Not enough data to find similar users'
            });
        }

        const productIds = recommendations.map(r => r.productId);
        const products = await Product.find({
            _id: { $in: productIds },
            inStock: true
        });

        // Sort by score
        const sortedProducts = productIds
            .map(id => products.find(p => p._id.toString() === id))
            .filter(Boolean);

        res.json({
            recommendations: sortedProducts,
            type: 'user-based-cf',
            message: 'Users like you also bought'
        });

    } catch (error) {
        console.error('[CF] Error in getSimilarUsersRecommendations:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * POST /api/recommendations/cart
 * 
 * Returns product recommendations based on items in the cart
 * Uses Item-Based Collaborative Filtering for "complete the set" suggestions
 * 
 * @body {Array<string>} cartItems - Array of product IDs currently in cart
 * @body {string} [userId] - Optional user ID for personalization
 * @returns {Object} { recommendations: Product[] }
 */
export const getCartRecommendations = async (req, res) => {
    try {
        const { cartItems, userId } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.json({
                recommendations: [],
                message: 'Cart is empty'
            });
        }

        await ensureMatrixFresh();

        // Get cart-based recommendations
        const recommendations = cfEngine.recommendForCart(cartItems, userId);

        if (recommendations.length === 0) {
            // Fallback: Random popular products not in cart
            const popularProducts = await Product.find({
                _id: { $nin: cartItems },
                inStock: true
            })
                .sort({ rating: -1 })
                .limit(4);

            return res.json({
                recommendations: popularProducts,
                type: 'popular',
                message: 'You might also like'
            });
        }

        const productIds = recommendations.map(r => r.productId);
        const products = await Product.find({
            _id: { $in: productIds },
            inStock: true
        });

        // Sort by score
        const sortedProducts = productIds
            .map(id => products.find(p => p._id.toString() === id))
            .filter(Boolean);

        res.json({
            recommendations: sortedProducts,
            type: 'cart-based-cf',
            message: 'Complete your order'
        });

    } catch (error) {
        console.error('[CF] Error in getCartRecommendations:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/recommendations/stats
 * 
 * Returns statistics about the recommendation engine (for debugging/admin)
 * @returns {Object} Engine statistics
 */
export const getRecommendationStats = async (req, res) => {
    try {
        await ensureMatrixFresh();

        const stats = cfEngine.getStats();
        const orderCount = await Order.countDocuments({ status: { $ne: 'Cancelled' } });
        const productCount = await Product.countDocuments();

        res.json({
            algorithm: 'Collaborative Filtering (Hybrid)',
            version: '2.0.0',
            matrixStats: stats,
            databaseStats: {
                totalOrders: orderCount,
                totalProducts: productCount
            },
            lastUpdated: lastMatrixUpdate,
            updateInterval: `${MATRIX_UPDATE_INTERVAL / 60000} minutes`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};