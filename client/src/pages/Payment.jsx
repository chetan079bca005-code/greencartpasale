import React from 'react';
import { Link } from 'react-router-dom';

const Payment = () => {
  const paymentMethods = [
    {
      title: "Cash on Delivery",
      description: "Pay when your order arrives at your doorstep. No advance payment needed — simple and worry-free.",
      icon: "💵",
      tag: "Most Popular"
    },
    {
      title: "eSewa Wallet",
      description: "Pay instantly with your eSewa mobile wallet. Fast, secure, and widely used across Nepal.",
      icon: "📱",
      tag: "Instant"
    },
    {
      title: "Stripe (Cards)",
      description: "Pay with Visa, Mastercard, or any major card through Stripe's industry-leading secure payment gateway.",
      icon: "💳",
      tag: "Global"
    }
  ];

  const securityFeatures = [
    { text: "SSL encryption for all transactions", icon: "🔒" },
    { text: "PCI DSS compliant payment processing", icon: "🛡️" },
    { text: "No card data stored on our servers", icon: "🚫" },
    { text: "Real-time fraud detection & protection", icon: "⚡" },
    { text: "Instant payment confirmation via email", icon: "✉️" }
  ];

  return (
    <div className="pb-24 dark:bg-slate-900 transition-colors duration-500 min-h-screen">
      {/* Header Section */}
      <div className="bg-slate-900 py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-4 inline-block">Secure Checkout</span>
          <h1 className="text-3xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter italic underline decoration-primary/20 underline-offset-8">Payment Methods</h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Choose from our trusted and secure payment options for a seamless shopping experience.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="space-y-12">
          {/* Payment Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                      {method.icon}
                    </div>
                    <span className="text-[9px] font-black text-primary bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">{method.tag}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">{method.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">{method.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Security Information */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-10 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Security & Privacy</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Your data is always protected</p>
                </div>
              </div>
              <div className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 hover:border-primary/20 transition-all">
                    <span className="text-lg flex-shrink-0">{feature.icon}</span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Info + CTA */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-10 border border-slate-100 dark:border-slate-700 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">Good to Know</h2>
                <div className="space-y-4">
                  {[
                    "All prices are in Nepali Rupees (₨) and include applicable taxes.",
                    "Refunds are processed to the original payment method within 5-7 days.",
                    "COD orders require a minimum order value of ₨100."
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 dark:bg-slate-800 p-10 rounded-[2rem] text-center relative overflow-hidden border border-slate-800 dark:border-slate-700">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight italic">Need Help?</h3>
                  <p className="text-slate-400 mb-6 font-medium text-sm">Having trouble with payment? We're here for you.</p>
                  <Link
                    to="/contact"
                    className="inline-block px-8 py-4 bg-primary text-white font-black rounded-xl hover:bg-white hover:text-slate-900 transition-all uppercase tracking-widest text-[10px] shadow-lg active:scale-95"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 