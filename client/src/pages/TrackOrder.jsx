import React, { useState } from 'react';

const TrackOrder = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to get the order status
    // For now, we'll just show a mock status
    setOrderStatus({
      orderNumber: trackingNumber,
      status: 'In Transit',
      estimatedDelivery: '2024-03-20',
      currentLocation: 'Distribution Center',
      trackingHistory: [
        {
          date: '2024-03-18',
          time: '10:30 AM',
          status: 'Order Placed',
          location: 'Online Store'
        },
        {
          date: '2024-03-18',
          time: '02:15 PM',
          status: 'Order Confirmed',
          location: 'Processing Center'
        },
        {
          date: '2024-03-19',
          time: '09:45 AM',
          status: 'Shipped',
          location: 'Shipping Center'
        },
        {
          date: '2024-03-19',
          time: '03:20 PM',
          status: 'In Transit',
          location: 'Distribution Center'
        }
      ]
    });
  };

  return (
    <div className="pt-24 pb-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>
        
        <div className="space-y-8">
          {/* Tracking Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Tracking Number
                </label>
                <input
                  type="text"
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your tracking number"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors duration-300"
              >
                Track Order
              </button>
            </form>
          </div>

          {/* Order Status */}
          {orderStatus && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-medium">{orderStatus.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium text-primary">{orderStatus.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-medium">{orderStatus.estimatedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Location</p>
                    <p className="font-medium">{orderStatus.currentLocation}</p>
                  </div>
                </div>
              </div>

              {/* Tracking History */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Tracking History</h2>
                <div className="space-y-4">
                  {orderStatus.trackingHistory.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {index !== orderStatus.trackingHistory.length - 1 && (
                          <div className="w-0.5 h-12 bg-primary/10 mx-auto"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{event.status}</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                        <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-primary/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              If you're having trouble tracking your order or have any questions, our customer support team is here to help.
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

export default TrackOrder; 