import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      if (!user?._id) return;
      const { data } = await axios.get('/api/order/user', {
        params: { userId: user._id }
      });
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Approved': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  if (myOrders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center dark:bg-slate-900 transition-colors duration-500">
        <div className="w-48 h-48 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 animate-pulse">
          <svg className="w-24 h-24 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic mb-4">No Orders Found</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-10 font-bold text-xs uppercase tracking-widest leading-relaxed">
          It looks like you haven't placed any orders yet. Visit our shop to find fresh products!
        </p>
        <Link
          to="/shop"
          className="px-10 py-5 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary transition-all shadow-xl"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-white dark:bg-slate-900 transition-colors duration-500">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 py-16 px-6 relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-primary font-black tracking-[0.4em] text-[10px] uppercase mb-4 inline-block">Order Management</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic underline decoration-primary/20 underline-offset-8">My Order History</h1>
          <div className="flex items-center gap-6 mt-6">
            <div className="text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
              Total Orders: {myOrders.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="space-y-8">
          {myOrders.map((order, index) => (
            <div
              key={index}
              className="premium-card bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2rem]"
            >
              {/* Order Metadata Head */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border-b border-slate-100 dark:border-slate-700 flex flex-wrap justify-between items-center gap-6">
                <div className="flex flex-wrap gap-6 sm:gap-12">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight italic">#{order._id.slice(-12).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Payment Method</p>
                    <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{order.paymentType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Order Date</p>
                    <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadgeColor(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                  <Link
                    to={`/track-order/${order._id}`}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {order.items?.map((item, idx) => {
                  const product = item.product || {};
                  return (
                    <div key={idx} className="p-6 flex flex-col sm:flex-row items-center gap-8 group">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-xl p-2 flex-shrink-0 group-hover:scale-105 transition-all">
                        <img
                          src={product.image || ''}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal brightness-110"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight italic leading-tight mb-1">{product.name}</h3>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{product.category || 'General'} Domain</p>
                      </div>
                      <div className="flex items-center gap-12">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Quantity</p>
                          <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase italic tracking-tighter">{item.quantity || "1.0"} units</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Price</p>
                          <p className="text-base font-black text-slate-900 dark:text-white italic tracking-tighter">
                            {currency}{((product.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Total */}
              <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Grand Total</span>
                <span className="text-2xl font-black italic tracking-tighter">
                  {currency}{order.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;

