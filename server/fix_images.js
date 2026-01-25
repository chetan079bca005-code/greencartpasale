import mongoose from 'mongoose';
import Product from './models/Product.js';
import connectDB from './configs/db.js';
import 'dotenv/config';

const fixProducts = async () => {
    await connectDB();

    try {
        const count = await Product.countDocuments({});
        console.log(`Total products in DB: ${count}`);

        const products = await Product.find({});
        console.log("Sample products:", products.slice(0, 3).map(p => ({ name: p.name, image: p.image })));

        // Update products with missing images
        const defaultImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"; // Generic grocery bag or similar

        const res = await Product.updateMany(
            { $or: [{ image: { $exists: false } }, { image: { $size: 0 } }, { image: "" }] },
            { $set: { image: [defaultImage] } }
        );

        console.log(`Updated ${res.modifiedCount} products with missing images.`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.connection.close();
    }
};

fixProducts();
