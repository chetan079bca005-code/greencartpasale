import Notification from "../models/Notification.js";

// Get all notifications for the logged-in user
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.userId; // user id from auth middleware
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('recommendationData.products');
        res.json({ success: true, notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark a specific notification as read
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;
        const userId = req.userId;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.json({ success: true, message: "Marked as read", notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark all notifications as read for the user
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        await Notification.updateMany({ userId, isRead: false }, { isRead: true });
        res.json({ success: true, message: "All marked as read" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.body;
        const userId = req.userId;

        const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        // Return updated notifications list
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
        res.json({ success: true, message: "Notification deleted", notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a notification (accepts userId from body or auth middleware)
export const createNotification = async (req, res) => {
    try {
        // Use userId from body if provided, otherwise use from auth middleware
        const userId = req.body.userId || req.userId;
        const { type, title, message } = req.body;

        if (!userId || !type || !title || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const notification = await Notification.create({ userId, type, title, message });
        res.json({ success: true, notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Clear all notifications for a user
export const clearAllNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        await Notification.deleteMany({ userId });
        res.json({ success: true, message: "All notifications cleared" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helper function to create notification (for internal use by other controllers)
export const createNotificationInternal = async (userId, type, title, message) => {
    try {
        const notification = await Notification.create({ userId, type, title, message });
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error.message);
        return null;
    }
};
