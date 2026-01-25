import mongoose from 'mongoose';
import Product from './models/Product.js';
import connectDB from './configs/db.js';
import 'dotenv/config';

const productsData = [
    // Vegetables
    { name: "Fresh Red Tomato", category: "Vegetables", price: 60, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400", description: "Juicy, ripe red tomatoes perfect for salads and cooking." },
    { name: "Organic Potato", category: "Vegetables", price: 45, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400", description: "Farm-fresh organic potatoes, great for frying or boiling." },
    { name: "Green Spinach Bunch", category: "Vegetables", price: 30, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400", description: "Nutrient-rich fresh spinach leaves." },
    { name: "Crisp Carrot", category: "Vegetables", price: 55, image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400", description: "Sweet and crunchy carrots, rich in Vitamin A." },
    { name: "Fresh Broccoli", category: "Vegetables", price: 120, image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400", description: "Healthy green broccoli florets." },

    // Fruits
    { name: "Red Apple", category: "Fruits", price: 250, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400", description: "Crisp and sweet red apples." },
    { name: "Yellow Banana Dozen", category: "Fruits", price: 100, image: "https://images.unsplash.com/photo-1603833665858-e61d17a8622e?w=400", description: "Energy-boosting ripe yellow bananas." },
    { name: "Juicy Orange", category: "Fruits", price: 180, image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400", description: "Vitamin C packed fresh oranges." },
    { name: "Green Grapes", category: "Fruits", price: 300, image: "https://images.unsplash.com/photo-1537640538965-17565263d519?w=400", description: "Sweet and seedless green grapes." },

    // Dairy
    { name: "Fresh Milk 1L", category: "Dairy", price: 110, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", description: "Pure cow milk, pasteurized and fresh." },
    { name: "Cheddar Cheese Block", category: "Dairy", price: 850, image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400", description: "Aged cheddar cheese, perfect for sandwiches." },
    { name: "Natural Yogurt", category: "Dairy", price: 150, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400", description: "Creamy natural yogurt with active cultures." },

    // Grains
    { name: "Basmati Rice 5kg", category: "Grains", price: 950, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", description: "Premium long-grain Basmati rice." },
    { name: "Whole Wheat Flour 2kg", category: "Grains", price: 180, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", description: "Nutritious whole wheat flour for chapatis." },

    // Beverages
    { name: "Orange Juice 1L", category: "Beverages", price: 220, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", description: "100% natural orange juice, no added sugar." },
    { name: "Green Tea Box", category: "Beverages", price: 350, image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400", description: "Refreshing and healthy green tea bags." },

    // Snacks
    { name: "Potato Chips Salted", category: "Snacks", price: 50, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400", description: "Crispy salted potato chips." },
    { name: "Roasted Almonds 200g", category: "Snacks", price: 450, image: "https://images.unsplash.com/photo-1613728913197-36b1d3106584?w=400", description: "Crunchy roasted almonds, lightly salted." },

    // Bakery
    { name: "Whole Wheat Bread", category: "Bakery", price: 80, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", description: "Freshly baked whole wheat bread loaf." },
    { name: "Chocolate Croissant", category: "Bakery", price: 120, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", description: "Buttery croissant filled with rich chocolate." },

    // Meat
    { name: "Chicken Breast 1kg", category: "Meat", price: 450, image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400", description: "Lean and fresh chicken breast, skinless." },
    { name: "Fresh Eggs Dozen", category: "Meat", price: 180, image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", description: "Farm-fresh white eggs." }
];

const generateProducts = async () => {
    await connectDB();

    console.log("Seeding additional unique products (Appending)...");
    // await Product.deleteMany({});

    const products = productsData.map((item, index) => ({
        name: item.name,
        description: item.description,
        price: item.price,
        offerPrice: Math.floor(item.price * 0.9), // 10% discount
        image: [item.image],
        category: item.category,
        inStock: true,
        date: Date.now() - (index * 10000000), // Staggered dates
        popular: index % 3 === 0, // Mark every 3rd item as popular
        sizes: ["Standard"]
    }));

    try {
        await Product.insertMany(products);
        console.log(`Successfully seeded ${products.length} unique products!`);
    } catch (error) {
        console.error("Error seeding products:", error);
    } finally {
        mongoose.connection.close();
    }
};

generateProducts();
