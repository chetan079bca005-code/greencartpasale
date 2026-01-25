import mongoose from 'mongoose';
import Order from './models/Order.js';
import dotenv from 'dotenv';

dotenv.config();

const findCoPurchasedProduct = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Find an order with at least 2 items
        const order = await Order.findOne({ "items.1": { $exists: true } }).lean();

        if (order) {
            const productId = order.items[0].product || order.items[0].product._id;
            console.log(`Found order with ${order.items.length} items.`);
            console.log(`Test Product ID: ${productId}`);
        } else {
            console.log('No orders found with multiple items. CF cannot generate item-item correlations.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

findCoPurchasedProduct();
