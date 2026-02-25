import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Customers = () => {
    const { axios, currency } = useAppContext();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const { data } = await axios.get('/api/seller/customers');
                if (data.success) {
                    setCustomers(data.customers);
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
                toast.error('Failed to load customers');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-[95vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading customers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 h-[95vh] overflow-y-auto no-scrollbar bg-gray-50 dark:bg-slate-900 transition-colors">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6 py-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{customers.length} registered users</p>
                    </div>
                    <div className="relative">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full sm:w-72"
                        />
                    </div>
                </div>
            </div>

            <div className="p-6">
                {filteredCustomers.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium">No customers found</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            {searchQuery ? 'Try a different search term' : 'No registered users yet'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Phone</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Orders</th>
                                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Total Spent</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Last Order</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-bold text-primary">{customer.name?.charAt(0)?.toUpperCase()}</span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{customer.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{customer.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="text-sm text-gray-600 dark:text-gray-300">{customer.phone || '—'}</span>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {new Date(customer.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {customer.orderStats?.totalOrders || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right hidden sm:table-cell">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {currency}{(customer.orderStats?.totalSpent || 0).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {customer.orderStats?.lastOrder
                                                        ? new Date(customer.orderStats.lastOrder).toLocaleDateString()
                                                        : '—'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Customers;
