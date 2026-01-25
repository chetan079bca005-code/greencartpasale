import React from 'react';
import { Link } from 'react-router-dom';

const FAQs = () => {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse our products, add the items you want to your cart, and proceed to checkout. You will need to provide your delivery information and choose a payment method."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, eSewa, and Cash on Delivery. All our payment methods are secure and encrypted."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery usually takes 3-5 business days. You will receive a tracking number as soon as your order is shipped."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. The items must be in their original condition and packaging. Please check our Returns page for more details."
    },
    {
      question: "Do you deliver internationally?",
      answer: "Currently, we only deliver within Nepal. We are working on expanding our services to other countries soon."
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order using the tracking number provided in your confirmation email or by visiting the 'My Orders' section in your account."
    }
  ];

  return (
    <div className="pb-24">
      {/* Header Section */}
      <div className="bg-slate-900 py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 inline-block">Help Center</span>
          <h1 className="text-3xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter italic">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Find answers to common questions about our products, orders, and delivery.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="premium-card p-10 bg-white group hover:bg-slate-900 transition-all duration-500 border-slate-100">
              <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tight group-hover:text-white transition-colors italic leading-tight">
                <span className="text-primary mr-2">Q:</span>{faq.question}
              </h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                <span className="text-primary/40 font-black mr-2 uppercase tracking-widest text-[10px]">Answer:</span>{faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-slate-50 rounded-[4rem] text-center border border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight italic">Still have questions?</h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-10 font-medium text-sm">
            If you couldn't find the answer you were looking for, please feel free to reach out to our support team.
          </p>
          <Link
            to="/contact"
            className="inline-block px-12 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-primary transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[10px]"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
