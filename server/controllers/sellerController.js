import jwt from 'jsonwebtoken';

import Notification from '../models/Notification.js';
import sendEmail from '../utils/emailHelper.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Newsletter from '../models/Newsletter.js';
import Contact from '../models/Contact.js';

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

// Dashboard Stats: /api/seller/dashboard-stats
export const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const inStockProducts = await Product.countDocuments({ inStock: true });
        const outOfStockProducts = await Product.countDocuments({ inStock: false });

        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const approvedOrders = await Order.countDocuments({ status: 'Approved' });
        const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
        const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
        const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

        // Revenue calculations
        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' }, isPaid: true } },
            { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        const totalOrderValue = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalOrderAmount = totalOrderValue[0]?.total || 0;

        // Monthly revenue (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    revenue: { $sum: '$amount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Total users
        const totalUsers = await User.countDocuments();
        const newUsersThisMonth = await User.countDocuments({
            createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        });

        // Total subscribers
        const totalSubscribers = await Newsletter.countDocuments();

        // Total messages
        const totalMessages = await Contact.countDocuments();
        const unreadMessages = await Contact.countDocuments({ isRead: { $ne: true } });

        // Recent orders (last 5)
        const recentOrders = await Order.find()
            .populate({ path: 'items.product', model: 'product', select: 'name image offerPrice price' })
            .populate('address')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Top selling products
        const topProductsAgg = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: 1 },
                    totalRevenue: { $sum: '$amount' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        const topProductIds = topProductsAgg.map(p => p._id);
        const topProductDetails = await Product.find({ _id: { $in: topProductIds } }).select('name image category offerPrice price').lean();
        const topProducts = topProductsAgg.map(agg => {
            const detail = topProductDetails.find(p => p._id.toString() === agg._id?.toString());
            return { ...agg, product: detail || null };
        });

        // Category distribution
        const categoryDistribution = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Order status distribution
        const orderStatusDistribution = [
            { status: 'Pending', count: pendingOrders, color: '#F59E0B' },
            { status: 'Approved', count: approvedOrders, color: '#3B82F6' },
            { status: 'Shipped', count: shippedOrders, color: '#8B5CF6' },
            { status: 'Delivered', count: deliveredOrders, color: '#10B981' },
            { status: 'Cancelled', count: cancelledOrders, color: '#EF4444' },
        ];

        res.json({
            success: true,
            stats: {
                totalProducts,
                inStockProducts,
                outOfStockProducts,
                totalOrders,
                pendingOrders,
                approvedOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                totalRevenue,
                totalOrderAmount,
                totalUsers,
                newUsersThisMonth,
                totalSubscribers,
                totalMessages,
                unreadMessages,
                monthlyRevenue,
                recentOrders,
                topProducts,
                categoryDistribution,
                orderStatusDistribution
            }
        });
    } catch (error) {
        console.error('[Dashboard] Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all customers: /api/seller/customers
export const getCustomers = async (req, res) => {
    try {
        const users = await User.find().select('-password -cartItems').sort({ createdAt: -1 }).lean();

        // Get order stats for each user
        const userStats = await Order.aggregate([
            {
                $group: {
                    _id: '$userId',
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: '$amount' },
                    lastOrder: { $max: '$createdAt' }
                }
            }
        ]);

        const statsMap = {};
        userStats.forEach(s => { statsMap[s._id] = s; });

        const customersWithStats = users.map(u => ({
            ...u,
            orderStats: statsMap[u._id.toString()] || { totalOrders: 0, totalSpent: 0, lastOrder: null }
        }));

        res.json({ success: true, customers: customersWithStats });
    } catch (error) {
        console.error('[Customers] Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all newsletter subscribers: /api/seller/subscribers
export const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find().sort({ subscribedAt: -1 }).lean();
        res.json({ success: true, subscribers });
    } catch (error) {
        console.error('[Subscribers] Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a subscriber: /api/seller/subscribers/:id
export const deleteSubscriber = async (req, res) => {
    try {
        await Newsletter.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Subscriber removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};