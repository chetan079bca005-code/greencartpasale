import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Order from './models/Order.js';
import Notification from './models/Notification.js';
import Address from './models/Address.js';
import Product from './models/Product.js';

dotenv.config();

const BASE_URL = `http://127.0.0.1:${process.env.PORT || 4000}/api`;

async function runTest() {
    try {
        console.log('--- Starting Notification + Recommendation Test ---');

        // 1. Connect to DB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected');

        // 2. Fetch Order
        const order = await Order.findOne({ status: 'Delivered' });
        if (!order) throw new Error('No delivered order found.');
        console.log(`Using Order: ${order._id}`);

        // 3. Login Seller
        console.log('Logging in as Seller...');
        if (!process.env.SELLER_EMAIL) throw new Error("SELLER_EMAIL env var missing");

        const loginRes = await axios.post(`${BASE_URL}/seller/login`, {
            email: process.env.SELLER_EMAIL,
            password: process.env.SELLER_PASSWORD
        });

        if (!loginRes.data.success) throw new Error(`Seller Login Failed: ${loginRes.data.message}`);
        const cookies = loginRes.headers['set-cookie'];
        console.log('Seller Logged In');

        // 4. Send Recommendation
        // Fetch real products to ensure population works
        const productDocs = await Product.find({}).limit(2);
        if (productDocs.length === 0) throw new Error("No products found in DB to recommend.");

        const products = productDocs.map(p => p._id);

        console.log('Sending Recommendation with products:', products);
        const recommendRes = await axios.post(`${BASE_URL}/seller/recommend`, {
            orderId: order._id,
            products: products,
            message: "Automation Test: Check out these REAL products!"
        }, {
            headers: { Cookie: cookies }
        });

        console.log('Recommendation Sent:', recommendRes.data);

        // 5. Verify Notification Data in DB
        console.log('Verifying DB Notification...');
        const notification = await Notification.findOne({
            userId: order.userId,
            title: "New Recommendation from Seller"
        }).sort({ createdAt: -1 }).populate('recommendationData.products');

        if (notification) {
            console.log('✅ Notification Found');
            if (notification.recommendationData && notification.recommendationData.products.length > 0) {
                console.log(`✅ Recommendation Data Present: ${notification.recommendationData.products.length} products found.`);
                console.log('Product Names:', notification.recommendationData.products.map(p => p.name || 'Unknown (Mock ID?)'));
            } else {
                console.error('❌ Recommendation Data MISSING or Empty');
            }
        } else {
            console.error('❌ Notification NOT found');
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
        if (error.response) console.error('API Response:', error.response.data);
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
