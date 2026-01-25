import mongoose from 'mongoose';
import Product from './models/Product.js';
import connectDB from './configs/db.js';
import 'dotenv/config';

const cleanupDuplicates = async () => {
    await connectDB();

    try {
        const allProducts = await Product.find({});
        console.log(`Total products before cleanup: ${allProducts.length}`);

        const uniqueProducts = new Map();
        const duplicates = [];

        allProducts.forEach(product => {
            // Create a unique key based on name and description (or just name if strict)
            const key = (product.name + product.category).toLowerCase().trim();

            if (uniqueProducts.has(key)) {
                duplicates.push(product._id);
            } else {
                uniqueProducts.set(key, product._id);
            }
        });

        console.log(`Found ${duplicates.length} duplicate products.`);

        if (duplicates.length > 0) {
            const result = await Product.deleteMany({ _id: { $in: duplicates } });
            console.log(`Deleted ${result.deletedCount} duplicates.`);
        }

        const finalCount = await Product.countDocuments({});
        console.log(`Total products after cleanup: ${finalCount}`);

        // List remaining products
        const remaining = await Product.find({}, 'name category');
        console.log("Remaining products:");
        remaining.forEach(p => console.log(`- ${p.name} (${p.category})`));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.connection.close();
    }
};

cleanupDuplicates();
