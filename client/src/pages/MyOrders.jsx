import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency,axios,user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      if (!user?._id) {
        console.log("No user found");
        return;
      }
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

  // Add a helper function to get status badge colors
  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-end w-max mb-8">
          <p className="text-2xl font-medium uppercase">My Orders</p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>

        {myOrders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          myOrders.map((order, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl bg-white shadow-sm"
            >
              <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
                <span>OrderId: {order._id}</span>
                <span>Payment: {order.paymentType}</span>
                <span>
                  Total Amount: {currency}
                  {order.amount}
                </span>
              </p>

              {order.items?.map((item, idx) => {
                const product = item.product || {};
                return (
                  <div
                    key={idx}
                    className={`relative bg-white text-gray-500/70 ${
                      order.items.length !== idx + 1 ? 'border-b' : ''
                    } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
                  >
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <img
                          src={product.image?.[0] || ''}
                          alt={product.name}
                          className="w-16 h-16 object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-xl font-medium text-gray-800">
                          {product.name || 'Product name'}
                        </h2>
                        <p>Category: {product.category || 'Unknown'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center md:ml- mb- md:mb-0">
                      <p>Quantity: {item.quantity || "1"}</p>
                      <p className="flex items-center gap-2">
                        Status: 
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </p>
                      <p>
                        Date:{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </p>
                      <p className="text-primary text-lg font-medium mt-2">
                        Amount: {currency}
                        {(product.offerPrice || 0) * (item.quantity || 1)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
