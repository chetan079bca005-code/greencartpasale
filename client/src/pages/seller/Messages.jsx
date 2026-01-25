import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Messages = () => {
    const { axios } = useAppContext();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchMessages();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 h-[95vh] flex items-center justify-center">
                <p className="text-gray-500">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Contact Messages</h2>
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">No messages found</p>
                ) : (
                    messages.map((message, index) => (
                        <div key={message._id || index} className="flex flex-col gap-3 p-5 max-w-4xl rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 transition-colors duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">{message.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{message.email}</p>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(message.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{message.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Messages; 