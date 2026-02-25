import React from 'react';
import { Link } from 'react-router-dom';

const Delivery = () => {
  const deliveryInfo = [
    {
      title: "Standard Shipping",
      description: "3-5 Business Days",
      price: "FREE for orders over $50",
      details: "Our standard delivery service for all orders. Orders are typically processed within 24-48 hours."
    },
    {
      title: "Express Shipping",
      description: "1-2 Business Days",
      price: "$9.99 Fee",
      details: "Get your products faster with our express delivery service. Priority handling for immediate dispatch."
    },
    {
      title: "Same Day Delivery",
      description: "Deliver Today",
      price: "$14.99 Fee",
      details: "Available in select areas for orders placed before 12:00 PM. Fast and reliable same-day service."
    }
  ];

  return (
    <div className="pb-24 dark:bg-slate-900 transition-colors duration-500 min-h-screen">
      {/* Header Section */}
      <div className="bg-slate-900 py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 inline-block">Shipping Information</span>
          <h1 className="text-3xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter italic">Delivery Policy</h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Find out about our shipping methods, estimated delivery times, and shipping costs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="space-y-12">
          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryInfo.map((option, index) => (
              <div key={index} className="premium-card p-8 bg-white dark:bg-slate-800 group hover:bg-slate-900 dark:hover:bg-slate-700 transition-all duration-500 border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight group-hover:text-white transition-colors">{option.title}</h3>
                <p className="text-primary font-black text-xs uppercase tracking-widest mb-4">{option.description}</p>
                <p className="text-slate-400 dark:text-slate-500 font-bold mb-6 group-hover:text-slate-500 transition-colors uppercase text-[10px] tracking-widest">{option.price}</p>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed group-hover:text-slate-400 transition-colors">{option.details}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Additional Information */}
            <div className="premium-card p-10 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight italic">Important Details</h2>
              <ul className="space-y-6">
                {[
                  "Delivery times are estimates and may vary due to external factors.",
                  "We do not ship on weekends or public holidays.",
                  "You can track your order in real-time through your account dashboard."
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-500 dark:text-slate-400 font-medium">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-slate-900 p-10 rounded-[2.5rem] flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight italic relative z-10">Have Questions?</h2>
              <p className="text-slate-400 mb-8 font-medium text-sm max-w-sm relative z-10">
                If you have any specific delivery requirements or need further assistance, our support team is here to help.
              </p>
              <Link
                to="/contact"
                className="inline-block px-10 py-4 bg-primary text-white font-black rounded-xl hover:bg-white hover:text-slate-900 transition-all uppercase tracking-widest text-[10px] relative z-10"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
