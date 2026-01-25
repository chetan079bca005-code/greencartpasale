import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TrackOrder = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    // Mock data for the order tracking
    setOrderStatus({
      orderNumber: trackingNumber,
      status: 'In Transit',
      estimatedDelivery: '2024-03-20',
      currentLocation: 'Sector-7 Distribution Center',
      trackingHistory: [
        {
          date: '2024-03-18',
          time: '10:30 AM',
          status: 'Order Placed',
          location: 'Kathmandu Warehouse'
        },
        {
          date: '2024-03-18',
          time: '02:15 PM',
          status: 'Order Processed',
          location: 'Central Sorting'
        },
        {
          date: '2024-03-19',
          time: '09:45 AM',
          status: 'Shipped',
          location: 'Logistics Hub A1'
        },
        {
          date: '2024-03-19',
          time: '03:20 PM',
          status: 'In Transit',
          location: 'Local Distribution Center'
        }
      ]
    });
  };

  return (
    <div className="pb-24 dark:bg-slate-900 transition-colors duration-500 min-h-screen">
      {/* Header Section */}
      <div className="bg-slate-900 py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-4 inline-block">Real-time Updates</span>
          <h1 className="text-3xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter italic underline decoration-primary/20 underline-offset-8">Track Your Order</h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Check the current status and location of your order as it makes its way to you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tracking Form */}
          <div className="lg:w-[400px]">
            <div className="premium-card p-8 bg-white dark:bg-slate-800 shadow-2xl border-slate-100 dark:border-slate-700 rounded-[3rem] transition-colors">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-8">Enter Details</h2>
              <form onSubmit={handleTrackOrder} className="space-y-8">
                <div className="space-y-2">
                  <label htmlFor="trackingNumber" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Order ID / Tracking Number</label>
                  <input
                    type="text"
                    id="trackingNumber"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:border-primary focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-black text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    placeholder="e.g. GC-123456"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-slate-900 dark:bg-slate-700 text-white font-black rounded-2xl hover:bg-primary transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[10px]"
                >
                  Track Order
                </button>
              </form>

              <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700">
                <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3">How to track?</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">
                  Enter your order number or tracking ID provided in your confirmation email to see where your package is.
                </p>
              </div>
            </div>
          </div>

          {/* Status Display */}
          <div className="flex-1">
            {orderStatus ? (
              <div className="space-y-8">
                <div className="premium-card p-10 bg-slate-900 text-white shadow-2xl rounded-[3rem] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order ID</p>
                      <p className="text-sm font-black text-white italic truncate">{orderStatus.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</p>
                      <p className="text-sm font-black text-primary animate-pulse">{orderStatus.status}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expected Delivery</p>
                      <p className="text-sm font-black text-white">{orderStatus.estimatedDelivery}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Last Location</p>
                      <p className="text-sm font-black text-white">{orderStatus.currentLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="premium-card p-10 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-xl rounded-[3rem] transition-colors">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-10">Tracking History</h3>
                  <div className="space-y-10">
                    {orderStatus.trackingHistory.map((event, index) => (
                      <div key={index} className="flex items-start gap-8 group">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${index === 0 ? 'bg-primary text-white scale-110 shadow-primary/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-300 dark:text-slate-700'}`}>
                            <svg className="w-5 h-5 font-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          {index !== orderStatus.trackingHistory.length - 1 && (
                            <div className="w-1 h-12 bg-slate-100 dark:bg-slate-900 mt-2 rounded-full"></div>
                          )}
                        </div>
                        <div className="pt-1">
                          <p className={`text-lg font-black uppercase tracking-tight transition-colors ${index === 0 ? 'text-slate-900 dark:text-white italic' : 'text-slate-300 dark:text-slate-700'}`}>{event.status}</p>
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{event.location}</p>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">{event.date} // {event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="premium-card p-20 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 text-center rounded-[3rem] flex flex-col items-center justify-center transition-colors">
                <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl shadow-xl flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-700">
                  <svg className="w-10 h-10 text-slate-200 dark:text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest italic">Awaiting Search</h3>
                <p className="text-slate-400 dark:text-slate-600 font-bold text-[10px] uppercase tracking-widest mt-4">Enter your tracking number above to see order details.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-slate-900 p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Need Help?</h2>
            <p className="text-slate-400 font-medium text-sm mt-2">If you have any questions about your delivery, please reach out to our support team.</p>
          </div>
          <Link
            to="/contact"
            className="relative z-10 px-10 py-5 bg-primary text-white font-black rounded-2xl hover:bg-white hover:text-slate-900 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[10px]"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
