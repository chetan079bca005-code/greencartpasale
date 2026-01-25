import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    type: { type: String, required: true, enum: ['order', 'promo', 'security', 'system', 'general'] },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    recommendationData: {
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }]
    },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.models.notification || mongoose.model('notification', notificationSchema);

export default Notification;
