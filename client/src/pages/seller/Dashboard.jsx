import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { axios, currency } = useAppContext();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/seller/dashboard-stats');
                if (data.success) {
                    setStats(data.stats);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-[95vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex-1 flex items-center justify-center h-[95vh]">
                <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard data</p>
            </div>
        );
    }

    const maxRevenue = Math.max(...(stats.monthlyRevenue?.map(m => m.revenue) || [1]));

    return (
        <div className="flex-1 h-[95vh] overflow-y-auto no-scrollbar bg-gray-50 dark:bg-slate-900 transition-colors">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6 py-5">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your store performance</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Revenue */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{currency}{stats.totalRevenue?.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            Total order value: {currency}{stats.totalOrderAmount?.toLocaleString()}
                        </p>
                    </div>

                    {/* Orders */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/seller/orders')}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalOrders}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            <span className="text-yellow-600">{stats.pendingOrders} pending</span> · <span className="text-green-600">{stats.deliveredOrders} delivered</span>
                        </p>
                    </div>

                    {/* Users */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/seller/customers')}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customers</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalUsers}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            +{stats.newUsersThisMonth} new this month
                        </p>
                    </div>

                    {/* Products */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/seller/product-list')}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalProducts}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            <span className="text-green-600">{stats.inStockProducts} in stock</span> · <span className="text-red-600">{stats.outOfStockProducts} out</span>
                        </p>
                    </div>
                </div>

                {/* Secondary Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/seller/subscribers')}>
                        <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalSubscribers}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Newsletter Subscribers</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/seller/messages')}>
                        <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalMessages}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Contact Messages</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/seller/ai-insights')}>
                        <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">AI Insights</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Pricing & Inventory</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue</h3>
                        {stats.monthlyRevenue?.length > 0 ? (
                            <div className="flex items-end gap-2 h-48">
                                {stats.monthlyRevenue.map((month, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400">{currency}{month.revenue >= 1000 ? (month.revenue / 1000).toFixed(1) + 'k' : month.revenue}</span>
                                        <div
                                            className="w-full bg-primary/80 rounded-t-md min-h-[4px] transition-all hover:bg-primary"
                                            style={{ height: `${Math.max((month.revenue / maxRevenue) * 160, 4)}px` }}
                                            title={`${currency}${month.revenue.toLocaleString()} · ${month.orders} orders`}
                                        ></div>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500">{month._id?.split('-')[1]}/{month._id?.split('-')[0]?.slice(2)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                                No revenue data for the last 6 months
                            </div>
                        )}
                    </div>

                    {/* Order Status Distribution */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Order Status</h3>
                        <div className="space-y-3">
                            {stats.orderStatusDistribution?.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-600 dark:text-gray-300">{item.status}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${stats.totalOrders > 0 ? (item.count / stats.totalOrders) * 100 : 0}%`,
                                                backgroundColor: item.color,
                                                minWidth: item.count > 0 ? '4px' : '0'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                            <button onClick={() => navigate('/seller/orders')} className="text-xs text-primary hover:underline">View all</button>
                        </div>
                        <div className="space-y-3">
                            {stats.recentOrders?.length > 0 ? stats.recentOrders.map((order, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-200 dark:bg-slate-600 rounded-lg overflow-hidden flex-shrink-0">
                                            {order.items?.[0]?.product?.image?.[0] && (
                                                <img src={order.items[0].product.image[0]} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                #{order._id?.slice(-6).toUpperCase()}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {order.address?.firstName || 'Customer'} · {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{currency}{order.amount}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>{order.status || 'Pending'}</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No orders yet</p>
                            )}
                        </div>
                    </div>

                    {/* Top Products + Category Distribution */}
                    <div className="space-y-6">
                        {/* Top Products */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Top Selling Products</h3>
                            <div className="space-y-3">
                                {stats.topProducts?.length > 0 ? stats.topProducts.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-5">{idx + 1}</span>
                                        <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-md overflow-hidden flex-shrink-0">
                                            {item.product?.image?.[0] && (
                                                <img src={item.product.image[0]} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.product?.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.product?.category}</p>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{item.totalSold} sold</span>
                                    </div>
                                )) : (
                                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No sales data yet</p>
                                )}
                            </div>
                        </div>

                        {/* Category Distribution */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Products by Category</h3>
                            <div className="space-y-2">
                                {stats.categoryDistribution?.map((cat, idx) => {
                                    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500', 'bg-cyan-500', 'bg-red-500'];
                                    return (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`}></div>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 flex-1">{cat._id}</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{cat.count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
