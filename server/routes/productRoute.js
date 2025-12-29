import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import {
  addProduct,
  changeStock,
  productById,
  productList,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const productRouter = express.Router();

// Corrected image upload middleware (field name should be a string)
productRouter.post('/add', upload.array('images'), authSeller, addProduct);
productRouter.get('/list', productList);
productRouter.get('/id', productById);
productRouter.post('/stock', authSeller, changeStock);
productRouter.put('/update/:id', upload.array('images'), authSeller, updateProduct);
productRouter.delete('/delete/:id', authSeller, deleteProduct);

export default productRouter;

