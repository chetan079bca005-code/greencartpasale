import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 relative overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>

            <div className="relative z-10 w-full max-w-xl">
                <div className="premium-card p-12 bg-white dark:bg-slate-800 text-center shadow-2xl border-slate-100 dark:border-slate-700 rounded-[4rem]">
                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-red-500/20 transform hover:rotate-12 transition-transform duration-500">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>

                    <span className="text-red-500 font-black tracking-[0.4em] text-[10px] uppercase mb-4 inline-block">Payment Cancelled</span>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">Payment Failed</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
                        The payment was cancelled or could not be completed. Don't worry, your items are still in your cart. Please try again!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/cart')}
                            className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-dark transition-all shadow-xl active:scale-95 text-center flex-1"
                        >
                            Return to Cart
                        </button>
                        <Link
                            to="/contact"
                            className="px-10 py-5 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-center flex-1"
                        >
                            Contact Support
                        </Link>
                    </div>

                    <p className="mt-8 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Status: Payment Aborted
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;

