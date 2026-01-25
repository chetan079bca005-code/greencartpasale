/**
 * Inventory Forecasting Engine
 * 
 * Uses Time Series Analysis (Moving Average) to predict when items will go out of stock.
 * Helps sellers prevent stockouts by alerting them in advance.
 * 
 * @module InventoryForecasting
 */
class InventoryForecasting {
    constructor() {
        // Map to store daily sales for each product
        this.dailySales = new Map(); // productId -> { date: count }
    }

    /**
     * Predicts stockout dates for products based on recent sales velocity
     * @param {Array} products - List of all products
     * @param {Array} orders - Recent orders (last 30 days)
     * @returns {Array} List of products at risk of stockout
     */
    predictStockOuts(products, orders) {
        this.dailySales.clear();

        // 1. Aggregate daily sales
        orders.forEach(order => {
            const dateKey = new Date(order.createdAt).toISOString().split('T')[0];

            order.items.forEach(item => {
                const pid = item.product?._id?.toString() || item.product?.toString();
                if (pid) {
                    if (!this.dailySales.has(pid)) {
                        this.dailySales.set(pid, {});
                    }
                    const productSales = this.dailySales.get(pid);
                    productSales[dateKey] = (productSales[dateKey] || 0) + item.quantity;
                }
            });
        });

        const predictions = [];
        const THRESHOLD_DAYS = 30; // Sales window to analyze

        products.forEach(product => {
            const pid = product._id.toString();
            const productSales = this.dailySales.get(pid) || {};

            // Calculate total sales in the analysis window
            let totalSales = 0;
            const dates = Object.keys(productSales);
            dates.forEach(date => {
                totalSales += productSales[date];
            });

            // Calculate average daily sales rate (velocity)
            // Use Math.max(1, ...) to avoid division by zero and assume at least 1 day passed
            const velocity = totalSales / THRESHOLD_DAYS;

            if (velocity > 0 && product.countInStock > 0) {
                const daysUntilStockout = product.countInStock / velocity;

                // Only report items that will run out within the next 14 days
                if (daysUntilStockout <= 14) {
                    const stockoutDate = new Date();
                    stockoutDate.setDate(stockoutDate.getDate() + Math.round(daysUntilStockout));

                    predictions.push({
                        productId: product._id,
                        name: product.name,
                        currentStock: product.countInStock,
                        dailySalesVelocity: velocity.toFixed(2),
                        daysUntilStockout: Math.round(daysUntilStockout),
                        predictedStockoutDate: stockoutDate.toISOString().split('T')[0],
                        status: daysUntilStockout < 3 ? 'CRITICAL' : 'WARNING'
                    });
                }
            }
        });

        // Sort by urgency (fewer days left = higher priority)
        return predictions.sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);
    }
}

export default new InventoryForecasting();
