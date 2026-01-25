import mongoose from 'mongoose';
import Product from './models/Product.js';
import connectDB from './configs/db.js';
import 'dotenv/config';

// Original products from assets.js - using placeholder URLs for local images
const originalProducts = [
    // Vegetables
    { name: "Potato 500g", category: "Vegetables", price: 25, offerPrice: 20, description: ["Fresh and organic", "Rich in carbohydrates", "Ideal for curries and fries"], image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400" },
    { name: "Tomato 1 kg", category: "Vegetables", price: 40, offerPrice: 35, description: ["Juicy and ripe", "Rich in Vitamin C", "Perfect for salads and sauces", "Farm fresh quality"], image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400" },
    { name: "Carrot 500g", category: "Vegetables", price: 30, offerPrice: 28, description: ["Sweet and crunchy", "Good for eyesight", "Ideal for juices and salads"], image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400" },
    { name: "Spinach 500g", category: "Vegetables", price: 18, offerPrice: 15, description: ["Rich in iron", "High in vitamins", "Perfect for soups and salads"], image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400" },
    { name: "Onion 500g", category: "Vegetables", price: 22, offerPrice: 19, description: ["Fresh and pungent", "Perfect for cooking", "A kitchen staple"], image: "https://images.unsplash.com/photo-1508302730066-748e0dc82443?w=400" },

    // Fruits
    { name: "Apple 1 kg", category: "Fruits", price: 120, offerPrice: 110, description: ["Crisp and juicy", "Rich in fiber", "Boosts immunity", "Perfect for snacking and desserts", "Organic and farm fresh"], image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400" },
    { name: "Orange 1 kg", category: "Fruits", price: 80, offerPrice: 75, description: ["Juicy and sweet", "Rich in Vitamin C", "Perfect for juices and salads"], image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400" },
    { name: "Banana 1 kg", category: "Fruits", price: 50, offerPrice: 45, description: ["Sweet and ripe", "High in potassium", "Great for smoothies and snacking"], image: "https://images.unsplash.com/photo-1603833665858-e61d17a8622e?w=400" },
    { name: "Mango 1 kg", category: "Fruits", price: 150, offerPrice: 140, description: ["Sweet and flavorful", "Perfect for smoothies and desserts", "Rich in Vitamin A"], image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400" },
    { name: "Grapes 500g", category: "Fruits", price: 70, offerPrice: 65, description: ["Fresh and juicy", "Rich in antioxidants", "Perfect for snacking and fruit salads"], image: "https://images.unsplash.com/photo-1537640538965-17565263d519?w=400" },

    // Dairy
    { name: "Amul Milk 1L", category: "Dairy", price: 60, offerPrice: 55, description: ["Pure and fresh", "Rich in calcium", "Ideal for tea, coffee, and desserts", "Trusted brand quality"], image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400" },
    { name: "Paneer 200g", category: "Dairy", price: 90, offerPrice: 85, description: ["Soft and fresh", "Rich in protein", "Ideal for curries and snacks"], image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400" },
    { name: "Eggs 12 pcs", category: "Dairy", price: 90, offerPrice: 85, description: ["Farm fresh", "Rich in protein", "Ideal for breakfast and baking"], image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400" },
    { name: "Cottage Cheese 200g", category: "Dairy", price: 90, offerPrice: 85, description: ["Soft and fresh", "Rich in protein", "Ideal for curries and snacks"], image: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400" },
    { name: "Cheese 200g", category: "Dairy", price: 140, offerPrice: 130, description: ["Creamy and delicious", "Perfect for pizzas and sandwiches", "Rich in calcium"], image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400" },

    // Drinks
    { name: "Coca-Cola 1.5L", category: "Drinks", price: 80, offerPrice: 75, description: ["Refreshing and fizzy", "Perfect for parties and gatherings", "Best served chilled"], image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400" },
    { name: "Pepsi 1.5L", category: "Drinks", price: 78, offerPrice: 73, description: ["Chilled and refreshing", "Perfect for celebrations", "Best served cold"], image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400" },
    { name: "Sprite 1.5L", category: "Drinks", price: 79, offerPrice: 74, description: ["Refreshing citrus taste", "Perfect for hot days", "Best served chilled"], image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400" },
    { name: "Fanta 1.5L", category: "Drinks", price: 77, offerPrice: 72, description: ["Sweet and fizzy", "Great for parties and gatherings", "Best served cold"], image: "https://images.unsplash.com/photo-1632818924360-68d4994cfdb2?w=400" },
    { name: "7 Up 1.5L", category: "Drinks", price: 76, offerPrice: 71, description: ["Refreshing lemon-lime flavor", "Perfect for refreshing", "Best served chilled"], image: "https://images.unsplash.com/photo-1622766815178-641beca4fa83?w=400" },

    // Grains
    { name: "Basmati Rice 5kg", category: "Grains", price: 550, offerPrice: 520, description: ["Long grain and aromatic", "Perfect for biryani and pulao", "Premium quality"], image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },
    { name: "Wheat Flour 5kg", category: "Grains", price: 250, offerPrice: 230, description: ["High-quality whole wheat", "Soft and fluffy rotis", "Rich in nutrients"], image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
    { name: "Organic Quinoa 500g", category: "Grains", price: 450, offerPrice: 420, description: ["High in protein and fiber", "Gluten-free", "Rich in vitamins and minerals"], image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },
    { name: "Brown Rice 1kg", category: "Grains", price: 120, offerPrice: 110, description: ["Whole grain and nutritious", "Helps in weight management", "Good source of magnesium"], image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400" },
    { name: "Barley 1kg", category: "Grains", price: 150, offerPrice: 140, description: ["Rich in fiber", "Helps improve digestion", "Low in fat and cholesterol"], image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400" },

    // Bakery
    { name: "Brown Bread 400g", category: "Bakery", price: 40, offerPrice: 35, description: ["Soft and healthy", "Made from whole wheat", "Ideal for breakfast and sandwiches"], image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
    { name: "Butter Croissant 100g", category: "Bakery", price: 50, offerPrice: 45, description: ["Flaky and buttery", "Freshly baked", "Perfect for breakfast or snacks"], image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },
    { name: "Chocolate Cake 500g", category: "Bakery", price: 350, offerPrice: 325, description: ["Rich and moist", "Made with premium cocoa", "Ideal for celebrations and parties"], image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400" },
    { name: "Whole Bread 400g", category: "Bakery", price: 45, offerPrice: 40, description: ["Healthy and nutritious", "Made with whole wheat flour", "Ideal for sandwiches and toast"], image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400" },
    { name: "Vanilla Muffins 6 pcs", category: "Bakery", price: 100, offerPrice: 90, description: ["Soft and fluffy", "Perfect for a quick snack", "Made with real vanilla"], image: "https://images.unsplash.com/photo-1558303143-a33d139f8b2e?w=400" },

    // Instant
    { name: "Maggi Noodles 280g", category: "Instant", price: 55, offerPrice: 50, description: ["Instant and easy to cook", "Delicious taste", "Popular among kids and adults"], image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400" },
    { name: "Top Ramen 270g", category: "Instant", price: 45, offerPrice: 40, description: ["Quick and easy to prepare", "Spicy and flavorful", "Loved by college students and families"], image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400" },
    { name: "Knorr Cup Soup 70g", category: "Instant", price: 35, offerPrice: 30, description: ["Convenient for on-the-go", "Healthy and nutritious", "Variety of flavors"], image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400" },
    { name: "Yippee Noodles 260g", category: "Instant", price: 50, offerPrice: 45, description: ["Non-fried noodles for healthier choice", "Tasty and filling", "Convenient for busy schedules"], image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400" },
    { name: "Oats Noodles 72g", category: "Instant", price: 40, offerPrice: 35, description: ["Healthy alternative with oats", "Good for digestion", "Perfect for breakfast or snacks"], image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400" },
];

const restoreOriginalProducts = async () => {
    await connectDB();

    console.log("Restoring original 35 products...");

    const products = originalProducts.map((item, index) => ({
        name: item.name,
        description: item.description,
        price: item.price,
        offerPrice: item.offerPrice,
        image: [item.image],
        category: item.category,
        inStock: true,
        createdAt: new Date("2025-03-25T07:17:46.018Z"),
        updatedAt: new Date(),
    }));

    try {
        const result = await Product.insertMany(products);
        console.log(`Successfully restored ${result.length} original products!`);

        const totalCount = await Product.countDocuments({});
        console.log(`Total products in database: ${totalCount}`);
    } catch (error) {
        console.error("Error restoring products:", error);
    } finally {
        mongoose.connection.close();
    }
};

restoreOriginalProducts();
