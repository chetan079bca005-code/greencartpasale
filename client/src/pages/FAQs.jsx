import React from 'react';

const FAQs = () => {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in if you already have one. Follow the checkout process to provide delivery details and payment information."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit/debit cards, PayPal, and other secure online payment options. All transactions are encrypted and secure."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery times vary depending on your location. Typically, orders are processed within 1-2 business days and delivered within 3-5 business days. You can track your order status in your account dashboard."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be unused and in their original packaging. Please contact our customer service team to initiate a return."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can check shipping costs during checkout."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email. You can also track your order status by logging into your account and visiting the 'My Orders' section."
    }
  ];

  return (
    <div className="pt-24 pb-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary/5 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-4">
            If you couldn't find the answer you're looking for, please don't hesitate to contact our customer support team.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQs; 