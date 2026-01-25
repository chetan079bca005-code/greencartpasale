import express from 'express'; // ✅ Import express to use express.Router()
import authUser from '../middlewares/authUser.js';
import { updateCart, addToCartWithNotification } from '../controllers/cartController.js';

const cartRouter = express.Router(); // ✅ Correct usage of express.Router()

cartRouter.post('/update', authUser, updateCart);
cartRouter.post('/add', authUser, addToCartWithNotification);

export default cartRouter;

