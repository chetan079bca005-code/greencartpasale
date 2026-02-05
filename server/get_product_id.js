import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const getProductId = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const product = await Product.findOne();
        if (product) {
            console.log(`Product ID: ${product._id}`);
            console.log(`Product Name: ${product.name}`);
        } else {
            console.log('No products found');
        }
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

getProductId();
