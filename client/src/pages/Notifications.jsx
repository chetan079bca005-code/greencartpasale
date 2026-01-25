import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const Notifications = () => {
    const navigate = useNavigate();
    const { currency } = useAppContext();
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, user, fetchNotifications } = useAppContext();
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    // Refresh notifications on mount
    useEffect(() => {
        if (user && fetchNotifications) {
            handleRefresh();
        }
    }, [user]);

    const handleRefresh = async () => {
        setRefreshing(true);
        if (fetchNotifications) {
            await fetchNotifications();
        }
        setRefreshing(false);
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notif.isRead;
        return notif.type === filter;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type) => {
        switch (type) {
            case 'order':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'promo':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                );
            case 'security':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                );
            case 'system':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                );
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'order': return 'bg-primary/10 text-primary';
            case 'promo': return 'bg-amber-500/10 text-amber-500';
            case 'security': return 'bg-red-500/10 text-red-500';
            case 'system': return 'bg-blue-500/10 text-blue-500';
            default: return 'bg-slate-500/10 text-slate-500';
        }
    };

    const handleDeleteNotification = async (id, e) => {
        e.stopPropagation();
        const success = await deleteNotification(id);
        if (success) {
            toast.success("Notification deleted");
        }
    };

    const formatDate = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffInHours = Math.floor((now - notifDate) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return notifDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'unread', label: 'Unread' },
        { id: 'order', label: 'Orders' },
        { id: 'promo', label: 'Promotions' },
        { id: 'security', label: 'Security' },
        { id: 'system', label: 'System' }
    ];

    if (!user) {
        return (
            <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Login Required</h2>
                    <p className="text-slate-500 dark:text-slate-400">Please login to view your notifications.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 sm:py-12 md:py-16 px-4 sm:px-6 text-center relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -mr-24 sm:-mr-36 md:-mr-48 -mt-24 sm:-mt-36 md:-mt-48"></div>
                <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl -ml-16 sm:-ml-24 md:-ml-32 -mb-16 sm:-mb-24 md:-mb-32"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-2 sm:mb-4">
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Notifications</h1>
                        {unreadCount > 0 && (
                            <span className="px-2 sm:px-3 py-1 bg-primary text-white rounded-full text-xs sm:text-sm font-bold">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">Stay updated with your latest activities</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-8 relative z-20">
                {/* Filter Bar */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 mb-4 sm:mb-6 overflow-hidden transition-colors duration-300">
                    <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
                            {filters.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0 ${filter === f.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                        }`}
                                >
                                    {f.label}
                                    {f.id === 'unread' && unreadCount > 0 && (
                                        <span className="ml-1 sm:ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-[8px] sm:text-[10px]">{unreadCount}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 transition-colors"
                                title="Refresh notifications"
                            >
                                <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllNotificationsAsRead}
                                    className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider hover:underline whitespace-nowrap"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                    {filteredNotifications.length > 0 ? (
                        <div className="divide-y divide-slate-50 dark:divide-slate-700">
                            {filteredNotifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    onClick={() => {
                                        markNotificationAsRead(notif._id);
                                        setSelectedNotification(notif);
                                    }}
                                    className={`p-4 sm:p-6 lg:p-8 flex gap-3 sm:gap-4 lg:gap-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all cursor-pointer group relative ${!notif.isRead ? 'bg-primary/5 dark:bg-primary/5' : ''
                                        }`}
                                >
                                    {!notif.isRead && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                    )}

                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300 ${getTypeColor(notif.type)}`}>
                                        {getIcon(notif.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 mb-1 sm:mb-2">
                                            <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-tight ${!notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                                                }`}>
                                                {notif.title}
                                            </h3>
                                            <span className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-600 uppercase tracking-wider whitespace-nowrap">
                                                {formatDate(notif.createdAt)}
                                            </span>
                                        </div>
                                        <p className={`text-[11px] sm:text-xs font-medium leading-relaxed line-clamp-2 ${!notif.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'
                                            }`}>
                                            {notif.message}
                                        </p>

                                        <div className="mt-2 sm:mt-3 flex items-center gap-3 sm:gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-wider hover:underline">
                                                View Details
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteNotification(notif._id, e)}
                                                className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider hover:text-red-500 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 sm:p-12 lg:p-16 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">No notifications</h3>
                            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
                                {filter === 'all'
                                    ? "You're all caught up! No new notifications."
                                    : `No ${filter} notifications found.`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 text-center transition-colors duration-300">
                        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-0.5">{notifications.length}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 text-center transition-colors duration-300">
                        <div className="text-xl sm:text-2xl font-black text-primary mb-0.5">{unreadCount}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Unread</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 text-center transition-colors duration-300">
                        <div className="text-xl sm:text-2xl font-black text-amber-500 mb-0.5">{notifications.filter(n => n.type === 'order').length}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Orders</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 dark:border-slate-700 text-center transition-colors duration-300">
                        <div className="text-xl sm:text-2xl font-black text-red-500 mb-0.5">{notifications.filter(n => n.type === 'security').length}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Alerts</div>
                    </div>
                </div>
            </div>

            {/* Notification Detail Modal */}
            {selectedNotification && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-2xl">
                        <div className="flex items-start gap-4 mb-4 sm:mb-6">
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${getTypeColor(selectedNotification.type)}`}>
                                {getIcon(selectedNotification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{selectedNotification.title}</h2>
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                    {new Date(selectedNotification.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                                {selectedNotification.message}
                            </p>

                            {/* Recommended Products Grid */}
                            {selectedNotification.recommendationData &&
                                selectedNotification.recommendationData.products &&
                                selectedNotification.recommendationData.products.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-3 tracking-wider">Recommended for you</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedNotification.recommendationData.products.map(product => (
                                                <div
                                                    key={product._id || Math.random()}
                                                    onClick={() => {
                                                        setSelectedNotification(null);
                                                        window.scrollTo(0, 0);
                                                        navigate(`/products/${product.category}/${product._id}`);
                                                    }}
                                                    className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                >
                                                    <div className="aspect-square bg-slate-100 rounded-md mb-2 overflow-hidden">
                                                        <img
                                                            src={product.image && product.image[0]}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                                        />
                                                    </div>
                                                    <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">{product.name}</h5>
                                                    <p className="text-xs font-medium text-primary">
                                                        {currency}{product.offerPrice || product.price}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setSelectedNotification(null)}
                                className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm"
                            >
                                Close
                            </button>
                            <button
                                onClick={(e) => {
                                    handleDeleteNotification(selectedNotification._id, e);
                                    setSelectedNotification(null);
                                }}
                                className="flex-1 px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-200 dark:hover:bg-red-900/50 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;