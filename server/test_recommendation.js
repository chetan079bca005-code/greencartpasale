import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Order from './models/Order.js';
import Notification from './models/Notification.js';
import Address from './models/Address.js';

dotenv.config();

const BASE_URL = `http://127.0.0.1:${process.env.PORT || 4000}/api`;

async function runTest() {
    try {
        console.log('--- Starting Recommendation Feature Test ---');

        // 1. Connect to DB (to fetch valid IDs)
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected');

        // 2. Fetch a valid Order and some Products
        const order = await Order.findOne({ status: 'Delivered' }).populate('address');
        if (!order) {
            throw new Error('No delivered order found to test with.');
        }
        console.log(`Found Order: ${order._id} for User: ${order.userId}`);

        // 3. Login as Seller
        console.log('Logging in as Seller...');
        // Note: We need cookies. Axios needs to manage cookies if we want to use the cookie-based auth.
        // Or we can cheat and generate the token directly if we were inside the internal logic, 
        // but let's try to simulate an API call with cookie jar or just assume the controller logic works if we mock the request?
        // Actually, let's just use axios with a cookie jar wrapper or simpler:
        // Use a library 'axios-cookie-jar-support' or just simpler:
        // We can just hit the login endpoint, get the 'set-cookie' header, and pass it to the next request.

        if (!process.env.SELLER_EMAIL) {
            console.error("ERROR: SELLER_EMAIL not found in process.env");
        }
        console.log(`Using Email: ${process.env.SELLER_EMAIL}`);

        const loginRes = await axios.post(`${BASE_URL}/seller/login`, {
            email: process.env.SELLER_EMAIL,
            password: process.env.SELLER_PASSWORD
        });

        if (!loginRes.data.success) {
            throw new Error(`Seller Login Failed: ${loginRes.data.message}`);
        }

        const cookies = loginRes.headers['set-cookie'];
        console.log('Seller Logged In. Cookies obtained.');

        // 4. Send Recommendation
        console.log('Sending Recommendation...');
        const products = ['677b620022cc260955949d0b', '677b620022cc260955949d0d']; // Use fake IDs if we don't want to query products, or fetch valid ones.
        // Let's fetch valid product IDs from the order itself to be safe, or just random ones?
        // Recommendation usually is other products.

        const recommendRes = await axios.post(`${BASE_URL}/seller/recommend`, {
            orderId: order._id,
            products: products,
            message: "Test recommendation from automated script."
        }, {
            headers: {
                Cookie: cookies
            }
        });

        console.log('Recommendation Response:', recommendRes.data);

        // 5. Verify Notification in DB
        const notification = await Notification.findOne({
            userId: order.userId,
            title: "New Recommendation from Seller"
        }).sort({ createdAt: -1 });

        if (notification) {
            console.log('✅ SUCCESS: Notification found in DB:', notification.message);
        } else {
            console.error('❌ FAILURE: Notification NOT found in DB.');
        }

    } catch (error) {
        console.error('Test Failed:', error);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
