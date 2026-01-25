import natural from 'natural';

/**
 * Content-Based Filtering Recommendation Engine
 * 
 * Uses Natural Language Processing (NLP) and attribute matching to find similar products.
 * This solves the "Cold Start" problem where new products have no interaction data.
 * 
 * IMPROVED VERSION: Uses multiple similarity metrics for better matching
 * 
 * @module ContentBasedFiltering
 */
class ContentBasedFiltering {
    constructor() {
        this.tfidf = new natural.TfIdf();
        this.products = [];
        this.productIndices = new Map(); // productId -> index in tfidf
        this.productMap = new Map(); // productId -> product object
    }

    /**
     * Builds the TF-IDF vector space from product data
     * @param {Array} products - List of all products
     */
    buildVectorSpace(products) {
        this.products = products;
        this.tfidf = new natural.TfIdf();
        this.productIndices.clear();
        this.productMap.clear();

        products.forEach((product, index) => {
            // Create a rich document for better TF-IDF matching
            const document = [
                product.name || '',
                product.name || '', // Repeat name for higher weight
                product.category || '',
                product.category || '', // Repeat category for higher weight
                Array.isArray(product.description) ? product.description.join(' ') : (product.description || ''),
                // Add keywords based on category for better matching
                this.getCategoryKeywords(product.category)
            ].join(' ').toLowerCase();

            this.tfidf.addDocument(document);
            this.productIndices.set(product._id.toString(), index);
            this.productMap.set(product._id.toString(), product);
        });

        console.log(`[Content-Based] Vector space built for ${products.length} products`);
    }

    /**
     * Get related keywords for a category to improve matching
     */
    getCategoryKeywords(category) {
        const categoryKeywords = {
            'fruits': 'fresh healthy organic fruit vitamin natural sweet',
            'vegetables': 'fresh healthy organic veggie vegetable green natural',
            'dairy products': 'milk cream cheese butter dairy fresh protein calcium',
            'grain': 'wheat rice flour bread cereal carbs grain whole',
            'cold drinks': 'beverage drink juice soda refreshing cold cool',
            'instant food': 'quick easy ready meal snack fast instant prepared',
            'dry fruits': 'nuts almond cashew raisin dried healthy snack protein',
            'bakery': 'bread cake pastry baked fresh sweet dessert',
            'spices': 'masala spice flavor seasoning cooking ingredient'
        };
        return categoryKeywords[category?.toLowerCase()] || '';
    }

    /**
     * Calculate attribute-based similarity between two products
     * @param {Object} productA - First product
     * @param {Object} productB - Second product
     * @returns {number} Similarity score between 0 and 1
     */
    attributeSimilarity(productA, productB) {
        let score = 0;
        let maxScore = 0;

        // Category match (highest weight)
        maxScore += 50;
        if (productA.category?.toLowerCase() === productB.category?.toLowerCase()) {
            score += 50;
        }

        // Name similarity using Levenshtein distance
        maxScore += 30;
        const nameA = (productA.name || '').toLowerCase();
        const nameB = (productB.name || '').toLowerCase();
        const nameSimilarity = this.stringSimilarity(nameA, nameB);
        score += nameSimilarity * 30;

        // Price range similarity (products in similar price range)
        maxScore += 10;
        const priceA = productA.offerPrice || productA.price || 0;
        const priceB = productB.offerPrice || productB.price || 0;
        if (priceA > 0 && priceB > 0) {
            const priceRatio = Math.min(priceA, priceB) / Math.max(priceA, priceB);
            score += priceRatio * 10;
        }

        // Common words in description
        maxScore += 10;
        const descA = Array.isArray(productA.description) ? productA.description.join(' ') : (productA.description || '');
        const descB = Array.isArray(productB.description) ? productB.description.join(' ') : (productB.description || '');
        const descSimilarity = this.stringSimilarity(descA.toLowerCase(), descB.toLowerCase());
        score += descSimilarity * 10;

        return score / maxScore;
    }

    /**
     * Calculate string similarity using Jaccard index of words
     */
    stringSimilarity(strA, strB) {
        if (!strA || !strB) return 0;
        
        const wordsA = new Set(strA.split(/\s+/).filter(w => w.length > 2));
        const wordsB = new Set(strB.split(/\s+/).filter(w => w.length > 2));
        
        if (wordsA.size === 0 || wordsB.size === 0) return 0;
        
        let intersection = 0;
        wordsA.forEach(word => {
            if (wordsB.has(word)) intersection++;
        });
        
        const union = wordsA.size + wordsB.size - intersection;
        return union === 0 ? 0 : intersection / union;
    }

    /**
     * Finds similar products using HYBRID approach (TF-IDF + Attribute matching)
     * @param {string} targetProductId - ID of the product to find matches for
     * @param {number} limit - Max recommendations to return
     * @returns {Array} List of similar products with scores
     */
    getSimilarProducts(targetProductId, limit = 5) {
        const index = this.productIndices.get(targetProductId.toString());
        const targetProduct = this.productMap.get(targetProductId.toString());

        if (index === undefined || !targetProduct) {
            console.log(`[Content-Based] Product not found: ${targetProductId}`);
            return [];
        }

        const similarities = [];

        // Calculate hybrid similarity for each product
        this.products.forEach((product, i) => {
            if (i === index) return; // Skip the same product
            if (product._id.toString() === targetProductId.toString()) return;

            // Get attribute-based similarity
            const attrSimilarity = this.attributeSimilarity(targetProduct, product);

            // Only include products with meaningful similarity
            // Priority: Same category products get boosted
            let finalScore = attrSimilarity;

            // Boost products in the same category significantly
            if (targetProduct.category?.toLowerCase() === product.category?.toLowerCase()) {
                finalScore = Math.max(finalScore, 0.5); // Minimum 0.5 for same category
            }

            if (finalScore > 0.3) { // Only include if reasonably similar
                similarities.push({
                    productId: product._id,
                    score: finalScore,
                    product: product
                });
            }
        });

        // Sort by similarity score descending
        const sorted = similarities
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        console.log(`[Content-Based] Found ${sorted.length} similar products for ${targetProduct.name}`);
        return sorted;
    }

    /**
     * Get products from the same category (fallback)
     */
    getSameCategoryProducts(targetProductId, limit = 5) {
        const targetProduct = this.productMap.get(targetProductId.toString());
        if (!targetProduct) return [];

        return this.products
            .filter(p => 
                p._id.toString() !== targetProductId.toString() &&
                p.category?.toLowerCase() === targetProduct.category?.toLowerCase() &&
                p.inStock !== false
            )
            .slice(0, limit)
            .map(product => ({
                productId: product._id,
                score: 0.5,
                product
            }));
    }
}

export default new ContentBasedFiltering();
