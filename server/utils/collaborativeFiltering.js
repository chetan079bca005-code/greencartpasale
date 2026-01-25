/**
 * Collaborative Filtering Recommendation Engine
 * 
 * This module implements both User-Based and Item-Based Collaborative Filtering
 * algorithms for generating product recommendations in an e-commerce platform.
 * 
 * @module CollaborativeFiltering
 * @author GreenCart Team
 * @version 2.0.0
 */

/**
 * CollaborativeFiltering Class
 * 
 * Implements memory-based collaborative filtering using:
 * - User-User Collaborative Filtering: Finds similar users and recommends what they purchased
 * - Item-Item Collaborative Filtering: Finds similar products based on co-purchase patterns
 * - Hybrid approach: Combines both methods for better recommendations
 */
class CollaborativeFiltering {
    /**
     * Creates an instance of CollaborativeFiltering
     * @param {Object} options - Configuration options
     * @param {number} [options.similarityThreshold=0.1] - Minimum similarity score to consider
     * @param {number} [options.maxNeighbors=10] - Maximum number of similar users/items to consider
     * @param {number} [options.maxRecommendations=10] - Maximum recommendations to return
     */
    constructor(options = {}) {
        this.similarityThreshold = options.similarityThreshold || 0.1;
        this.maxNeighbors = options.maxNeighbors || 10;
        this.maxRecommendations = options.maxRecommendations || 10;
        
        // Data structures for caching
        this.userItemMatrix = new Map(); // userId -> Map(productId -> rating/interaction score)
        this.itemUserMatrix = new Map(); // productId -> Map(userId -> rating/interaction score)
        this.userSimilarity = new Map(); // userId -> Map(userId -> similarity)
        this.itemSimilarity = new Map(); // productId -> Map(productId -> similarity)
    }

    /**
     * Builds the user-item interaction matrix from order data
     * @param {Array} orders - Array of order objects with userId and items
     * @param {Array} products - Array of product objects for category weighting
     */
    buildMatrix(orders, products = []) {
        this.userItemMatrix.clear();
        this.itemUserMatrix.clear();
        
        // Create product category map for hybrid scoring
        const productCategories = new Map();
        products.forEach(p => productCategories.set(p._id.toString(), p.category));

        orders.forEach(order => {
            const userId = order.userId?.toString();
            if (!userId) return;

            // Initialize user map if not exists
            if (!this.userItemMatrix.has(userId)) {
                this.userItemMatrix.set(userId, new Map());
            }

            const userMap = this.userItemMatrix.get(userId);

            order.items.forEach(item => {
                const productId = item.product?.toString() || item.product?._id?.toString();
                if (!productId) return;

                // Calculate interaction score based on:
                // - Quantity purchased (more = higher interest)
                // - Order status (delivered = confirmed interest)
                // - Recency (recent orders weighted higher)
                let interactionScore = item.quantity || 1;
                
                if (order.status === 'Delivered') {
                    interactionScore *= 1.5; // Boost for completed purchases
                } else if (order.status === 'Cancelled') {
                    interactionScore *= 0; // Zero out cancelled orders
                    return;
                }

                // Add to user-item matrix
                const currentScore = userMap.get(productId) || 0;
                userMap.set(productId, currentScore + interactionScore);

                // Build item-user matrix simultaneously
                if (!this.itemUserMatrix.has(productId)) {
                    this.itemUserMatrix.set(productId, new Map());
                }
                const itemMap = this.itemUserMatrix.get(productId);
                const currentItemScore = itemMap.get(userId) || 0;
                itemMap.set(userId, currentItemScore + interactionScore);
            });
        });

        console.log(`[CF] Matrix built: ${this.userItemMatrix.size} users, ${this.itemUserMatrix.size} products`);
    }

    /**
     * Calculates Cosine Similarity between two vectors
     * @param {Map} vectorA - First vector as Map(id -> score)
     * @param {Map} vectorB - Second vector as Map(id -> score)
     * @returns {number} Similarity score between 0 and 1
     */
    cosineSimilarity(vectorA, vectorB) {
        if (!vectorA || !vectorB || vectorA.size === 0 || vectorB.size === 0) return 0;

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        // Get all keys from both vectors
        const allKeys = new Set([...vectorA.keys(), ...vectorB.keys()]);

        allKeys.forEach(key => {
            const a = vectorA.get(key) || 0;
            const b = vectorB.get(key) || 0;
            dotProduct += a * b;
            normA += a * a;
            normB += b * b;
        });

        const denominator = Math.sqrt(normA) * Math.sqrt(normB);
        return denominator === 0 ? 0 : dotProduct / denominator;
    }

    /**
     * Calculates Pearson Correlation Coefficient between two vectors
     * @param {Map} vectorA - First vector as Map(id -> score)
     * @param {Map} vectorB - Second vector as Map(id -> score)
     * @returns {number} Correlation coefficient between -1 and 1
     */
    pearsonCorrelation(vectorA, vectorB) {
        if (!vectorA || !vectorB || vectorA.size === 0 || vectorB.size === 0) return 0;

        // Find common items
        const commonKeys = [...vectorA.keys()].filter(k => vectorB.has(k));
        if (commonKeys.length < 2) return 0;

        // Calculate means
        let sumA = 0, sumB = 0;
        commonKeys.forEach(key => {
            sumA += vectorA.get(key);
            sumB += vectorB.get(key);
        });
        const meanA = sumA / commonKeys.length;
        const meanB = sumB / commonKeys.length;

        // Calculate Pearson correlation
        let numerator = 0;
        let denomA = 0, denomB = 0;

        commonKeys.forEach(key => {
            const diffA = vectorA.get(key) - meanA;
            const diffB = vectorB.get(key) - meanB;
            numerator += diffA * diffB;
            denomA += diffA * diffA;
            denomB += diffB * diffB;
        });

        const denominator = Math.sqrt(denomA) * Math.sqrt(denomB);
        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Calculates Jaccard Similarity for binary interactions
     * @param {Map} vectorA - First vector
     * @param {Map} vectorB - Second vector
     * @returns {number} Jaccard index between 0 and 1
     */
    jaccardSimilarity(vectorA, vectorB) {
        if (!vectorA || !vectorB) return 0;

        const setA = new Set(vectorA.keys());
        const setB = new Set(vectorB.keys());

        let intersection = 0;
        setA.forEach(item => {
            if (setB.has(item)) intersection++;
        });

        const union = setA.size + setB.size - intersection;
        return union === 0 ? 0 : intersection / union;
    }

    /**
     * Finds similar users for a target user using User-Based CF
     * @param {string} targetUserId - The user to find neighbors for
     * @returns {Array<{userId: string, similarity: number}>} Sorted array of similar users
     */
    findSimilarUsers(targetUserId) {
        const targetVector = this.userItemMatrix.get(targetUserId);
        if (!targetVector) return [];

        const similarities = [];

        this.userItemMatrix.forEach((userVector, userId) => {
            if (userId === targetUserId) return;

            const similarity = this.cosineSimilarity(targetVector, userVector);
            
            if (similarity > this.similarityThreshold) {
                similarities.push({ userId, similarity });
            }
        });

        // Sort by similarity descending and limit
        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, this.maxNeighbors);
    }

    /**
     * Finds similar items for a target product using Item-Based CF
     * @param {string} targetProductId - The product to find similar items for
     * @returns {Array<{productId: string, similarity: number}>} Sorted array of similar products
     */
    findSimilarItems(targetProductId) {
        const targetVector = this.itemUserMatrix.get(targetProductId);
        if (!targetVector) return [];

        const similarities = [];

        this.itemUserMatrix.forEach((itemVector, productId) => {
            if (productId === targetProductId) return;

            const similarity = this.cosineSimilarity(targetVector, itemVector);
            
            if (similarity > this.similarityThreshold) {
                similarities.push({ productId, similarity });
            }
        });

        // Sort by similarity descending and limit
        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, this.maxNeighbors);
    }

    /**
     * USER-BASED COLLABORATIVE FILTERING
     * Recommends products that similar users have purchased
     * @param {string} userId - Target user ID
     * @returns {Array<{productId: string, score: number, reason: string}>} Recommended products
     */
    recommendForUser(userId) {
        const userVector = this.userItemMatrix.get(userId);
        const purchasedProducts = userVector ? new Set(userVector.keys()) : new Set();
        
        // Find similar users
        const similarUsers = this.findSimilarUsers(userId);
        
        if (similarUsers.length === 0) {
            return [];
        }

        // Aggregate product scores from similar users
        const productScores = new Map();

        similarUsers.forEach(({ userId: neighborId, similarity }) => {
            const neighborVector = this.userItemMatrix.get(neighborId);
            
            neighborVector.forEach((score, productId) => {
                // Skip products the user already purchased
                if (purchasedProducts.has(productId)) return;

                // Weighted score = neighbor's rating * similarity
                const weightedScore = score * similarity;
                const current = productScores.get(productId) || { score: 0, totalSimilarity: 0 };
                
                productScores.set(productId, {
                    score: current.score + weightedScore,
                    totalSimilarity: current.totalSimilarity + similarity
                });
            });
        });

        // Normalize and convert to array
        const recommendations = [];
        productScores.forEach((data, productId) => {
            const normalizedScore = data.score / data.totalSimilarity;
            recommendations.push({
                productId,
                score: normalizedScore,
                reason: 'Users with similar taste also bought this'
            });
        });

        // Sort by score and limit
        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, this.maxRecommendations);
    }

    /**
     * ITEM-BASED COLLABORATIVE FILTERING
     * Recommends products similar to items the user has interacted with
     * @param {string} userId - Target user ID
     * @returns {Array<{productId: string, score: number, reason: string}>} Recommended products
     */
    recommendItemBased(userId) {
        const userVector = this.userItemMatrix.get(userId);
        if (!userVector || userVector.size === 0) return [];

        const purchasedProducts = new Set(userVector.keys());
        const productScores = new Map();

        // For each product the user purchased
        purchasedProducts.forEach(purchasedId => {
            const userScore = userVector.get(purchasedId);
            
            // Find similar items
            const similarItems = this.findSimilarItems(purchasedId);
            
            similarItems.forEach(({ productId, similarity }) => {
                // Skip already purchased products
                if (purchasedProducts.has(productId)) return;

                // Score = user's rating for original item * similarity
                const weightedScore = userScore * similarity;
                const current = productScores.get(productId) || { score: 0, count: 0 };
                
                productScores.set(productId, {
                    score: current.score + weightedScore,
                    count: current.count + 1
                });
            });
        });

        // Convert to array and normalize
        const recommendations = [];
        productScores.forEach((data, productId) => {
            recommendations.push({
                productId,
                score: data.score / data.count,
                reason: 'Similar to products you purchased'
            });
        });

        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, this.maxRecommendations);
    }

    /**
     * HYBRID RECOMMENDATION
     * Combines User-Based and Item-Based CF with weighted average
     * @param {string} userId - Target user ID
     * @param {number} [userWeight=0.5] - Weight for user-based recommendations (0-1)
     * @returns {Array<{productId: string, score: number, reason: string}>} Hybrid recommendations
     */
    recommendHybrid(userId, userWeight = 0.5) {
        const userBased = this.recommendForUser(userId);
        const itemBased = this.recommendItemBased(userId);

        const itemWeight = 1 - userWeight;
        const combinedScores = new Map();

        // Add user-based scores
        userBased.forEach(({ productId, score, reason }) => {
            combinedScores.set(productId, {
                score: score * userWeight,
                reason
            });
        });

        // Add item-based scores
        itemBased.forEach(({ productId, score, reason }) => {
            const current = combinedScores.get(productId) || { score: 0, reason: '' };
            combinedScores.set(productId, {
                score: current.score + score * itemWeight,
                reason: current.reason || reason
            });
        });

        // Convert to array
        const recommendations = [];
        combinedScores.forEach((data, productId) => {
            recommendations.push({
                productId,
                score: data.score,
                reason: data.reason
            });
        });

        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, this.maxRecommendations);
    }

    /**
     * GET SIMILAR PRODUCTS
     * Returns products frequently bought together with the given product
     * (Item-Item Collaborative Filtering)
     * @param {string} productId - Target product ID
     * @returns {Array<{productId: string, similarity: number}>} Similar products
     */
    getSimilarProducts(productId) {
        return this.findSimilarItems(productId);
    }

    /**
     * CART RECOMMENDATIONS
     * Recommends products based on items currently in the cart
     * Uses Item-Based CF for "You might also like" suggestions
     * @param {Array<string>} cartProductIds - Array of product IDs in cart
     * @param {string} [userId] - Optional user ID for personalization
     * @returns {Array<{productId: string, score: number, reason: string}>} Recommendations
     */
    recommendForCart(cartProductIds, userId = null) {
        const cartSet = new Set(cartProductIds);
        const productScores = new Map();

        // Also exclude user's purchased products if logged in
        let purchasedProducts = new Set();
        if (userId) {
            const userVector = this.userItemMatrix.get(userId);
            if (userVector) {
                purchasedProducts = new Set(userVector.keys());
            }
        }

        // Find similar items for each cart item
        cartProductIds.forEach(cartProductId => {
            const similarItems = this.findSimilarItems(cartProductId);
            
            similarItems.forEach(({ productId, similarity }) => {
                // Skip items in cart or already purchased
                if (cartSet.has(productId) || purchasedProducts.has(productId)) return;

                const current = productScores.get(productId) || { score: 0, count: 0 };
                productScores.set(productId, {
                    score: current.score + similarity,
                    count: current.count + 1
                });
            });
        });

        // Convert and sort
        const recommendations = [];
        productScores.forEach((data, productId) => {
            recommendations.push({
                productId,
                score: data.score / data.count,
                reason: 'Frequently bought together'
            });
        });

        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, this.maxRecommendations);
    }

    /**
     * GET STATISTICS
     * Returns statistics about the recommendation engine
     * @returns {Object} Statistics object
     */
    getStats() {
        return {
            totalUsers: this.userItemMatrix.size,
            totalProducts: this.itemUserMatrix.size,
            similarityThreshold: this.similarityThreshold,
            maxNeighbors: this.maxNeighbors,
            maxRecommendations: this.maxRecommendations
        };
    }

    /**
     * COLD START HANDLING
     * Returns popular products for new users with no purchase history
     * @param {Map} userItemMatrix - The user-item matrix
     * @returns {Array<{productId: string, score: number}>} Popular products
     */
    getPopularProducts() {
        const productPopularity = new Map();

        this.itemUserMatrix.forEach((userMap, productId) => {
            let totalScore = 0;
            userMap.forEach(score => {
                totalScore += score;
            });
            productPopularity.set(productId, {
                score: totalScore,
                uniqueBuyers: userMap.size
            });
        });

        const popular = [];
        productPopularity.forEach((data, productId) => {
            popular.push({
                productId,
                score: data.score,
                buyers: data.uniqueBuyers,
                reason: 'Popular among customers'
            });
        });

        return popular
            .sort((a, b) => b.score - a.score)
            .slice(0, this.maxRecommendations);
    }
}

export default CollaborativeFiltering;
