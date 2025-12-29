import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 px-4">
            <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-6">Your payment was cancelled or could not be processed.</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/cart')}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                    >
                        Retry Payment
                    </button>
                    <button
                        onClick={() => navigate('/contact')}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
