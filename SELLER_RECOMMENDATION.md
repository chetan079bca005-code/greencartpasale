# Seller Product Recommendation Feature

## Overview
The Seller Product Recommendation feature allows sellers to proactively suggest products to customers based on their previous orders. This recommendation appears as an **In-App Notification** and is also sent via **Email**.

## Features
-   **Seller Dashboard Integration:** Sellers can recommend products directly from the "Orders" page.
-   **Smart Modal:** Sellers can select multiple products from their catalog and write a personalized message.
-   **Dual Delivery:**
    -   **In-App Notification:** Customers receive a notification with a clickable grid of recommended products.
    -   **Email:** Customers receive a beautifully formatted HTML email listing the recommended products.
-   **Direct Navigation:** Clicking a recommended product in the notification instantly redirects the customer to the product detail page.

## Technical Implementation

### Backend
-   **Controller:** `sellerController.js` handles the `recommendProducts` logic.
-   **Models:**
    -   `Notification`: Updated schema to include `recommendationData` (stores array of Product IDs).
    -   `Product`: Referenced to populate detailed product info (name, image, price).
-   **Email Service:** Uses `nodemailer` to send HTML emails.
-   **API Endpoint:**
    -   `POST /api/seller/recommend`
    -   **Body:** `{ orderId, products: [id1, id2], message }`
    -   **Auth:** Protected by Seller Authentication middleware.

### Frontend
-   **Seller Side:**
    -   `Orders.jsx`: Added "Recommend Products" button and selection modal.
-   **Customer Side:**
    -   `Notifications.jsx`: Updated to conditionally render a product grid for recommendation-type notifications.
    -   **Navigation:** Implements precise routing to `/products/:category/:id`.

## Usage Guide

### For Sellers
1.  Login to the **Seller Portal**.
2.  Navigate to the **Orders** tab.
3.  Click the teal **"Recommend Products"** button on any order card.
4.  Write a custom message (optional).
5.  Select products from the list.
6.  Click **Send**.

### For Developers (Testing)
You can verify the feature using the automated script:
```bash
cd server
node test_recommendation_v2.js
```
*   Ensures DB connection.
*   Simulates Seller Login.
*   Sends a recommendation with real products.
*   Verifies the Notification is created and populated with product data.

## Future Enhancements
-   **AI Suggestions:** Pre-fill the product selection modal with AI-generated suggestions (using the Content-Based Filtering module).
-   **Analytics:** Track click-through rates on recommendations.
