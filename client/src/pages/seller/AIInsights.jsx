import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AIInsights = () => {
    const { axios, currency } = useAppContext();
    const [activeTab, setActiveTab] = useState('pricing');
    const [pricingSuggestions, setPricingSuggestions] = useState([]);
    const [inventoryForecast, setInventoryForecast] = useState([]);
    const [recStats, setRecStats] = useState(null);
    const [loading, setLoading] = useState({ pricing: true, inventory: true, stats: true });

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const { data } = await axios.get('/api/ai/pricing-suggestions');
                setPricingSuggestions(data.suggestions || []);
            } catch (error) {
                console.error('Error fetching pricing:', error);
            } finally {
                setLoading(prev => ({ ...prev, pricing: false }));
            }
        };

        const fetchInventory = async () => {
            try {
                const { data } = await axios.get('/api/ai/inventory-forecast');
                setInventoryForecast(data.forecast || []);
            } catch (error) {
                console.error('Error fetching inventory:', error);
            } finally {
                setLoading(prev => ({ ...prev, inventory: false }));
            }
        };

        const fetchRecStats = async () => {
            try {
                const { data } = await axios.get('/api/recommendations/stats');
                setRecStats(data);
            } catch (error) {
                console.error('Error fetching rec stats:', error);
            } finally {
                setLoading(prev => ({ ...prev, stats: false }));
            }
        };

        fetchPricing();
        fetchInventory();
        fetchRecStats();
    }, []);

    const tabs = [
        { id: 'pricing', label: 'Dynamic Pricing', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )},
        { id: 'inventory', label: 'Inventory Forecast', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        )},
        { id: 'recommendations', label: 'Rec. Engine', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        )}
    ];

    return (
        <div className="flex-1 h-[95vh] overflow-y-auto no-scrollbar bg-gray-50 dark:bg-slate-900 transition-colors">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6 py-5">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI-powered pricing, inventory forecasting & recommendation analytics</p>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6">
                <nav className="flex gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                            }`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-6">
                {/* Dynamic Pricing Tab */}
                {activeTab === 'pricing' && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">Dynamic Pricing Engine</h3>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                                        Analyzes sales velocity, stock levels, and demand patterns to suggest optimal pricing adjustments.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {loading.pricing ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : pricingSuggestions.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                                <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-gray-500 dark:text-gray-400 font-medium">All prices are optimal</h3>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">No pricing adjustments needed at this time</p>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-gray-700">
                                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Product</th>
                                                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Current</th>
                                                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Suggested</th>
                                                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Change</th>
                                                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">Stock</th>
                                                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">Sales (30d)</th>
                                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {pricingSuggestions.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td className="px-5 py-3">
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">{currency}{item.currentPrice}</span>
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{currency}{item.suggestedPrice}</span>
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        <span className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                                                            item.percentageChange?.startsWith('-')
                                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        }`}>
                                                            {item.percentageChange?.startsWith('-') ? '' : '+'}{item.percentageChange}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 text-right hidden sm:table-cell">
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">{item.stock}</span>
                                                    </td>
                                                    <td className="px-5 py-3 text-right hidden sm:table-cell">
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">{item.salesLast30Days}</span>
                                                    </td>
                                                    <td className="px-5 py-3 hidden md:table-cell">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.reason}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Inventory Forecast Tab */}
                {activeTab === 'inventory' && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-amber-800 dark:text-amber-300">Inventory Forecasting</h3>
                                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                                        Uses time-series analysis (moving average) to predict stockouts based on sales velocity.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {loading.inventory ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : inventoryForecast.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                                <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-gray-500 dark:text-gray-400 font-medium">No stockout alerts</h3>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                    All products have sufficient stock levels or not enough sales data to forecast
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {inventoryForecast.map((item, idx) => (
                                    <div key={idx} className={`bg-white dark:bg-slate-800 rounded-xl border p-5 ${
                                        item.status === 'CRITICAL'
                                            ? 'border-red-300 dark:border-red-800'
                                            : 'border-yellow-300 dark:border-yellow-800'
                                    }`}>
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    item.status === 'CRITICAL'
                                                        ? 'bg-red-100 dark:bg-red-900/30'
                                                        : 'bg-yellow-100 dark:bg-yellow-900/30'
                                                }`}>
                                                    <svg className={`w-5 h-5 ${item.status === 'CRITICAL' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Stock: {item.currentStock} · Sales velocity: {item.dailySalesVelocity}/day
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{item.daysUntilStockout} days</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">until stockout</p>
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                    item.status === 'CRITICAL'
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>{item.status}</span>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Predicted stockout date: <span className="font-medium text-gray-700 dark:text-gray-300">{item.predictedStockoutDate}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Recommendation Engine Stats Tab */}
                {activeTab === 'recommendations' && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-violet-200 dark:border-violet-800">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-violet-800 dark:text-violet-300">Recommendation Engine</h3>
                                    <p className="text-sm text-violet-600 dark:text-violet-400 mt-1">
                                        Hybrid Collaborative Filtering using User-Based, Item-Based CF and Content-Based NLP for personalized recommendations.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {loading.stats ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : recStats ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Engine Info */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Engine Configuration</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Algorithm</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{recStats.algorithm}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Version</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{recStats.version}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Update Interval</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{recStats.updateInterval}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {recStats.lastUpdated ? new Date(recStats.lastUpdated).toLocaleString() : 'Not yet'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Matrix Stats */}
                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Matrix Statistics</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{recStats.matrixStats?.totalUsers || 0}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Users in Matrix</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{recStats.matrixStats?.totalProducts || 0}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Products in Matrix</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{recStats.databaseStats?.totalOrders || 0}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Orders</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{recStats.databaseStats?.totalProducts || 0}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Products</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Algorithm Details */}
                                <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Algorithms Active</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">User-Based CF</h4>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Finds similar users based on purchase patterns and recommends what they bought. Uses cosine similarity.
                                            </p>
                                        </div>
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Item-Based CF</h4>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Finds products frequently bought together based on co-purchase patterns across all users.
                                            </p>
                                        </div>
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Content-Based (NLP)</h4>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Uses TF-IDF and attribute matching to find similar products when no purchase data exists (cold start).
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Thresholds */}
                                <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Configuration Parameters</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Similarity Threshold</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{recStats.matrixStats?.similarityThreshold || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Max Neighbors</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{recStats.matrixStats?.maxNeighbors || '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Max Recommendations</p>
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">{recStats.matrixStats?.maxRecommendations || '—'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                                <h3 className="text-gray-500 dark:text-gray-400 font-medium">Unable to load recommendation stats</h3>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIInsights;
