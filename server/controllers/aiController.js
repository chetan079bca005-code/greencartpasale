import Product from '../models/Product.js';
import Order from '../models/Order.js';
import dynamicPricing from '../utils/dynamicPricing.js';
import inventoryForecasting from '../utils/inventoryForecasting.js';

/**
 * Controller for AI-Powered Features
 * Handles requests for Dynamic Pricing and Inventory Forecasting
 */

/**
 * GET /api/ai/pricing-suggestions
 * Returns suggested price adjustments based on demand and stock
 * @access Admin
 */
export const getPricingSuggestions = async (req, res) => {
    try {
        // Fetch all products and recent orders (e.g., last 30 days)
        const products = await Product.find().lean();

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const orders = await Order.find({
            createdAt: { $gte: thirtyDaysAgo },
            status: { $ne: 'Cancelled' }
        }).lean();

        const suggestions = dynamicPricing.calculatePriceAdjustments(products, orders);

        res.json({
            count: suggestions.length,
            suggestions
        });

    } catch (error) {
        console.error('[AI] Error in getPricingSuggestions:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/ai/inventory-forecast
 * Returns predictions for when items will run out of stock
 * @access Admin
 */
export const getInventoryForecast = async (req, res) => {
    try {
        const products = await Product.find({ countInStock: { $gt: 0 } }).lean();

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const orders = await Order.find({
            createdAt: { $gte: thirtyDaysAgo },
            status: { $ne: 'Cancelled' }
        }).lean();

        const forecast = inventoryForecasting.predictStockOuts(products, orders);

        res.json({
            count: forecast.length,
            forecast
        });

    } catch (error) {
        console.error('[AI] Error in getInventoryForecast:', error);
        res.status(500).json({ message: error.message });
    }
};
