import React from 'react';

const Returns = () => {
  const returnPolicy = [
    {
      title: "30-Day Return Policy",
      description: "We offer a 30-day return policy for most items. Products must be unused and in their original packaging with all tags and labels attached."
    },
    {
      title: "Return Process",
      description: "To initiate a return, please contact our customer service team. You'll receive a return authorization number and shipping instructions. Returns without authorization may not be accepted."
    },
    {
      title: "Refund Timeline",
      description: "Once we receive your return, it will be inspected within 2-3 business days. If approved, your refund will be processed within 5-7 business days to your original payment method."
    }
  ];

  const nonReturnableItems = [
    "Personalized or custom-made items",
    "Items marked as 'Final Sale'",
    "Items without original packaging or tags",
    "Used or damaged items",
    "Items purchased more than 30 days ago"
  ];

  return (
    <div className="pt-24 pb-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Return & Refund Policy</h1>
        
        <div className="space-y-8">
          {/* Return Policy Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {returnPolicy.map((policy, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-3">{policy.title}</h3>
                <p className="text-gray-600">{policy.description}</p>
              </div>
            ))}
          </div>

          {/* Non-Returnable Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Non-Returnable Items</h2>
            <ul className="space-y-2">
              {nonReturnableItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Return Instructions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Return Instructions</h2>
            <ol className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full">1</span>
                <span>Contact our customer service team to initiate the return process.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full">2</span>
                <span>Pack the item securely in its original packaging with all tags and labels attached.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full">3</span>
                <span>Include the return authorization number on the outside of the package.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full">4</span>
                <span>Ship the package using a trackable shipping method.</span>
              </li>
            </ol>
          </div>

          {/* Contact Support */}
          <div className="bg-primary/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about our return policy or need assistance with a return, our customer support team is here to help.
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

export default Returns; 