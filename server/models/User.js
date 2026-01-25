import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    cartItems: { type: Object, default: {} },
    settings: {
        type: Object,
        default: {
            orderUpdates: true,
            promotions: true,
            securityAlerts: true,
            newsletter: false,
            smsNotifications: false,
            profileVisibility: false,
            activityStatus: false,
            dataSharing: false
        }
    },
    createdAt: { type: Date, default: Date.now }

}, { minimize: false })

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User
