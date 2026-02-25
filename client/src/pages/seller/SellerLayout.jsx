import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useState } from "react";

const SellerLayout = () => {
    const { axios, navigate, theme, toggleTheme } = useAppContext();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarSections = [
        {
            title: "Main",
            items: [
                {
                    name: "Dashboard", path: "/seller", end: true,
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                },
            ]
        },
        {
            title: "Products",
            items: [
                {
                    name: "Add Product", path: "/seller/add-product",
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" /></svg>
                },
                {
                    name: "Product List", path: "/seller/product-list",
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                },
            ]
        },
        {
            title: "Orders & Users",
            items: [
                {
                    name: "Orders", path: "/seller/orders",
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                },
                {
                    name: "Customers", path: "/seller/customers",
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                },
            ]
        },
        {
            title: "Communication",
            items: [
                {
                    name: "Messages", path: "/seller/messages",
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                },
                {
                    name: "Subscribers", path: "/seller/subscribers",
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                },
            ]
        },
        {
            title: "Analytics",
            items: [
                {
                    name: "AI Insights", path: "/seller/ai-insights",
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                },
            ]
        }
    ];

    const Logout = async () => {
        try {
            const { data } = await axios.post('/api/seller/logout');
            if (data.success) {
                toast.success(data.message);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            {/* Top Navbar */}
            <div className="flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-gray-700 py-3 bg-white dark:bg-slate-800 transition-colors duration-200 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                    <NavLink to="/seller" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                                <span className="text-white text-lg font-bold">प</span>
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <h1 className="text-lg font-bold text-primary leading-tight">पसले</h1>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5">Admin Portal</span>
                        </div>
                    </NavLink>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    >
                        {theme === 'dark' ? (
                            <svg className="w-[18px] h-[18px] text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-[18px] h-[18px] text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-bold text-primary">A</span>
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Admin</span>
                    </div>
                    <button
                        onClick={Logout}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>

            <div className="flex bg-gray-50 dark:bg-slate-900 transition-colors duration-200 min-h-[calc(100vh-57px)]">
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 z-20 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed md:sticky top-[57px] left-0 z-20 h-[calc(100vh-57px)]
                    w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700
                    transition-transform duration-200 ease-in-out overflow-y-auto no-scrollbar
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    <nav className="p-3 space-y-5">
                        {sidebarSections.map((section) => (
                            <div key={section.title}>
                                <p className="px-3 mb-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                    {section.title}
                                </p>
                                <div className="space-y-0.5">
                                    {section.items.map((item) => (
                                        <NavLink
                                            to={item.path}
                                            key={item.name}
                                            end={item.end}
                                            onClick={() => setSidebarOpen(false)}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                                    isActive
                                                        ? 'bg-primary/10 dark:bg-primary/20 text-primary shadow-sm'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white'
                                                }`
                                            }
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer of sidebar */}
                    <div className="p-3 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <NavLink
                            to="/"
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span>Visit Store</span>
                        </NavLink>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default SellerLayout;