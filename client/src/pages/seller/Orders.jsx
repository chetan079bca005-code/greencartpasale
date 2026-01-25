import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Orders = () => {
    const { currency, axios, products } = useAppContext()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingOrder, setUpdatingOrder] = useState(null)
    const [activeTab, setActiveTab] = useState('all')

    // Recommendation Modal State
    const [showRecommendModal, setShowRecommendModal] = useState(false)
    const [recommendOrderId, setRecommendOrderId] = useState(null)
    const [selectedRecommendProducts, setSelectedRecommendProducts] = useState([])
    const [recommendMessage, setRecommendMessage] = useState('')
    const [sendingRecommendation, setSendingRecommendation] = useState(false)

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

    const openRecommendModal = (orderId) => {
        setRecommendOrderId(orderId);
        setSelectedRecommendProducts([]);
        setRecommendMessage('');
        setShowRecommendModal(true);
    };

    const toggleRecommendProduct = (productId) => {
        setSelectedRecommendProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const submitRecommendation = async () => {
        if (selectedRecommendProducts.length === 0) {
            toast.error("Please select at least one product to recommend");
            return;
        }

        try {
            setSendingRecommendation(true);
            const { data } = await axios.post('/api/seller/recommend', {
                orderId: recommendOrderId,
                products: selectedRecommendProducts,
                message: recommendMessage
            });

            if (data.success) {
                toast.success(data.message);
                setShowRecommendModal(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to send recommendation");
        } finally {
            setSendingRecommendation(false);
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
        <div className='h-full bg-gray-50 dark:bg-slate-900 transition-colors duration-300 overflow-y-auto no-scrollbar'>
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Orders Management</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track customer orders</p>
            </div>

            {/* Stats Cards */}
            <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{orders.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
                    <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{getOrderCountByStatus('Pending')}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
                    <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-blue-400 mr-2"></span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{getOrderCountByStatus('Approved')}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
                    <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-purple-400 mr-2"></span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Shipped</p>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{getOrderCountByStatus('Shipped')}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
                    <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-green-400 mr-2"></span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Delivered</p>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{getOrderCountByStatus('Delivered')}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px space-x-8">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all'
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
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'Pending'
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
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'Approved'
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
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'Shipped'
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
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'Delivered'
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
                            <div key={order._id} className="bg-white dark:bg-slate-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                                    <div className="flex items-center space-x-4">
                                        <h3 className="text-base font-medium text-gray-900 dark:text-white">Order #{order._id.substring(order._id.length - 8)}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>

                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-3">Customer Information</h4>
                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {order.address?.firstName || 'N/A'} {order.address?.lastName || ''}
                                            </p>
                                            <p>{order.address?.email || 'N/A'}</p>
                                            <p>{order.address?.phone || 'N/A'}</p>
                                            <div className="mt-4">
                                                <h5 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-1">Shipping Address</h5>
                                                <p>{order.address?.street || 'N/A'}</p>
                                                <p>{order.address?.city || 'N/A'}, {order.address?.state || 'N/A'} {order.address?.zipcode || 'N/A'}</p>
                                                <p>{order.address?.country || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-3">Order Details</h4>
                                        <div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-slate-700">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment</th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {order.items.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gray-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                                                        {item.product?.image && item.product.image[0] ? (
                                                                            <img src={item.product.image[0]} alt={item.product.name} className="h-full w-full object-cover" />
                                                                        ) : (
                                                                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        )}
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.product?.name || 'Product Deleted'}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">{item.quantity}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">{currency}{item.product?.offerPrice || item.product?.price || 0}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.isPaid ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">{currency}{(item.product?.offerPrice || item.product?.price || 0) * item.quantity}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50 dark:bg-slate-700">
                                                    <tr>
                                                        <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">Payment Method: <span className="font-medium text-gray-900 dark:text-white">{order.paymentType}</span></td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">Total:</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-base font-bold text-gray-900 dark:text-white">{currency}{order.amount}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-wrap gap-2 justify-end">
                                        <button
                                            onClick={() => openRecommendModal(order._id)}
                                            className="px-3 py-2 text-xs rounded font-medium transition-colors bg-teal-100 hover:bg-teal-200 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200 dark:hover:bg-teal-900/50"
                                        >
                                            Recommend Products
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Pending')}
                                            disabled={order.status === 'Pending' || updatingOrder === order._id}
                                            className={`px-3 py-2 text-xs rounded font-medium transition-colors ${order.status === 'Pending'
                                                ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 dark:hover:bg-yellow-900/50'
                                                }`}
                                        >
                                            Mark as Pending
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Approved')}
                                            disabled={order.status === 'Approved' || updatingOrder === order._id}
                                            className={`px-3 py-2 text-xs rounded font-medium transition-colors ${order.status === 'Approved'
                                                ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50'
                                                }`}
                                        >
                                            Approve Order
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Shipped')}
                                            disabled={order.status === 'Shipped' || updatingOrder === order._id}
                                            className={`px-3 py-2 text-xs rounded font-medium transition-colors ${order.status === 'Shipped'
                                                ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                : 'bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 dark:hover:bg-purple-900/50'
                                                }`}
                                        >
                                            Mark as Shipped
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                            disabled={order.status === 'Delivered' || updatingOrder === order._id}
                                            className={`px-3 py-2 text-xs rounded font-medium transition-colors ${order.status === 'Delivered'
                                                ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                : 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50'
                                                }`}
                                        >
                                            Mark as Delivered
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                            disabled={order.status === 'Cancelled' || updatingOrder === order._id}
                                            className={`px-3 py-2 text-xs rounded font-medium transition-colors ${order.status === 'Cancelled'
                                                ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                                : 'bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50'
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

            {/* Recommendation Modal */}
            {showRecommendModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recommend Products</h3>
                            <button
                                onClick={() => setShowRecommendModal(false)}
                                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message to Customer</label>
                                <textarea
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary/50 dark:bg-slate-700 dark:text-white sm:text-sm p-3"
                                    rows={3}
                                    placeholder="Hey! Since you liked our tomatoes, I thought you might also enjoy these fresh herbs..."
                                    value={recommendMessage}
                                    onChange={(e) => setRecommendMessage(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Products to Recommend</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                                    {products.map(product => (
                                        <div
                                            key={product._id}
                                            onClick={() => toggleRecommendProduct(product._id)}
                                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedRecommendProducts.includes(product._id)
                                                    ? 'border-primary bg-primary/5 dark:bg-primary/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                                }`}
                                        >
                                            <div className={`h-4 w-4 rounded border flex items-center justify-center mr-3 ${selectedRecommendProducts.includes(product._id)
                                                    ? 'bg-primary border-primary'
                                                    : 'border-gray-300 dark:border-gray-600'
                                                }`}>
                                                {selectedRecommendProducts.includes(product._id) && (
                                                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="h-10 w-10 rounded bg-gray-100 flex-shrink-0 mr-3 overflow-hidden">
                                                <img src={product.image[0]} alt={product.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{currency}{product.offerPrice || product.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 flex justify-end gap-3">
                            <button
                                onClick={() => setShowRecommendModal(false)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitRecommendation}
                                disabled={sendingRecommendation || selectedRecommendProducts.length === 0}
                                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${sendingRecommendation || selectedRecommendProducts.length === 0
                                        ? 'bg-primary/60 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary/90'
                                    }`}
                            >
                                {sendingRecommendation ? 'Sending...' : 'Send Recommendation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}

export default Orders
