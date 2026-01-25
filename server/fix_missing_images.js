import mongoose from 'mongoose';
import Product from './models/Product.js';
import connectDB from './configs/db.js';
import 'dotenv/config';

const imageUpdates = [
    { name: "Banana 1 kg", image: "https://images.unsplash.com/photo-1603833665858-e61d17a8622e?w=400" },
    { name: "Yellow Banana Dozen", image: "https://images.unsplash.com/photo-1603833665858-e61d17a8622e?w=400" },
    { name: "Grapes 500g", image: "https://images.unsplash.com/photo-1537640538965-17565263d519?w=400" },
    { name: "Green Grapes", image: "https://images.unsplash.com/photo-1537640538965-17565263d519?w=400" },
    { name: "Onion 500g", image: "https://images.unsplash.com/photo-1508302730066-748e0dc82443?w=400" },
    { name: "Vanilla Muffins 6 pcs", image: "https://images.unsplash.com/photo-1558303143-a33d139f8b2e?w=400" },
    { name: "7 Up 1.5L", image: "https://images.unsplash.com/photo-1622766815178-641beca4fa83?w=400" },
];

const fixMissingImages = async () => {
    await connectDB();

    console.log("Fixing missing product images...");

    for (const item of imageUpdates) {
        const result = await Product.updateMany(
            { name: { $regex: item.name, $options: 'i' } },
            { $set: { image: [item.image] } }
        );
        console.log(`${item.name}: ${result.modifiedCount} updated`);
    }

    console.log("Image fixes complete!");
    mongoose.connection.close();
};

fixMissingImages();
