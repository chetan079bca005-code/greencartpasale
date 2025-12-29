import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const [status, setStatus] = useState('verifying'); // verifying, success, failed

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = searchParams.get('pid') || searchParams.get('oid'); // Support both pid and oid
      const refId = searchParams.get('refId');

      if (!orderId || !refId) {
        setStatus('failed');
        return;
      }

      try {
        const { data } = await axios.post('/api/order/esewa/status', {
          orderId,
          refId
        });

        if (data.success) {
          setStatus('success');
          // Clear any local storage cart if needed
          localStorage.removeItem('cartItems');
          
          // Redirect to orders after 3 seconds
          setTimeout(() => {
            navigate('/my-orders');
          }, 3000);
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [searchParams, axios, navigate]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 px-4">
      {status === 'verifying' && (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">Verifying Payment</h2>
          <p className="text-gray-600 mt-2">Please wait while we confirm your payment...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to your orders...</p>
          <button 
            onClick={() => navigate('/my-orders')}
            className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            View Order
          </button>
        </div>
      )}

      {status === 'failed' && (
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">We couldn't verify your payment. Please contact support if you believe this is an error.</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate('/cart')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Return to Cart
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Contact Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
