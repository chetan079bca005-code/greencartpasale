import express from 'express';
import { isSellerAuth, sellerLogin, sellerLogout, recommendProducts, getDashboardStats, getCustomers, getSubscribers, deleteSubscriber } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth', authSeller, isSellerAuth);
sellerRouter.post('/logout', sellerLogout);
sellerRouter.post('/recommend', authSeller, recommendProducts);
sellerRouter.get('/dashboard-stats', authSeller, getDashboardStats);
sellerRouter.get('/customers', authSeller, getCustomers);
sellerRouter.get('/subscribers', authSeller, getSubscribers);
sellerRouter.delete('/subscribers/:id', authSeller, deleteSubscriber);

export default sellerRouter;