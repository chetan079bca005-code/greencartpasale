<!-- # 🤖 AI & Intelligent Features

GreenCart now includes advanced AI methodologies to enhance scalability, pricing strategy, and inventory management.

---

## 1. Content-Based Filtering (NLP)
**Goal:** Solve the "Cold Start" problem where new products get no recommendations. `ContentBasedFiltering` recommends items with similar text descriptions.

-   **Algorithm:** TF-IDF (Term Frequency-Inverse Document Frequency) from the `natural` library.
-   **Usage:** Automatically activated in "Frequently Bought Together" when no sales data exists.
-   **Code:** `server/utils/contentBasedFiltering.js`

---

## 2. Dynamic Pricing Engine
**Goal:** Optimize revenue by adjusting prices based on real-time demand and stock levels.

-   **Logic:**
    -   **Scarcity (+10%):** High Sales (>20/mo) & Low Stock (<10).
    -   **Validation (+5%):** High Sales Velocity (>50/mo).
    -   **Clearance (-10%):** Zero Sales & High Overstock (>50).
-   **API Endpoint:** `GET /api/ai/pricing-suggestions`
-   **Code:** `server/utils/dynamicPricing.js`

---

## 3. Inventory Forecasting
**Goal:** Prevent stockouts by predicting exactly when items will run out.

-   **Algorithm:** Time-Series Moving Average. Calculates daily sales velocity over 30 days.
-   **Output:** Returns "Days Until Stockout" and a specific predicted date.
-   **API Endpoint:** `GET /api/ai/inventory-forecast`
-   **Code:** `server/utils/inventoryForecasting.js`

---

## 🚀 How to Test
1.  **Recommendations:** Create a new product with a detailed description similar to an existing one. Visit its page; you should see recommendations immediately.
2.  **AI Insights:** Access the new endpoints (Admin use):
    *   `http://localhost:4000/api/ai/pricing-suggestions`
    *   `http://localhost:4000/api/ai/inventory-forecast` -->
