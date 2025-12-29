import React from 'react';

const Delivery = () => {
  const deliveryInfo = [
    {
      title: "Standard Delivery",
      description: "3-5 business days",
      price: "Free for orders over $50",
      details: "Standard delivery is available for all orders. Orders are typically processed within 1-2 business days and delivered within 3-5 business days."
    },
    {
      title: "Express Delivery",
      description: "1-2 business days",
      price: "$9.99",
      details: "Get your order delivered faster with our express delivery service. Orders placed before 2 PM will be processed the same day."
    },
    {
      title: "Same Day Delivery",
      description: "Same day",
      price: "$14.99",
      details: "Available for orders placed before 12 PM in select areas. Delivery will be made between 2 PM and 8 PM on the same day."
    }
  ];

  return (
    <div className="pt-24 pb-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Delivery Information</h1>
        
        <div className="space-y-8">
          {/* Delivery Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryInfo.map((option, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-primary font-medium mb-2">{option.description}</p>
                <p className="text-gray-600 mb-3">{option.price}</p>
                <p className="text-gray-600 text-sm">{option.details}</p>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Important Information</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>All delivery times are estimates and may vary depending on your location and order volume.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Orders are not delivered on weekends or public holidays.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>You can track your order status in your account dashboard or using the tracking number provided in your shipping confirmation email.</span>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="bg-primary/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about delivery or need assistance with your order, our customer support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors duration-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery; 