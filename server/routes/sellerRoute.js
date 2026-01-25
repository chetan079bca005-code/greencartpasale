import express from 'express';
import { isSellerAuth, sellerLogin, sellerLogout, recommendProducts } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth', authSeller, isSellerAuth);
sellerRouter.post('/logout', sellerLogout);
sellerRouter.post('/recommend', authSeller, recommendProducts);

export default sellerRouter;