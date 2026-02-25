import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Messages = () => {
    const { axios } = useAppContext();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/contact/messages', {
                withCredentials: true
            });
            if (data.success) {
                setMessages(data.messages);
            } else {
                toast.error(data.message || "Failed to fetch messages");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            const { data } = await axios.delete(`/api/contact/messages/${id}`, { withCredentials: true });
            if (data.success) {
                toast.success('Message deleted');
                setMessages(prev => prev.filter(m => m._id !== id));
            } else {
                toast.error(data.message || 'Failed to delete');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete message');
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const filtered = messages.filter(m =>
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.message?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{messages.length} contact message{messages.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none dark:text-white"
                    />
                </div>
            </div>

            {/* Messages */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No messages found</p>
                    {searchQuery && <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search term</p>}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((message) => (
                        <div key={message._id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex-shrink-0 flex items-center justify-center">
                                        <span className="text-sm font-bold text-primary">{message.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{message.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{message.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                        {new Date(message.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <button
                                        onClick={() => deleteMessage(message._id)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        title="Delete message"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3 ml-13 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{message.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Messages; 