import React from 'react';
import { Link } from 'react-router-dom';

const Returns = () => {
  const returnPolicy = [
    {
      title: "30-Day Return Policy",
      description: "We offer a 30-day return window for most products. Items must be in their original condition and packaging with all tags attached."
    },
    {
      title: "Easy Return Process",
      description: "To start a return, simply contact our support team. Please ensure you have your order number ready for faster processing."
    },
    {
      title: "Fast Refunds",
      description: "Once we receive and inspect your return (within 2-3 days), your refund will be processed to your original payment method within 5-7 business days."
    }
  ];

  const nonReturnableItems = [
    "Personalized or customized items",
    "Items marked as 'Final Sale'",
    "Items missing original packaging",
    "Used or damaged items",
    "Returns requested after 30 days"
  ];

  return (
    <div className="pb-24 dark:bg-slate-900 transition-colors duration-500 min-h-screen">
      {/* Header Section */}
      <div className="bg-slate-900 py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 inline-block">Customer Satisfaction</span>
          <h1 className="text-3xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter italic">Returns & Refunds</h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Learn more about our return policy, refund process, and how to return an item.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="space-y-12">
          {/* Return Policy Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {returnPolicy.map((policy, index) => (
              <div key={index} className="premium-card p-8 bg-white dark:bg-slate-800 group hover:bg-slate-900 dark:hover:bg-slate-700 transition-all duration-500 border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 uppercase tracking-tight group-hover:text-white transition-colors">{policy.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed group-hover:text-slate-400 transition-colors">{policy.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Non-Returnable Items */}
            <div className="premium-card p-10 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight italic">Non-Returnable Items</h2>
              <ul className="space-y-4">
                {nonReturnableItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 text-slate-500 dark:text-slate-400 font-medium">
                    <div className="w-5 h-5 bg-red-500/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Return Instructions */}
            <div className="premium-card p-10 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight italic">How to Return</h2>
              <div className="space-y-8">
                {[
                  "Contact our support team to request a return.",
                  "Pack the item securely in its original packaging.",
                  "Include your order number clearly on the package.",
                  "Ship the item back to us using a trackable shipping method."
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-5">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-900 dark:bg-slate-600 text-white font-black rounded-lg text-xs italic">{i + 1}</span>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed pt-1.5">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-12 p-12 bg-primary rounded-[3rem] text-center shadow-2xl shadow-primary/20">
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight italic">Need More Help?</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-10 font-medium text-sm">
              If you have any questions about your return or need assistance with the process, please contact our support team.
            </p>
            <Link
              to="/contact"
              className="inline-block px-12 py-5 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[10px]"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
