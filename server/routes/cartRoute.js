import express from 'express'; // ✅ Import express to use express.Router()
import authUser from '../middlewares/authUser.js';
import { updateCart } from '../controllers/cartController.js';

const cartRouter = express.Router(); // ✅ Correct usage of express.Router()

cartRouter.post('/update', authUser, updateCart);

export default cartRouter;

