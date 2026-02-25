import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const [status, setStatus] = useState('verifying'); // verifying, success, failed

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = searchParams.get('pid') || searchParams.get('oid');
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
          localStorage.removeItem('cartItems');

          // Automated redirection after verification
          setTimeout(() => {
            navigate('/my-orders');
          }, 5000);
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
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 relative overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>

      <div className="relative z-10 w-full max-w-xl">
        {status === 'verifying' && (
          <div className="premium-card p-12 bg-white dark:bg-slate-800 text-center shadow-2xl border-slate-100 dark:border-slate-700 rounded-[3rem]">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-primary/10 rounded-full animate-pulse flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-4 inline-block">Payment Verification</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic mb-4">Verifying Payment</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              We are verifying your payment with the server. Please do not refresh the page...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="premium-card p-12 bg-white dark:bg-slate-800 text-center shadow-2xl border-slate-100 dark:border-slate-700 rounded-[4rem]">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-500/20 transform hover:scale-110 transition-transform duration-500">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span className="text-emerald-500 font-black tracking-[0.4em] text-[10px] uppercase mb-4 inline-block">Order Confirmed</span>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">Payment Successful</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
              Your order has been placed successfully and is being processed. Thank you for shopping with us!
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Automatic Redirect</span>
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">5 Seconds</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/my-orders"
                  className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-xl active:scale-95 text-center"
                >
                  View My Orders
                </Link>
                <Link
                  to="/"
                  className="px-6 py-4 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-95 text-center"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="premium-card p-12 bg-white dark:bg-slate-800 text-center shadow-2xl border-slate-100 dark:border-slate-700 rounded-[4rem]">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-red-500/20 transform hover:rotate-12 transition-transform duration-500">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <span className="text-red-500 font-black tracking-[0.4em] text-[10px] uppercase mb-4 inline-block">Verification Error</span>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">Payment Failed</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
              We were unable to verify your payment. Please try again or contact our support team if you need assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cart"
                className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-dark transition-all shadow-xl active:scale-95 text-center flex-1"
              >
                Go to Cart
              </Link>
              <Link
                to="/contact"
                className="px-10 py-5 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-center flex-1"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;

