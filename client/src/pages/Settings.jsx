import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const Settings = () => {
    const { theme, toggleTheme, user, changePassword, updateUserSettings, axios, setUser, navigate, refreshUserSettings, fetchNotifications } = useAppContext();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
    const [activeSection, setActiveSection] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [settingsLoading, setSettingsLoading] = useState({});

    // Refresh user data on mount to ensure settings are up to date
    useEffect(() => {
        if (user && refreshUserSettings) {
            refreshUserSettings();
        }
    }, []);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            toast.error("New passwords do not match");
            return;
        }
        if (passwordData.new.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        const success = await changePassword(passwordData.current, passwordData.new);
        setLoading(false);
        if (success) {
            setShowPasswordModal(false);
            setPasswordData({ current: '', new: '', confirm: '' });
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/user/update-profile', {
                name: profileData.name,
                phone: profileData.phone
            });
            if (data.success) {
                setUser(prev => ({ ...prev, ...data.user }));
                toast.success("Profile updated successfully");
                setShowEditProfileModal(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const { data } = await axios.delete('/api/user/delete-account');
            if (data.success) {
                toast.success("Account deleted successfully");
                setUser(null);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account");
        }
        setLoading(false);
        setShowDeleteModal(false);
    };

    const handleNotificationToggle = async (key) => {
        if (!user?.settings) return;
        
        // Show loading state for this specific setting
        setSettingsLoading(prev => ({ ...prev, [key]: true }));
        
        const newSettings = { ...user.settings, [key]: !user.settings[key] };
        const success = await updateUserSettings(newSettings);
        
        setSettingsLoading(prev => ({ ...prev, [key]: false }));
        
        if (success) {
            // Refresh notifications if notification settings changed
            if (fetchNotifications) {
                fetchNotifications();
            }
        }
    };

    const themes = [
        {
            id: 'light', name: 'Light', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 16.243l.707.707M7.757 7.757l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
            )
        },
        {
            id: 'dark', name: 'Dark', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )
        },
        {
            id: 'system', name: 'System', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        }
    ];

    const sections = [
        { id: 'profile', label: 'Profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
        { id: 'appearance', label: 'Appearance', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg> },
        { id: 'notifications', label: 'Notifications', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
        { id: 'security', label: 'Security', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
        { id: 'privacy', label: 'Privacy', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
        { id: 'danger', label: 'Danger Zone', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> }
    ];

    const notificationSettings = [
        { id: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about your order status and delivery updates.' },
        { id: 'promotions', label: 'Promotions & Offers', desc: 'Receive emails about sales, discounts, and special offers.' },
        { id: 'securityAlerts', label: 'Security Alerts', desc: 'Important notifications about your account security.' },
        { id: 'newsletter', label: 'Newsletter', desc: 'Weekly digest with product recommendations and tips.' },
        { id: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive text messages for urgent updates.' }
    ];

    const privacySettings = [
        { id: 'profileVisibility', label: 'Profile Visibility', desc: 'Control who can see your profile information.' },
        { id: 'activityStatus', label: 'Activity Status', desc: 'Show when you are active on the platform.' },
        { id: 'dataSharing', label: 'Data Sharing', desc: 'Allow sharing anonymized data for better recommendations.' }
    ];

    return (
        <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 sm:py-12 md:py-16 px-4 sm:px-6 text-center relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -mr-24 sm:-mr-36 md:-mr-48 -mt-24 sm:-mt-36 md:-mt-48"></div>
                <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl -ml-16 sm:-ml-24 md:-ml-32 -mb-16 sm:-mb-24 md:-mb-32"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-2 sm:mb-4 uppercase tracking-tighter italic">Settings</h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium"></p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-8 relative z-20">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                            <div className="p-3 sm:p-4 lg:p-6">
                                <h2 className="hidden lg:block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Navigation</h2>
                                <nav className="flex lg:flex-col gap-1 sm:gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1 no-scrollbar">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200 whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:w-full ${
                                                activeSection === section.id
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                            }`}
                                        >
                                            <span className={activeSection === section.id ? 'text-white' : 'text-slate-400 dark:text-slate-500'}>{section.icon}</span>
                                            <span className="text-xs sm:text-sm font-bold">{section.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Profile Section */}
                        {activeSection === 'profile' && (
                            <div className="space-y-4 sm:space-y-6">
                                <section className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                                    <div className="p-4 sm:p-6 lg:p-8">
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic mb-4 sm:mb-6">Account Profile</h2>
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary to-primary-dark rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg shadow-primary/30">
                                                <span className="text-3xl sm:text-4xl font-black text-white uppercase">{user?.name?.charAt(0) || 'U'}</span>
                                            </div>
                                            <div className="flex-1 text-center sm:text-left">
                                                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{user?.name || 'User'}</h3>
                                                <p className="text-slate-400 dark:text-slate-500 font-medium text-xs sm:text-sm mb-2">{user?.email || 'user@email.com'}</p>
                                                {user?.phone && <p className="text-slate-400 dark:text-slate-500 font-medium text-xs sm:text-sm mb-3">{user.phone}</p>}
                                                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                                        Verified Member
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                                            <button
                                                onClick={() => setShowEditProfileModal(true)}
                                                className="w-full sm:w-auto px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-primary transition-all shadow-lg active:scale-95"
                                            >
                                                Edit Profile
                                            </button>
                                        </div>
                                    </div>
                                </section>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 text-center transition-colors duration-300">
                                        <div className="text-2xl sm:text-3xl font-black text-primary mb-1">0</div>
                                        <div className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Orders</div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 text-center transition-colors duration-300">
                                        <div className="text-2xl sm:text-3xl font-black text-primary mb-1">0</div>
                                        <div className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Addresses</div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 text-center col-span-2 sm:col-span-1 transition-colors duration-300">
                                        <div className="text-2xl sm:text-3xl font-black text-primary mb-1">{Object.keys(user?.cartItems || {}).length}</div>
                                        <div className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Cart Items</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Section */}
                        {activeSection === 'appearance' && (
                            <section className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <div className="mb-6 sm:mb-8">
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Appearance</h2>
                                        <p className="text-slate-400 dark:text-slate-500 font-medium text-xs sm:text-sm mt-1"></p>
                                    </div>

                                    <div className="mb-6 sm:mb-8">
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3 sm:mb-4">Theme</h3>
                                        <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                            {themes.map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => toggleTheme(t.id)}
                                                    className={`flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 group ${
                                                        theme === t.id
                                                            ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30'
                                                            : 'bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-100 dark:hover:bg-slate-700/30'
                                                    }`}
                                                >
                                                    <div className={`mb-2 sm:mb-3 transform transition-transform duration-300 group-hover:scale-110 ${
                                                        theme === t.id ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-primary'
                                                    }`}>
                                                        {t.icon}
                                                    </div>
                                                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                                                        theme === t.id ? 'text-white' : ''
                                                    }`}>
                                                        {t.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3 sm:mb-4">Preview</h3>
                                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl border border-slate-100 dark:border-slate-700">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                                                <span className="text-white text-lg sm:text-xl">🥬</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">Fresh Vegetables</div>
                                                <div className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">₨ 299.00</div>
                                            </div>
                                            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-lg text-[10px] sm:text-xs font-bold">
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Notifications Section */}
                        {activeSection === 'notifications' && (
                            <section className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <div className="mb-6 sm:mb-8">
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Notifications</h2>
                                        <p className="text-slate-400 dark:text-slate-500 font-medium text-xs sm:text-sm mt-1">Choose what notifications you want to receive.</p>
                                    </div>
                                    <div className="space-y-3 sm:space-y-4">
                                        {notificationSettings.map((notif) => (
                                            <div key={notif.id} className="flex items-center justify-between p-3 sm:p-4 lg:p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                                                <div className="flex-1 min-w-0 pr-3 sm:pr-4">
                                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-0.5 sm:mb-1">{notif.label}</h4>
                                                    <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">{notif.desc}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={user?.settings?.[notif.id] ?? true}
                                                        onChange={() => handleNotificationToggle(notif.id)}
                                                        disabled={settingsLoading[notif.id]}
                                                    />
                                                    <div className={`w-10 sm:w-11 h-5 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-primary ${settingsLoading[notif.id] ? 'opacity-50' : ''}`}></div>
                                                    {settingsLoading[notif.id] && (
                                                        <span className="absolute inset-0 flex items-center justify-center">
                                                            <svg className="animate-spin h-3 w-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        </span>
                                                    )}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Security Section */}
                        {activeSection === 'security' && (
                            <section className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <div className="mb-6 sm:mb-8">
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Security</h2>
                                        <p className="text-slate-400 dark:text-slate-500 font-medium text-xs sm:text-sm mt-1">Keep your account safe and secure.</p>
                                    </div>
                                    
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="p-4 sm:p-5 lg:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                                <div>
                                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-0.5 sm:mb-1">Password</h4>
                                                    <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium">Last changed 30+ days ago</p>
                                                </div>
                                                <button
                                                    onClick={() => setShowPasswordModal(true)}
                                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-primary transition-all active:scale-95"
                                                >
                                                    Change Password
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-5 lg:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                                <div>
                                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-0.5 sm:mb-1">Two-Factor Authentication</h4>
                                                    <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium">Add an extra layer of security</p>
                                                </div>
                                                <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all active:scale-95">
                                                    Setup 2FA
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-5 lg:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                                <div>
                                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-0.5 sm:mb-1">Active Sessions</h4>
                                                    <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium">Manage your active login sessions</p>
                                                </div>
                                                <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all active:scale-95">
                                                    View Sessions
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Privacy Section */}
                        {activeSection === 'privacy' && (
                            <section className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <div className="mb-6 sm:mb-8">
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Privacy</h2>
                                        <p className="text-slate-400 dark:text-slate-500 font-medium text-xs sm:text-sm mt-1">Control your privacy and data settings.</p>
                                    </div>
                                    <div className="space-y-3 sm:space-y-4">
                                        {privacySettings.map((setting) => (
                                            <div key={setting.id} className="flex items-center justify-between p-3 sm:p-4 lg:p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                                                <div className="flex-1 min-w-0 pr-3 sm:pr-4">
                                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-0.5 sm:mb-1">{setting.label}</h4>
                                                    <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">{setting.desc}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={user?.settings?.[setting.id] ?? false}
                                                        onChange={() => handleNotificationToggle(setting.id)}
                                                    />
                                                    <div className="w-10 sm:w-11 h-5 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl sm:rounded-2xl border border-blue-100 dark:border-blue-800/50">
                                        <h4 className="text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-400 mb-2">Download Your Data</h4>
                                        <p className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-300/70 mb-3 sm:mb-4">Request a copy of all your data stored with us.</p>
                                        <button className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-blue-700 transition-all active:scale-95">
                                            Request Data Export
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Danger Zone Section */}
                        {activeSection === 'danger' && (
                            <section className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl border border-red-200 dark:border-red-800/50 overflow-hidden transition-colors duration-300">
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <div className="mb-6 sm:mb-8">
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-red-600 dark:text-red-400 uppercase tracking-tight italic">Danger Zone</h2>
                                        <p className="text-slate-400 dark:text-slate-500 font-medium text-xs sm:text-sm mt-1">Irreversible actions. Please proceed with caution.</p>
                                    </div>
                                    
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="p-4 sm:p-5 lg:p-6 bg-red-50 dark:bg-red-900/20 rounded-xl sm:rounded-2xl border border-red-200 dark:border-red-800/50">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                                <div>
                                                    <h4 className="text-xs sm:text-sm font-bold text-red-900 dark:text-red-400 uppercase tracking-tight mb-0.5 sm:mb-1">Delete Account</h4>
                                                    <p className="text-[10px] sm:text-xs text-red-700 dark:text-red-300/70 font-medium">Permanently delete your account and all associated data.</p>
                                                </div>
                                                <button
                                                    onClick={() => setShowDeleteModal(true)}
                                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-red-700 transition-all active:scale-95 flex-shrink-0"
                                                >
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase italic mb-4 sm:mb-6">Change Password</h2>
                        <form onSubmit={handlePasswordChange} className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-primary outline-none font-medium text-sm text-slate-900 dark:text-white"
                                    value={passwordData.current}
                                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">New Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-primary outline-none font-medium text-sm text-slate-900 dark:text-white"
                                    value={passwordData.new}
                                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-primary outline-none font-medium text-sm text-slate-900 dark:text-white"
                                    value={passwordData.confirm}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-green-600 shadow-lg disabled:opacity-50 text-sm"
                                >
                                    {loading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {showEditProfileModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase italic mb-4 sm:mb-6">Edit Profile</h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-primary outline-none font-medium text-sm text-slate-900 dark:text-white"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Email</label>
                                <input
                                    type="email"
                                    disabled
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-sm text-slate-400 dark:text-slate-500 cursor-not-allowed"
                                    value={profileData.email}
                                />
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Email cannot be changed</p>
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-primary outline-none font-medium text-sm text-slate-900 dark:text-white"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    placeholder="+92 300 1234567"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditProfileModal(false)}
                                    className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-green-600 shadow-lg disabled:opacity-50 text-sm"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase italic mb-2">Delete Account?</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">This action is permanent and cannot be undone. All your data will be permanently deleted.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg disabled:opacity-50 text-sm"
                            >
                                {loading ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;