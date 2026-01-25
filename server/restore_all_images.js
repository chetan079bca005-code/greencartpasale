import mongoose from 'mongoose';
import Product from './models/Product.js';
import connectDB from './configs/db.js';
import 'dotenv/config';

// Mapping of product names (partial match) to correct Unsplash image URLs
const imageMapping = {
    // Vegetables
    'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
    'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    'onion': 'https://images.unsplash.com/photo-1508302730066-748e0dc82443?w=400',
    'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400',

    // Fruits
    'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    'orange': 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400',
    'banana': 'https://images.unsplash.com/photo-1603833665858-e61d17a8622e?w=400',
    'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
    'grape': 'https://images.unsplash.com/photo-1537640538965-17565263d519?w=400',

    // Dairy
    'milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    'paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    'egg': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
    'cottage cheese': 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400',
    'cheese': 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400',
    'cheddar': 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400',
    'yogurt': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',

    // Drinks/Beverages
    'coca-cola': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    'pepsi': 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
    'sprite': 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
    'fanta': 'https://images.unsplash.com/photo-1632818924360-68d4994cfdb2?w=400',
    '7 up': 'https://images.unsplash.com/photo-1622766815178-641beca4fa83?w=400',
    '7up': 'https://images.unsplash.com/photo-1622766815178-641beca4fa83?w=400',
    'orange juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    'green tea': 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400',

    // Grains
    'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    'basmati': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    'wheat flour': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    'flour': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    'quinoa': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    'brown rice': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
    'barley': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',

    // Bakery
    'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    'croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    'muffin': 'https://images.unsplash.com/photo-1558303143-a33d139f8b2e?w=400',

    // Instant
    'maggi': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400',
    'noodle': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400',
    'ramen': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    'yippee': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400',
    'oats': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400',

    // Snacks
    'chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400',
    'almond': 'https://images.unsplash.com/photo-1613728913197-36b1d3106584?w=400',

    // Meat
    'chicken': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
};

// Default fallback image for groceries
const defaultImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400';

const findImageForProduct = (productName) => {
    const nameLC = productName.toLowerCase();

    for (const [keyword, imageUrl] of Object.entries(imageMapping)) {
        if (nameLC.includes(keyword)) {
            return imageUrl;
        }
    }

    return defaultImage;
};

const restoreAllImages = async () => {
    await connectDB();

    console.log("Restoring all product images to correct URLs...\n");

    try {
        const products = await Product.find({});
        console.log(`Found ${products.length} products in the database.\n`);

        let updatedCount = 0;

        for (const product of products) {
            const correctImage = findImageForProduct(product.name);

            // Update the product's image array
            const updateResult = await Product.updateOne(
                { _id: product._id },
                { $set: { image: [correctImage] } }
            );

            if (updateResult.modifiedCount > 0) {
                console.log(`✓ Updated: ${product.name} -> ${correctImage.substring(0, 60)}...`);
                updatedCount++;
            } else {
                console.log(`- Skipped (same image): ${product.name}`);
            }
        }

        console.log(`\n========================================`);
        console.log(`Successfully updated ${updatedCount} product images!`);
        console.log(`========================================\n`);

    } catch (error) {
        console.error("Error restoring images:", error);
    } finally {
        mongoose.connection.close();
    }
};

restoreAllImages();
