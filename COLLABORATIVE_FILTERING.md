# Collaborative Filtering in GreenCart

This document provides a detailed explanation of the **Collaborative Filtering (CF)** algorithm implemented in the GreenCart project. It explains how the algorithm works, where to find the code, and how it is applied in the application.

## 📂 File Locations

| Component | File Path | Description |
|-----------|-----------|-------------|
| **Core Algorithm** | `server/utils/collaborativeFiltering.js` | The main class implementing User-Based, Item-Based, and Hybrid CF logic. |
| **Controller** | `server/controllers/recommendationController.js` | API handlers that use the CF engine to serve recommendations. |
| **Routes** | `server/routes/recommendationRoutes.js` | API endpoints exposing the recommendation features. |
| **Frontend Usage** | `client/src/pages/ProductDetail.jsx` | Displays "Frequently Bought Together" items. |
| **Frontend Usage** | `client/src/pages/Home.jsx` | Displays "Personalized For You" and "Similar Users" sections. |

---

## 🛠 Working Mechanism

Collaborative Filtering is a technique used by recommender systems to make predictions (filtering) about the interests of a user by collecting preferences or taste information from many users (collaborating).

We use a **Memory-Based Hybrid approach**, combining two techniques:

### 1. User-Based Collaborative Filtering (User-User CF)
*   **Concept:** "Users who are similar to you also liked..."
*   **Logic:** 
    1.  Find users who have purchased similar items to the current user (Neighbors).
    2.  Calculate similarity scores (using Cosine Similarity) between the current user and neighbors.
    3.  Recommend items that neighbors bought but the current user hasn't.

### 2. Item-Based Collaborative Filtering (Item-Item CF)
*   **Concept:** "Because you bought X, you might like Y..."
*   **Logic:**
    1.  Analyze purchase history to find items that are frequently bought together.
    2.  If a user buys Item A, and Item A is highly correlated with Item B, recommend Item B.
    3.  This is more stable than User-User CF because item relationships change less frequently than user tastes.

### 3. Hybrid Approach
*   **Why?** User-based is good for serendipity (finding new things), while Item-based is good for relevance.
*   **Logic:** We calculate scores from both methods and combine them using a weighted average (e.g., 60% Item-based + 40% User-based) to get the best of both worlds.

---

## 💻 The Algorithm Logic

The core logic is encapsulated in the `CollaborativeFiltering` class. Here is a breakdown of the key methods:

### 1. Building the Interaction Matrix (`buildMatrix`)
Before making recommendations, we transform raw order data into a mathematical matrix.

```javascript
// server/utils/collaborativeFiltering.js

buildMatrix(orders, products = []) {
    // ... (initialization)

    orders.forEach(order => {
        // ...
        order.items.forEach(item => {
            // Calculate an "Interest Score" based on actions
            let interactionScore = item.quantity || 1;
            
            if (order.status === 'Delivered') {
                interactionScore *= 1.5; // Boost score for completed orders
            } else if (order.status === 'Cancelled') {
                return; // Ignore cancelled orders
            }

            // Map: UserID -> ProductID -> Score
            const currentScore = userMap.get(productId) || 0;
            userMap.set(productId, currentScore + interactionScore);

            // Map: ProductID -> UserID -> Score (Inverse matrix for Item-Based CF)
            // ...
        });
    });
}
```

### 2. Calculating Similarity (`cosineSimilarity`)
We use **Cosine Similarity** to measure how similar two vectors (users or items) are. It measures the cosine of the angle between two vectors projected in a multi-dimensional space.

```javascript
cosineSimilarity(vectorA, vectorB) {
    // ...
    // Dot Product / (Magnitude(A) * Magnitude(B))
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
}
```
*   **Result:** A number between 0 (completely different) and 1 (identical).

### 3. Generating Recommendations (`recommendHybrid`)
This combines the results.

```javascript
recommendHybrid(userId, userWeight = 0.5) {
    // 1. Get User-Based Recommendations
    const userBased = this.recommendForUser(userId);
    
    // 2. Get Item-Based Recommendations
    const itemBased = this.recommendItemBased(userId);

    // 3. Combine scores
    const itemWeight = 1 - userWeight;
    // ... merge logic ...
    
    // 4. Return sorted top results
    return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, this.maxRecommendations);
}
```

---

## 🚀 Application in the Project

The algorithm is integrated into the server and exposed via API endpoints.

### 1. Frequently Bought Together (Product Page)
When viewing a product, we show items similar to it effectively "completing the set".
*   **API:** `GET /api/recommendations/frequently-bought/:productId`
*   **Method:** `cfEngine.getSimilarProducts(productId)` (Item-Item CF)
*   **Fallback:** If not enough data, it falls back to products in the same **Category**.

### 2. Personalized Home Feed
On the homepage, we show a "Personalized for you" section.
*   **API:** `GET /api/recommendations/personalized?userId=...`
*   **Method:** `cfEngine.recommendHybrid(userId)`
*   **Fallback:** If the user is new (Cold Start), it shows **Popular Products** or **New Arrivals**.

### 3. Cart Suggestions
In the cart, we suggest items that go well with what you're already buying.
*   **API:** `POST /api/recommendations/cart`
*   **Method:** `cfEngine.recommendForCart(cartItems)`
*   **Logic:** Finds items similar to *any* item currently in your cart, excluding what you already have.

---

## 📈 Code Snippet: Main Recommendation Function

Here is the exact code for the User-Based recommendation logic from `server/utils/collaborativeFiltering.js`:

```javascript
    /**
     * USER-BASED COLLABORATIVE FILTERING
     * Recommends products that similar users have purchased
     */
    recommendForUser(userId) {
        // 1. Get the target user's interaction vector
        const userVector = this.userItemMatrix.get(userId);
        const purchasedProducts = userVector ? new Set(userVector.keys()) : new Set();
        
        // 2. Find similar users (Nearest Neighbors)
        const similarUsers = this.findSimilarUsers(userId);
        
        if (similarUsers.length === 0) return [];

        const productScores = new Map();

        // 3. Aggregate product scores from neighbors
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

        // 4. Normalize and Return
        const recommendations = [];
        productScores.forEach((data, productId) => {
            const normalizedScore = data.score / data.totalSimilarity;
            recommendations.push({
                productId,
                score: normalizedScore,
                reason: 'Users with similar taste also bought this'
            });
        });

        return recommendations
            .sort((a, b) => b.score - a.score) // Highest score first
            .slice(0, this.maxRecommendations); // Top N
    }
```
