# GreenCart Pasale - AI-Powered E-Commerce Platform

Welcome to **GreenCart Pasale**, a modern, premium e-commerce solution built with the MERN stack (MongoDB, Express, React, Node.js). This project features **Collaborative Filtering** algorithms to provide personalized product recommendations.

---

## 🧠 Recommendation System: Collaborative Filtering

### Overview

GreenCart uses **Memory-Based Collaborative Filtering** to provide personalized product recommendations. This approach analyzes user behavior patterns to find similarities and generate relevant suggestions.

**Upgrade:** The system was upgraded from **Association Mining (Apriori)** to **Collaborative Filtering** for better personalization.

---

### Algorithm Types Implemented

#### 1. User-Based Collaborative Filtering (User-User CF)

**Concept:** "Users who are similar to you also bought these products"

**How it works:**
1. Build a **User-Item Matrix** where rows are users and columns are products
2. Calculate similarity between users using **Cosine Similarity**
3. Find K most similar users (neighbors)
4. Recommend products that neighbors purchased but the target user hasn't

**Mathematical Formula - Cosine Similarity:**
```
Similarity(u, v) = Σ(r_ui × r_vi) / (√Σr_ui² × √Σr_vi²)
```

Where:
- u, v = Two users being compared
- r_ui = User u's interaction score for product i

**Prediction Formula:**
```
Predicted_Score(u, i) = Σ[sim(u,v) × r_vi] / Σ|sim(u,v)|
```

#### 2. Item-Based Collaborative Filtering (Item-Item CF)

**Concept:** "Products similar to what you purchased"

**How it works:**
1. Build an **Item-User Matrix** (transpose of User-Item Matrix)
2. Calculate similarity between products based on co-purchase patterns
3. For each product the user bought, find similar products
4. Aggregate and rank recommendations

**Use Cases:**
- "Frequently Bought Together" on product pages
- "Complete Your Order" suggestions in cart

#### 3. Hybrid Approach

**Concept:** Combines User-Based and Item-Based CF for better accuracy

```
Hybrid_Score = α × UserBased(u, i) + (1 - α) × ItemBased(u, i)
```

Where α is typically 0.5-0.6 (configured in the system)

---

### File Structure

```
server/
├── utils/
│   └── collaborativeFiltering.js    # Core CF algorithm implementation
├── controllers/
│   └── recommendationController.js  # API endpoint handlers
└── routes/
    └── recommendationRoutes.js      # API route definitions
```

---

### Core Algorithm Implementation

```javascript
// server/utils/collaborativeFiltering.js

class CollaborativeFiltering {
    constructor(options = {}) {
        this.similarityThreshold = options.similarityThreshold || 0.1;
        this.maxNeighbors = options.maxNeighbors || 10;
        this.maxRecommendations = options.maxRecommendations || 10;
        
        this.userItemMatrix = new Map();  // userId -> Map(productId -> score)
        this.itemUserMatrix = new Map();  // productId -> Map(userId -> score)
    }

    // Build user-item interaction matrix from orders
    buildMatrix(orders, products = []) {
        orders.forEach(order => {
            const userId = order.userId?.toString();
            if (!userId) return;

            order.items.forEach(item => {
                const productId = item.product?.toString();
                let interactionScore = item.quantity || 1;
                
                // Boost score for completed purchases
                if (order.status === 'Delivered') {
                    interactionScore *= 1.5;
                }

                // Add to user-item matrix (bidirectional)
                // ...
            });
        });
    }

    // Cosine Similarity calculation
    cosineSimilarity(vectorA, vectorB) {
        let dotProduct = 0, normA = 0, normB = 0;

        const allKeys = new Set([...vectorA.keys(), ...vectorB.keys()]);
        allKeys.forEach(key => {
            const a = vectorA.get(key) || 0;
            const b = vectorB.get(key) || 0;
            dotProduct += a * b;
            normA += a * a;
            normB += b * b;
        });

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    // Find K nearest neighbors
    findSimilarUsers(targetUserId) {
        const targetVector = this.userItemMatrix.get(targetUserId);
        const similarities = [];

        this.userItemMatrix.forEach((userVector, userId) => {
            if (userId === targetUserId) return;
            const similarity = this.cosineSimilarity(targetVector, userVector);
            if (similarity > this.similarityThreshold) {
                similarities.push({ userId, similarity });
            }
        });

        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, this.maxNeighbors);
    }

    // Generate recommendations
    recommendForUser(userId) {
        const similarUsers = this.findSimilarUsers(userId);
        const productScores = new Map();

        similarUsers.forEach(({ userId: neighborId, similarity }) => {
            const neighborVector = this.userItemMatrix.get(neighborId);
            
            neighborVector.forEach((score, productId) => {
                // Weighted score = neighbor's score × similarity
                const weightedScore = score * similarity;
                // Aggregate scores from all neighbors...
            });
        });

        return [...productScores.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, this.maxRecommendations);
    }
}
```

---

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/recommendations/personalized` | GET | Get personalized recommendations (Hybrid CF) |
| `/api/recommendations/frequently-bought/:productId` | GET | Get similar products (Item-Based CF) |
| `/api/recommendations/similar-users` | GET | Get recommendations from similar users |
| `/api/recommendations/cart` | POST | Get cart-based suggestions |
| `/api/recommendations/stats` | GET | Get engine statistics |

#### Example API Calls

```javascript
// Get personalized recommendations for logged-in user
const { data } = await axios.get('/api/recommendations/personalized', {
    params: { userId: user._id }
});

// Get "Frequently Bought Together" for a product
const { data } = await axios.get(`/api/recommendations/frequently-bought/${productId}`);

// Get cart recommendations
const { data } = await axios.post('/api/recommendations/cart', {
    cartItems: ['product_id_1', 'product_id_2'],
    userId: user._id
});
```

---

### Where Recommendations Are Used

| Location | Type | Algorithm Used |
|----------|------|----------------|
| **Home Page** | "Recommended For You" | Hybrid CF |
| **Home Page** | "Users Like You Also Viewed" | User-Based CF |
| **Product Page** | "Frequently Bought Together" | Item-Based CF |
| **Cart Page** | "Complete Your Order" | Cart-Based CF |

---

### Cold Start Problem Handling

When new users have no purchase history, the system falls back to:

1. **Popular Products** - Items with highest aggregate purchase scores
2. **Top Rated Products** - Products with best ratings
3. **New Arrivals** - Recently added products

---

### Algorithm Comparison: Old vs New

| Feature | Association Mining (Old) | Collaborative Filtering (New) |
|---------|-------------------------|------------------------------|
| **Approach** | Find frequent itemsets | Find similar users/items |
| **Personalization** | Low (same rules for all) | High (personalized to each user) |
| **Accuracy** | Good for "bought together" | Better for personalization |
| **Scalability** | Rule explosion issues | Scales with optimization |

---

## 💎 Premium UI/UX Features

- **Glassmorphism Design:** Subtle transparency and blur effects on navigation and modals.
- **Micro-Animations:** Smooth hover transitions, floating elements, and scroll-triggered animations.
- **Dark/Light Mode:** Beautiful theme support with smooth transitions.
- **Responsive Fluid Layout:** Designed to look stunning on 4K monitors down to small mobile screens.
- **Smart Notifications:** Real-time toast notifications and order status updates.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4.0
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Payments:** Stripe & eSewa (integrated)
- **Cloud Storage:** Cloudinary (for product images)
- **AI/ML:** Collaborative Filtering (custom implementation)

---

## 📦 Getting Started

1. **Install Dependencies:**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
2. **Environment Setup:**
   Configure your `.env` files in both client and server directories with your API keys.
3. **Run the Application:**
   - Server: `npm run dev` (in server folder)
   - Client: `npm run dev` (in client folder)

---

## 🔧 Configuration

### Recommendation Engine Settings

```javascript
// In recommendationController.js
const cfEngine = new CollaborativeFiltering({
    similarityThreshold: 0.05,   // Minimum similarity to consider
    maxNeighbors: 15,            // K nearest neighbors
    maxRecommendations: 10       // Max recommendations to return
});

// Matrix refresh interval
const MATRIX_UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutes
```

---

## 📊 API Response Examples

### Personalized Recommendations

```json
{
    "recommendations": [
        {
            "_id": "product_id",
            "name": "Organic Apples",
            "price": 150,
            "category": "Fruits",
            "image": ["url"]
        }
    ],
    "type": "collaborative-filtering",
    "message": "Personalized for you"
}
```

### Engine Statistics

```json
{
    "algorithm": "Collaborative Filtering (Hybrid)",
    "version": "2.0.0",
    "matrixStats": {
        "totalUsers": 150,
        "totalProducts": 200,
        "similarityThreshold": 0.05
    },
    "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

---

## 👨‍💻 Project Upgrade Summary

This project was upgraded from a simple CRUD application with **Association Mining (Apriori)** to an **AI-powered e-commerce platform** using **Collaborative Filtering**. The new algorithm provides:

- ✅ Personalized recommendations for each user
- ✅ "Users like you also bought" suggestions
- ✅ Smart cart recommendations
- ✅ Cold start handling for new users
- ✅ Real-time notification system for order updates

---

## 📝 License

This project is licensed under the MIT License.
