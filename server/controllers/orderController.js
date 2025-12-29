import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js"
import axios from "axios";
import crypto from "crypto";
import Stripe from 'stripe';

// Place Order COD: /api/order/cod 
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address, totalAmount } = req.body;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }

        const order = await Order.create({
            userId,
            items,
            amount: totalAmount,
            address,
            paymentType: "COD",
        });

        // Clear user's cart after successful order placement
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        return res.json({ success: true, message: "Order Placed Successfully" })
    } catch (error) {
        console.error("Error placing COD order:", error);
        return res.json({ success: false, message: error.message });
    }
}

//place order esewa :/api/order/esewa
export const placeOrderEsewa = async (req, res) => {
    try {
        const { userId, items, address, totalAmount } = req.body;
        const { origin } = req.headers;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }

        // Create order with proper product references
        const orderItems = items.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }));

        const order = await Order.create({
            userId,
            items: orderItems,
            amount: totalAmount,
            address,
            paymentType: "eSewa",
            isPaid: false
        });

        // Check if we should use development mode
        const devMode = process.env.USE_DEV_PAYMENT === 'true';

        // If in development mode, simulate a payment flow locally
        if (devMode) {
            console.log("Using development payment simulation mode");

            // Create HTML for development payment simulation
            const simulationHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Development Payment Simulation</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
                    .container { max-width: 800px; margin: 50px auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { color: #333; text-align: center; margin-bottom: 30px; }
                    .payment-info { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
                    .payment-info p { margin: 10px 0; color: #555; }
                    .amount { font-size: 24px; font-weight: bold; color: #333; text-align: center; margin: 20px 0; }
                    .btn-container { display: flex; justify-content: space-between; margin-top: 30px; }
                    button { padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold; }
                    .btn-success { background-color: #4CAF50; color: white; }
                    .btn-success:hover { background-color: #45a049; }
                    .btn-cancel { background-color: #f44336; color: white; }
                    .btn-cancel:hover { background-color: #d32f2f; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Development Payment Simulation</h1>
                    <p>This is a simulated payment page for development purposes. In production, this would redirect to the eSewa payment gateway.</p>
                    
                    <div class="payment-info">
                        <p><strong>Order ID:</strong> ${order._id}</p>
                        <p><strong>Total Items:</strong> ${orderItems.length}</p>
                        <p><strong>Payment Method:</strong> eSewa (Simulated)</p>
                    </div>
                    
                    <div class="amount">
                        Amount: Rs. ${parseFloat(totalAmount).toFixed(2)}
                    </div>
                    
                    <div class="btn-container">
                        <button class="btn-cancel" onclick="simulateFailure()">Simulate Payment Failure</button>
                        <button class="btn-success" onclick="simulateSuccess()">Simulate Successful Payment</button>
                    </div>
                </div>

                <script>
                    function simulateSuccess() {
                        window.location.href = "${origin}/payment-success?pid=${order._id}&amt=${totalAmount}&refId=DEV_SIM_${Date.now()}";
                    }
                    
                    function simulateFailure() {
                        window.location.href = "${origin}/payment-failure";
                    }
                </script>
            </body>
            </html>
            `;

            // Send the simulation HTML
            res.header('Content-Type', 'text/html');
            return res.send(simulationHtml);
        }

        // For production: use the URL from environment variable
        const paymentUrl = process.env.ESEWAPAYMENT_URL;
        const merchantId = process.env.MERCHANT_ID;
        const successUrl = process.env.SUCCESS_URL;
        const failureUrl = process.env.FAILURE_URL;

        if (!paymentUrl || !merchantId) {
            throw new Error('eSewa configuration is missing. Please check your environment variables.');
        }

        // Create signature string
        const signatureString = `total_amount=${parseFloat(totalAmount).toFixed(2)},transaction_uuid=${order._id}-${Date.now()},product_code=${merchantId}`;

        // Generate signature
        const signature = crypto.createHmac('sha256', process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q')
            .update(signatureString)
            .digest('base64');

        // Create parameters for eSewa
        const formData = {
            amount: parseFloat(totalAmount).toFixed(2),
            failure_url: failureUrl || `${origin}/payment-failure`,
            product_delivery_charge: "0",
            product_service_charge: "0",
            product_code: merchantId,
            signature: signature,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            success_url: successUrl || `${origin}/payment-success`,
            tax_amount: "0",
            total_amount: parseFloat(totalAmount).toFixed(2),
            transaction_uuid: `${order._id}-${Date.now()}`
        };

        // Create HTML form that will auto-submit to eSewa
        const formHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Redirecting to eSewa</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
                .loader { border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite; margin: 20px auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .error-container { display: none; color: #d32f2f; margin-top: 20px; padding: 15px; border: 1px solid #ffcdd2; background-color: #ffebee; border-radius: 4px; }
                button { padding: 10px 20px; margin-top: 15px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
                button:hover { background-color: #45a049; }
            </style>
        </head>
        <body>
            <h2>Redirecting to eSewa Payment Gateway</h2>
            <p>Please wait, you will be redirected to eSewa in a moment...</p>
            <div class="loader" id="loader"></div>
            <div class="error-container" id="error-container">
                <h3>Payment Service Unavailable</h3>
                <p>The payment service is currently unavailable. Please try again later or choose a different payment method.</p>
                <button onclick="window.location.href='${origin}/cart'">Return to Cart</button>
                <button onclick="retryPayment()">Retry Payment</button>
            </div>
            <form id="esewa-form" method="POST" action="${paymentUrl}">
                <input type="hidden" name="amount" value="${formData.amount}">
                <input type="hidden" name="failure_url" value="${formData.failure_url}">
                <input type="hidden" name="product_delivery_charge" value="${formData.product_delivery_charge}">
                <input type="hidden" name="product_service_charge" value="${formData.product_service_charge}">
                <input type="hidden" name="product_code" value="${formData.product_code}">
                <input type="hidden" name="signature" value="${formData.signature}">
                <input type="hidden" name="signed_field_names" value="${formData.signed_field_names}">
                <input type="hidden" name="success_url" value="${formData.success_url}">
                <input type="hidden" name="tax_amount" value="${formData.tax_amount}">
                <input type="hidden" name="total_amount" value="${formData.total_amount}">
                <input type="hidden" name="transaction_uuid" value="${formData.transaction_uuid}">
                <noscript>
                    <input type="submit" value="Click here to continue to eSewa if you are not redirected automatically">
                </noscript>
            </form>
            <script>
                // Track submission attempts
                let attempts = 0;
                const maxAttempts = 2;
                
                function submitForm() {
                    attempts++;
                    try {
                        document.getElementById("esewa-form").submit();
                        
                        // If service is unavailable, this timeout will show the error
                        setTimeout(function() {
                            if (attempts <= maxAttempts) {
                                document.getElementById("error-container").style.display = "block";
                                document.getElementById("loader").style.display = "none";
                            }
                        }, 5000);
                    } catch (e) {
                        document.getElementById("error-container").style.display = "block";
                        document.getElementById("loader").style.display = "none";
                    }
                }
                
                function retryPayment() {
                    document.getElementById("error-container").style.display = "none";
                    document.getElementById("loader").style.display = "block";
                    submitForm();
                }
                
                // First attempt
                setTimeout(submitForm, 1500);
            </script>
        </body>
        </html>
        `;

        // Log the details for debugging
        console.log("eSewa payment details:", {
            url: paymentUrl,
            orderId: order._id.toString(),
            amount: totalAmount,
            merchantId: merchantId,
            successUrl: formData.su,
            failureUrl: formData.fu
        });

        // Send the HTML form as response
        res.header('Content-Type', 'text/html');
        return res.send(formHtml);
    } catch (error) {
        console.error("eSewa order error:", error);
        return res.json({ success: false, message: error.message });
    }
}

//eSewa payment status check
export const checkEsewaPaymentStatus = async (req, res) => {
    try {
        const { orderId, refId } = req.body;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Use eSewa status check URL from environment variables
        const statusUrl = process.env.ESEWAPAYMENT_STATUS_CHECK_URL || "https://rc.esewa.com.np/api/epay/transaction/status/";

        // Log the verification attempt
        console.log("Verifying eSewa payment:", {
            orderId,
            refId,
            statusUrl
        });

        // For development, we'll consider the payment successful if a refId is provided
        if (refId) {
            // Update order status
            order.isPaid = true;
            await order.save();

            // Clear user's cart
            if (order.userId) {
                await User.findByIdAndUpdate(order.userId, { cartItems: {} });
            }

            return res.json({
                success: true,
                isPaid: true,
                message: "Payment successful"
            });
        }

        return res.status(400).json({ success: false, message: "Payment verification failed - Missing reference ID" });
    } catch (error) {
        console.error("Error checking payment status:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Stripe payment processing: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address, totalAmount } = req.body;
        const { origin } = req.headers;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }

        // Create order with proper product references
        const orderItems = items.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }));

        const order = await Order.create({
            userId,
            items: orderItems,
            amount: totalAmount,
            address,
            paymentType: "Stripe",
            isPaid: false
        });

        // Initialize Stripe with the secret key
        const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

        if (!stripe) {
            throw new Error('Stripe initialization failed');
        }

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Order Payment',
                        description: `Order #${order._id}`,
                    },
                    unit_amount: Math.round(parseFloat(totalAmount) * 100), // Convert to cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${origin}/payment-success?pid=${order._id}&paymentType=stripe&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/payment-failure`,
            metadata: {
                orderId: order._id.toString()
            }
        });

        return res.json({
            success: true,
            url: session.url
        });
    } catch (error) {
        console.error("Stripe order error:", error);
        return res.json({ success: false, message: error.message });
    }
}

// Verify Stripe payment: /api/order/stripe/status
export const checkStripePaymentStatus = async (req, res) => {
    try {
        const { orderId, sessionId } = req.body;
        console.log("Checking Stripe payment status:", { orderId, sessionId });

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Check if this is a development simulation
        if (sessionId && sessionId.startsWith('DEV_SIM_')) {
            console.log("Handling simulated Stripe payment verification");

            // Update order status for the simulated payment
            order.isPaid = true;
            await order.save();

            // Clear user's cart
            if (order.userId) {
                await User.findByIdAndUpdate(order.userId, { cartItems: {} });
            }

            return res.json({
                success: true,
                isPaid: true,
                message: "Payment successful (Development Simulation)"
            });
        }

        try {
            // Initialize Stripe with the secret key
            const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

            // Check the session status
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            console.log("Stripe session retrieved:", session.payment_status);

            // If payment is successful, update order status
            if (session.payment_status === 'paid') {
                // Update order status
                order.isPaid = true;
                await order.save();

                // Clear user's cart
                if (order.userId) {
                    await User.findByIdAndUpdate(order.userId, { cartItems: {} });
                }

                return res.json({
                    success: true,
                    isPaid: true,
                    message: "Payment successful"
                });
            }

            return res.status(400).json({
                success: false,
                message: "Payment verification failed - Payment not completed"
            });
        } catch (stripeError) {
            console.error("Error retrieving Stripe session:", stripeError);
            return res.status(500).json({ success: false, message: stripeError.message });
        }
    } catch (error) {
        console.error("Error checking Stripe payment status:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Get Orders by User ID: /api/order/user 
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        const orders = await Order.find({
            userId
        })
            .populate({
                path: 'items.product',
                model: 'product'
            })
            .populate('address')
            .sort({ createdAt: -1 });

        console.log("Fetched orders:", orders); // Debug log
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.json({ success: false, message: error.message });
    }
}


//get all orders (for seller / admin ): /api/order/seller

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate({
                path: 'items.product',
                model: 'product',
                select: 'name price offerPrice image' // Select only needed fields
            })
            .populate('address')
            .sort({ createdAt: -1 });

        console.log("Fetched seller orders:", orders); // Debug log
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching seller orders:", error);
        res.json({ success: false, message: error.message });
    }
}

// Update order status (for sellers): /api/order/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.json({ success: false, message: "Order ID and status are required" });
        }

        // Validate status - only allow specific values
        const validStatuses = ['Pending', 'Approved', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.json({
                success: false,
                message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
            });
        }

        // Find and update the order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Update the status
        order.status = status;
        await order.save();

        console.log(`Order ${orderId} status updated to: ${status}`);

        return res.json({
            success: true,
            message: `Order status updated to: ${status}`,
            order
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.json({ success: false, message: error.message });
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Update order status in your database
            try {
                await Order.findOneAndUpdate(
                    { _id: paymentIntent.metadata.orderId },
                    {
                        isPaid: true,
                        paymentDetails: {
                            paymentId: paymentIntent.id,
                            paymentMethod: 'stripe'
                        }
                    }
                );
            } catch (error) {
                console.error('Error updating order:', error);
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};


