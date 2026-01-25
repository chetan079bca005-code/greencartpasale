import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {
    const { axios, navigate, theme, toggleTheme } = useAppContext();

    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon: assets.add_icon },
        { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
        { name: "Messages", path: "/seller/messages", icon: assets.message_icon },
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
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 dark:border-gray-700 py-3 bg-white dark:bg-slate-800 transition-colors duration-300">
                <NavLink to="/" className="transform hover:scale-105 transition-transform">
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-xl font-bold">प</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-primary">पसले</h1>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Seller Portal</span>
                        </div>
                    </div>
                </NavLink>
                <div className="flex items-center gap-5 text-gray-500 dark:text-gray-300">
                    <button onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        {theme === 'dark' ? (
                            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>
                    <p className="hidden md:block">Hi! Admin</p>
                    <button onClick={Logout} className='border border-gray-300 dark:border-gray-600 rounded-full text-sm px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>Logout</button>
                </div>
            </div>

            <div className="flex bg-gray-50 dark:bg-slate-900 transition-colors duration-300 min-h-screen">
                <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 dark:border-gray-700 pt-4 flex flex-col bg-white dark:bg-slate-800 transition-colors duration-300">
                    {sidebarLinks.map((item) => (
                        <NavLink
                            to={item.path}
                            key={item.name}
                            end={item.path === "/seller"}
                            className={({ isActive }) => `flex items-center py-3 px-4 gap-3 transition-colors
                                ${isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 dark:bg-primary/20 border-primary text-primary"
                                    : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 border-transparent"
                                }`
                            }
                        >
                            <img src={item.icon} alt="" className="w-7 h-7" />
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <Outlet />
            </div>
        </>
    );
};

export default SellerLayout;