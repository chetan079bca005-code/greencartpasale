import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderEsewa, checkEsewaPaymentStatus, updateOrderStatus, placeOrderStripe, checkStripePaymentStatus } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.post('/esewa', authUser, placeOrderEsewa)
orderRouter.post('/esewa/status', authUser, checkEsewaPaymentStatus)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/stripe/status', authUser, checkStripePaymentStatus)
orderRouter.post('/status', authSeller, updateOrderStatus)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/all', authSeller, getAllOrders)

export default orderRouter;

