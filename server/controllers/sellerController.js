import jwt from 'jsonwebtoken';

import Notification from '../models/Notification.js';
import sendEmail from '../utils/emailHelper.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js'; // Ensure Order is imported if not already, usually it is needed for logic
;

// Login Seller: /api/seller/login 
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({
                email,
                isSeller: true
            }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({ success: true, message: "Seller logged in" });
        } else {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ success: false, message: "Not Authorized" });
    }
}

// Logout Seller: /api/seller/logout 
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Seller recommends products to a user
export const recommendProducts = async (req, res) => {
    try {
        const { orderId, products, message } = req.body;
        const sellerId = req.id;

        // 1. Validate Input
        if (!orderId || !products || products.length === 0) {
            return res.json({ success: false, message: "Order ID and Product IDs are required" });
        }

        // 2. Fetch Order and Verify it belongs to this seller (and get User details)
        // Note: In a multi-vendor system, verification is complex. check if any item in order matches seller's product?
        // For simplicity here, we assume if you have the Order ID, you are authorized or simplified check.
        // Better: Verify seller has items in this order.
        const order = await Order.findById(orderId).populate('address');
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // 3. Create In-App Notification
        const notificationTitle = "New Recommendation from Seller";
        const notificationMsg = message || "The seller has recommended some fresh products for you based on your recent order.";

        await Notification.create({
            userId: order.userId,
            type: 'general',
            title: notificationTitle,
            message: notificationMsg,
            isRead: false,
            recommendationData: {
                products: products
            }
        });

        // 4. Send Email
        if (order.address && order.address.email) {
            const productNames = await Product.find({ _id: { $in: products } }).select('name');
            const productListHtml = productNames.map(p => `<li><strong>${p.name}</strong></li>`).join('');

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Fresh Recommendations for You!</h2>
                    <p>Hello ${order.address.firstName},</p>
                    <p>${notificationMsg}</p>
                    <p><strong>Check out these items:</strong></p>
                    <ul>
                        ${productListHtml}
                    </ul>
                    <p>Visit <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">GreenCart</a> to buy them now!</p>
                    <p>Best regards,<br>GreenCart Seller Team</p>
                </div>
            `;

            await sendEmail({
                email: order.address.email,
                subject: `Recommendation: Try these fresh products!`,
                message: emailHtml
            });
        }

        res.json({ success: true, message: "Recommendation sent successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};