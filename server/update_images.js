import mongoose from 'mongoose';
import Product from './models/Product.js';
import connectDB from './configs/db.js';
import 'dotenv/config';

const updateImages = async () => {
    await connectDB();

    try {
        // Fix Cheddar Cheese Block image
        const cheese = await Product.updateOne(
            { name: 'Cheddar Cheese Block' },
            { $set: { image: ['https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400'] } }
        );
        console.log(`Cheddar Cheese: ${cheese.modifiedCount} updated`);

        // Fix Roasted Almonds image
        const almonds = await Product.updateOne(
            { name: 'Roasted Almonds 200g' },
            { $set: { image: ['https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400'] } }
        );
        console.log(`Roasted Almonds: ${almonds.modifiedCount} updated`);

        console.log('Images updated successfully!');
    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.connection.close();
    }
};

updateImages();
