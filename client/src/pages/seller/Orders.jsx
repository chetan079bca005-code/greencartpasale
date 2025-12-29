import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Orders = () => {
    const { currency, axios } = useAppContext()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingOrder, setUpdatingOrder] = useState(null)
    const [activeTab, setActiveTab] = useState('all')

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get('/api/order/all');
            if (data.success) {
                console.log("Received orders:", data.orders);
                setOrders(data.orders)
            } else {
                toast.error(data.message || "Failed to fetch orders")
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to fetch orders")
        } finally {
            setLoading(false)
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        if (updatingOrder) return;
        
        try {
            setUpdatingOrder(orderId);
            const { data } = await axios.post('/api/order/status', { orderId, status });
            
            if (data.success) {
                toast.success(data.message);
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order._id === orderId ? { ...order, status } : order
                    )
                );
            } else {
                toast.error(data.message || "Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to update order status");
        } finally {
            setUpdatingOrder(null);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [])

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

    // Filter orders based on active tab
    const filteredOrders = orders.filter(order => {
        if (activeTab === 'all') return true;
        return order.status === activeTab;
    });

    const getOrderCountByStatus = (status) => {
        return orders.filter(order => order.status === status).length;
    };

    if (loading) {
        return (
            <div className="flex-1 h-[95vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className='h-full bg-gray-50'>
            {/* Header */}
            <div className="bg-white shadow-sm border-b p-6">
                <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
                <p className="text-gray-500 mt-1">Manage and track customer orders</p>
            </div>

            {/* Stats Cards */}
            <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex flex-col">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold mt-2">{orders.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex flex-col">
                    <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></span>
                        <p className="text-sm text-gray-500">Pending</p>
                    </div>
                    <p className="text-2xl font-bold mt-2">{getOrderCountByStatus('Pending')}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex flex-col">
                    <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-blue-400 mr-2"></span>
                        <p className="text-sm text-gray-500">Approved</p>
                    </div>
                    <p className="text-2xl font-bold mt-2">{getOrderCountByStatus('Approved')}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex flex-col">
                    <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-purple-400 mr-2"></span>
                        <p className="text-sm text-gray-500">Shipped</p>
                    </div>
                    <p className="text-2xl font-bold mt-2">{getOrderCountByStatus('Shipped')}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex flex-col">
                    <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-green-400 mr-2"></span>
                        <p className="text-sm text-gray-500">Delivered</p>
                    </div>
                    <p className="text-2xl font-bold mt-2">{getOrderCountByStatus('Delivered')}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px space-x-8">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'all'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            All Orders
                            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                {orders.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('Pending')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'Pending'
                                    ? 'border-yellow-500 text-yellow-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Pending
                            <span className="ml-2 bg-yellow-100 text-yellow-600 py-0.5 px-2 rounded-full text-xs">
                                {getOrderCountByStatus('Pending')}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('Approved')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'Approved'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Approved
                            <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                                {getOrderCountByStatus('Approved')}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('Shipped')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'Shipped'
                                    ? 'border-purple-500 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Shipped
                            <span className="ml-2 bg-purple-100 text-purple-600 py-0.5 px-2 rounded-full text-xs">
                                {getOrderCountByStatus('Shipped')}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('Delivered')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'Delivered'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Delivered
                            <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                                {getOrderCountByStatus('Delivered')}
                            </span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Orders List */}
            <div className="p-6">
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                            <div className="mx-auto h-12 w-12 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {activeTab === 'all' 
                                    ? "You don't have any orders yet."
                                    : `You don't have any ${activeTab.toLowerCase()} orders.`}
                            </p>
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <div key={order._id} className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <h3 className="text-base font-medium text-gray-900">Order #{order._id.substring(order._id.length - 8)}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>
                                
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Customer Information</h4>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p className="font-medium text-gray-900">
                                                {order.address?.firstName || 'N/A'} {order.address?.lastName || ''}
                                            </p>
                                            <p>{order.address?.email || 'N/A'}</p>
                                            <p>{order.address?.phone || 'N/A'}</p>
                                            <div className="mt-4">
                                                <h5 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Shipping Address</h5>
                                                <p>{order.address?.street || 'N/A'}</p>
                                                <p>{order.address?.city || 'N/A'}, {order.address?.state || 'N/A'} {order.address?.zipcode || 'N/A'}</p>
                                                <p>{order.address?.country || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Order Details</h4>
                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {order.items.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gray-100 overflow-hidden">
                                                                        {item.product?.image && item.product.image[0] ? (
                                                                            <img src={item.product.image[0]} alt={item.product.name} className="h-full w-full object-cover" />
                                                                        ) : (
                                                                            <div className="flex h-full items-center justify-center bg-gray-200">
                                                                                <span className="text-xs text-gray-500">No img</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900">{item.product?.name || 'Product'}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{item.quantity}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{currency}{item.product?.offerPrice || item.product?.price || 0}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">{currency}{(item.product?.offerPrice || item.product?.price || 0) * item.quantity}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50">
                                                    <tr>
                                                        <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Payment Method: <span className="font-medium">{order.paymentType}</span></td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">Total:</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-base font-bold text-gray-900">{currency}{order.amount}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <div className="flex flex-wrap gap-2 justify-end">
                                        <button 
                                            onClick={() => updateOrderStatus(order._id, 'Pending')}
                                            disabled={order.status === 'Pending' || updatingOrder === order._id}
                                            className={`px-3 py-2 text-xs rounded font-medium ${
                                                order.status === 'Pending' 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                                            }`}
                                        >
                                            Mark as Pending
                                        </button>
                                        <button 
                                            onClick={() => updateOrderStatus(order._id, 'Approved')}
                                            disabled={order.status === 'Approved' || updatingOrder === order._id}
                                            className={`px-3 py-2 text-xs rounded font-medium ${
                                                order.status === 'Approved' 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                                            }`}
                                        >
                                            Approve Order
                                        </button>
                                        <button 
                                            onClick={() => updateOrderStatus(order._id, 'Shipped')}
                                            disabled={order.status === 'Shipped' || updatingOrder === order._id}
                                            className={`px-3 py-2 text-xs rounded font-medium ${
                                                order.status === 'Shipped' 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                                            }`}
                                        >
                                            Mark as Shipped
                                        </button>
                                        <button 
                                            onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                            disabled={order.status === 'Delivered' || updatingOrder === order._id}
                                            className={`px-3 py-2 text-xs rounded font-medium ${
                                                order.status === 'Delivered' 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-green-100 hover:bg-green-200 text-green-800'
                                            }`}
                                        >
                                            Mark as Delivered
                                        </button>
                                        <button 
                                            onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                            disabled={order.status === 'Cancelled' || updatingOrder === order._id}
                                            className={`px-3 py-2 text-xs rounded font-medium ${
                                                order.status === 'Cancelled' 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-red-100 hover:bg-red-200 text-red-800'
                                            }`}
                                        >
                                            Cancel Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Orders
