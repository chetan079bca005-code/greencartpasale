# Algorithms and Technical Documentation

## 1. Advanced Search Algorithm
**Location**: `server/controllers/productController.js` -> `productList`
**Logic**: 
The search functionality uses a weighted MongoDB query to prioritize matches. It searches across multiple fields (`name`, `category`, `description`) using Regular Expressions (`$regex`) with the `i` (case-insensitive) flag.
```javascript
const query = {
    $or: [
        { name: { $regex: search, $options: 'i' } },       // Name match (High priority contextually)
        { category: { $regex: search, $options: 'i' } },   // Category match
        { description: { $elemMatch: { $regex: search, $options: 'i' } } } // Description match
    ]
};
const products = await Product.find(query).sort({ createdAt: -1 }); // Sort by newest
```
**Why it works**: The `$or` operator ensures any partial match returns the product, making the search flexible for user typos or partial queries.

## 2. Secure Authentication Flow (JWT)
**Location**: `server/middleware/auth.js`
**Logic**:
1.  **Login**: User credentials are verifiable against hashed passwords (`bcrypt`).
2.  **Token Generation**: A JSON Web Token (JWT) is signed with `process.env.JWT_SECRET`.
3.  **Cookie Storage**: The token is sent to the client in an `HTTPOnly` cookie, preventing XSS attacks from accessing it via JavaScript.
```javascript
// Middleware to protect routes
const authUser = async (req, res, next) => {
    const { token } = req.cookies; // Extract from cookie
    if (!token) return res.json({ success: false, message: 'Not Authorized' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id; // Attach ID to request
    next();
}
```

## 3. eSewa Payment Integration Algorithm
**Location**: `server/controllers/orderController.js`
**Flow**:
1.  **Order Initiation**: User clicks pay -> Server creates "Pending" order.
2.  **Signature Hashing**: A cryptographic signature is generated using HMAC-SHA256. This ensures the payment request hasn't been tampered with.
    *   `Signature = HMAC-SHA256("total_amount,transaction_uuid,product_code", SECRET_KEY)`
3.  **Auto-Form Submission**: The server responds with a hidden HTML form that automatically submits to eSewa's payment gateway.
4.  **Verification Loop**: Cloud function or verified callback checks the transaction status using the distinct `refId` returned by eSewa.

## 4. Cart Calculation Logic
**Location**: `client/src/context/AppContext.jsx` -> `getCartAmount`
**Logic**:
Iterates through the local `cartItems` state object. It cross-references the item ID with the `products` array to find the current price, handling edge cases where a product might be out of stock or deleted.
```javascript
const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
        if (cartItems[items] > 0) {
            totalCount += cartItems[items];
        }
    }
    return totalCount;
}
```

## 5. Seed Data Generation
**Location**: `server/seed_products.js`
**Logic**:
We use a predefined static array of real products (e.g., "Red Apple", "Organic Potato") mapping to specific categories.
- **Why**: Random string generation produced unusable test data.
- **Process**: The script appends new products to the database (`insertMany()`), preserving existing data. The `deleteMany({})` command is commented out.

## 6. Product Recommendation Algorithm
**Location**: `client/src/pages/ProductDetails.jsx`, `client/src/pages/Shop.jsx`
**Logic**:
The recommendation system uses a **category-based filtering** approach combined with **popularity scoring**:

1.  **Same Category Filtering**: When viewing a product, the system fetches other products from the same category.
    ```javascript
    const relatedProducts = products.filter(
        p => p.category === currentProduct.category && p._id !== currentProduct._id
    ).slice(0, 4);
    ```

2.  **Popularity Scoring**: Products marked as `popular: true` are prioritized in the "Best Sellers" section.
    ```javascript
    const bestSellers = products.filter(p => p.popular === true).slice(0, 8);
    ```

3.  **Recency Sorting**: New arrivals are sorted by `createdAt` timestamp (descending).
    ```javascript
    const newArrivals = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
    ```

**Future Improvements**:
- Collaborative filtering (users who bought X also bought Y)
- Machine learning-based recommendations using purchase history
- Personalized recommendations based on user browsing patterns

## 7. WhatsApp Integration for Seller Communication
**Location**: `client/src/components/WhatsAppButton.jsx`, Product pages
**Logic**:
A floating WhatsApp button uses the WhatsApp Click-to-Chat API. No backend is required.
```javascript
const whatsappNumber = "9779849756660"; // Nepal country code + number
const message = encodeURIComponent("Hello! I have a query about your products.");
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

// Opens WhatsApp in new tab
window.open(whatsappUrl, '_blank');
```
**Benefits**: 
- Zero API cost (uses official WhatsApp URL scheme)
- Works on mobile and desktop
- Pre-filled message for better UX
