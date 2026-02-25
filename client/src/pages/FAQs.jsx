import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse our products, add the items you want to your cart, and proceed to checkout. You will need to provide your delivery information and choose a payment method.",
      icon: "🛒"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Cash on Delivery (COD), eSewa mobile wallet, and Stripe (credit/debit cards). All our payment methods are secure and encrypted.",
      icon: "💳"
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery usually takes 1-3 business days within Kathmandu valley. You will receive updates on your order status through your account.",
      icon: "🚚"
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. The items must be in their original condition and packaging. Please check our Returns page for more details.",
      icon: "↩️"
    },
    {
      question: "Do you deliver internationally?",
      answer: "Currently, we only deliver within Nepal. We are working on expanding our services to other countries soon.",
      icon: "🌍"
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order by visiting the 'My Orders' section in your account and clicking the track icon on any order.",
      icon: "📦"
    },
    {
      question: "Are the products organic and fresh?",
      answer: "We source products from local farms and verified suppliers. Products marked with the 🌿 Organic badge are certified organic. We ensure freshness through our rapid supply chain.",
      icon: "🌿"
    },
    {
      question: "How do I cancel an order?",
      answer: "You can contact our support team within 1 hour of placing your order for cancellation. Once the order is shipped, cancellation is not available.",
      icon: "❌"
    }
  ];

  return (
    <div className="pb-24 dark:bg-slate-900 transition-colors duration-500 min-h-screen">
      {/* Header Section */}
      <div className="bg-slate-900 py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-4 inline-block">Help Center</span>
          <h1 className="text-3xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter italic underline decoration-primary/20 underline-offset-8">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Find answers to common questions about our products, orders, and delivery.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg ${
                openIndex === index 
                  ? 'border-primary/30 dark:border-primary/30 shadow-primary/5' 
                  : 'border-slate-100 dark:border-slate-700 hover:border-primary/20'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center gap-4 p-6 text-left group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-300 ${
                  openIndex === index 
                    ? 'bg-primary/10 dark:bg-primary/20 scale-110' 
                    : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-primary/10 dark:group-hover:bg-primary/20'
                }`}>
                  {faq.icon}
                </div>
                <h3 className={`flex-1 text-base font-bold transition-colors ${
                  openIndex === index 
                    ? 'text-primary' 
                    : 'text-slate-800 dark:text-white group-hover:text-primary'
                }`}>
                  {faq.question}
                </h3>
                <svg 
                  className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180 text-primary' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-48 pb-6' : 'max-h-0'}`}>
                <div className="px-6 pl-[5.5rem]">
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 p-10 bg-white dark:bg-slate-800 rounded-[3rem] text-center border border-slate-100 dark:border-slate-700 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight italic">Still have questions?</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 font-medium text-sm">
              Our support team is always ready to help you with any questions or concerns.
            </p>
            <Link
              to="/contact"
              className="inline-block px-10 py-4 bg-slate-900 dark:bg-slate-700 text-white font-black rounded-2xl hover:bg-primary transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[10px]"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
