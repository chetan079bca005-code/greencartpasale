import express from 'express';
import { getUserNotifications, markAsRead, markAllAsRead, deleteNotification, createNotification, clearAllNotifications } from '../controllers/notificationController.js';
import authUser from '../middlewares/authUser.js';

const notificationRouter = express.Router();

notificationRouter.get('/list', authUser, getUserNotifications);
notificationRouter.post('/mark-read', authUser, markAsRead);
notificationRouter.post('/mark-all-read', authUser, markAllAsRead);
notificationRouter.post('/delete', authUser, deleteNotification);
notificationRouter.post('/clear-all', authUser, clearAllNotifications);
notificationRouter.post('/create', authUser, createNotification); // Should potentially be admin only or restricted

export default notificationRouter;
