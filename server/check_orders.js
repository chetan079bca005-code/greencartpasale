import mongoose from 'mongoose';
import Order from './models/Order.js';
import dotenv from 'dotenv';

dotenv.config();

const inspectOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const orders = await Order.find({ status: { $ne: 'Cancelled' } }).limit(5).lean();

        console.log('Inspecting first 5 orders:');
        orders.forEach((order, i) => {
            console.log(`\nOrder # ${i + 1}:`);
            console.log(`  User ID: ${order.userId}`);
            console.log(`  Status: ${order.status}`);
            console.log(`  Items: ${order.items?.length || 0}`);
            if (order.items && order.items.length > 0) {
                console.log(`  First Item: `, JSON.stringify(order.items[0], null, 2));
            }
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

inspectOrders();
