import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Subscribers = () => {
    const { axios } = useAppContext();
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const fetchSubscribers = async () => {
        try {
            const { data } = await axios.get('/api/seller/subscribers');
            if (data.success) {
                setSubscribers(data.subscribers);
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            toast.error('Failed to load subscribers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this subscriber?')) return;
        try {
            setDeletingId(id);
            const { data } = await axios.delete(`/api/seller/subscribers/${id}`);
            if (data.success) {
                setSubscribers(prev => prev.filter(s => s._id !== id));
                toast.success('Subscriber removed');
            }
        } catch (error) {
            toast.error('Failed to remove subscriber');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredSubscribers = subscribers.filter(s =>
        s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-[95vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading subscribers...</p>
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
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter Subscribers</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subscribers.length} total subscribers</p>
                    </div>
                    <div className="relative">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full sm:w-72"
                        />
                    </div>
                </div>
            </div>

            <div className="p-6">
                {filteredSubscribers.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium">No subscribers found</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            {searchQuery ? 'Try a different search' : 'No newsletter subscribers yet'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8">#</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Subscribed On</th>
                                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredSubscribers.map((sub, idx) => (
                                        <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-400">{idx + 1}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{sub.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {new Date(sub.subscribedAt).toLocaleDateString()} at {new Date(sub.subscribedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(sub._id)}
                                                    disabled={deletingId === sub._id}
                                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium disabled:opacity-50 transition-colors"
                                                >
                                                    {deletingId === sub._id ? 'Removing...' : 'Remove'}
                                                </button>
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

export default Subscribers;
