
import User from "../models/User.js"
import Notification from "../models/Notification.js"
import Product from "../models/Product.js"

// Helper function to create notification
const createCartNotification = async (userId, type, title, message) => {
    try {
        await Notification.create({ userId, type, title, message });
    } catch (error) {
        console.error("Error creating notification:", error.message);
    }
};

//update user cart data :/api/cart/update

export const updateCart = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;

        // Get the user's previous cart to compare
        const user = await User.findById(userId);
        const previousCart = user?.cartItems || {};

        // Find newly added items
        const newItems = [];
        for (const itemId in cartItems) {
            if (!previousCart[itemId] || cartItems[itemId] > previousCart[itemId]) {
                newItems.push(itemId);
            }
        }

        // Update the cart
        await User.findByIdAndUpdate(userId, { cartItems });

        // Create notification if new items were added
        if (newItems.length > 0) {
            const products = await Product.find({ _id: { $in: newItems } });
            const productNames = products.map(p => p.name).slice(0, 2).join(', ');
            const moreCount = newItems.length > 2 ? ` and ${newItems.length - 2} more` : '';
            
            await createCartNotification(
                userId,
                'promo',
                'Items Added to Cart',
                `${productNames}${moreCount} ${newItems.length === 1 ? 'has' : 'have'} been added to your cart. Don't forget to checkout!`
            );
        }

        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Add to cart with notification
export const addToCartWithNotification = async (req, res) => {
    try {
        const { userId, productId, quantity = 1 } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Update cart
        const cartItems = user.cartItems || {};
        cartItems[productId] = (cartItems[productId] || 0) + quantity;
        user.cartItems = cartItems;
        await user.save();

        // Get product name for notification
        const product = await Product.findById(productId);
        
        // Create notification
        await createCartNotification(
            userId,
            'promo',
            'Added to Cart!',
            `${product?.name || 'Product'} has been added to your cart. Ready to checkout?`
        );

        res.json({ success: true, message: "Added to cart", cartItems: user.cartItems });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};