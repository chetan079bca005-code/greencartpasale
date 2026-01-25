/**
 * Dynamic Pricing Engine
 * 
 * Automatically suggests price adjustments based on:
 * 1. Sales Velocity (Demand): High demand -> Increase Price
 * 2. Stock Levels (Supply): Low stock + High demand -> Scarcity pricing
 * 3. Stagnant Stock: Low demand + High stock -> Clearance pricing
 * 
 * @module DynamicPricing
 */
class DynamicPricing {
    constructor() {
        this.salesHistory = new Map(); // productId -> count in last 30 days
    }

    /**
     * Calculates recommended price changes for products
     * @param {Array} products - List of all products
     * @param {Array} orders - Recent orders (last 30 days)
     * @returns {Array} List of products with suggested new prices
     */
    calculatePriceAdjustments(products, orders) {
        // 1. Calculate Sales Velocity
        this.salesHistory.clear();
        orders.forEach(order => {
            order.items.forEach(item => {
                const pid = item.product?._id?.toString() || item.product?.toString();
                if (pid) {
                    this.salesHistory.set(pid, (this.salesHistory.get(pid) || 0) + item.quantity);
                }
            });
        });

        const suggestions = [];

        products.forEach(product => {
            const soldCount = this.salesHistory.get(product._id.toString()) || 0;
            const stock = product.countInStock || 0;
            const price = product.price;

            let adjustment = 0;
            let reason = '';

            // Logic: High Demand + Low Stock = Scarcity (Increase Price)
            if (soldCount > 20 && stock < 10) {
                adjustment = 0.10; // +10%
                reason = 'High demand and low stock (Scarcity)';
            }
            // Logic: High Demand = Popularity (Increase Price)
            else if (soldCount > 50) {
                adjustment = 0.05; // +5%
                reason = 'High sales velocity';
            }
            // Logic: Zero Sales + High Stock = Dead Stock (Decrease Price)
            else if (soldCount === 0 && stock > 50) {
                adjustment = -0.10; // -10%
                reason = 'Overstock with no recent sales';
            }
            // Logic: Low Sales + very High Stock
            else if (soldCount < 5 && stock > 100) {
                adjustment = -0.05; // -5%
                reason = 'Slow moving inventory';
            }

            if (adjustment !== 0) {
                const newPrice = Math.round(price * (1 + adjustment));
                if (newPrice !== price) {
                    suggestions.push({
                        productId: product._id,
                        name: product.name,
                        currentPrice: price,
                        suggestedPrice: newPrice,
                        percentageChange: `${(adjustment * 100).toFixed(0)}%`,
                        stock,
                        salesLast30Days: soldCount,
                        reason
                    });
                }
            }
        });

        return suggestions.sort((a, b) => b.salesLast30Days - a.salesLast30Days);
    }
}

export default new DynamicPricing();
