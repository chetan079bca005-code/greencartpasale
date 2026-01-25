import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { user, setUser, setShowUserLogin, navigate, searchQuery, setSearchQuery, getCartCount, axios, products, theme, toggleTheme, currency, getUnreadNotificationCount } = useAppContext();
  const location = useLocation();
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout')
      if (data.success) {
        toast.success(data.message)
        setUser(null);
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
      ? 'bg-white dark:bg-slate-900 shadow-xl py-2'
      : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4'
      }`}>
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <NavLink to="/" onClick={() => setOpen(false)} className="group">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-all shadow-md">
              <span className="text-white text-lg font-black">प</span>
            </div>
            <div className="flex flex-col leading-none">
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white transition-colors">पसले</h1>
              <span className="text-[8px] font-bold tracking-[0.1em] uppercase text-primary">Premium Market</span>
            </div>
          </div>
        </NavLink>


        <div className="hidden sm:flex items-center gap-8">
          {/* Nav Links */}
          {[
            { name: 'Home', path: '/' },
            { name: 'Products', path: '/products' },
            { name: 'Shop', path: '/shop' },
            { name: 'About', path: '/about' },
            { name: 'Contact', path: '/contact' }
          ].map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                relative text-xs font-black tracking-widest uppercase transition-all duration-300 group
                ${isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}
              `}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </NavLink>
          ))}


          {/* Utility Icons */}
          <div className="flex items-center gap-5 border-l border-slate-200 dark:border-slate-800 pl-8">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => {
                  setShowSearch(!showSearch);
                  if (!showSearch) setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className="cursor-pointer text-slate-600 dark:text-slate-400 hover:text-primary transition-colors p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>

              {showSearch && (
                <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-800 shadow-2xl rounded-3xl border border-slate-100 dark:border-slate-700 p-4 transition-all animate-fadeIn overflow-hidden">
                  <div className="relative mb-4">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none text-sm font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
                    />
                  </div>
                  {searchQuery && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] px-2 mb-2">Results</p>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map(p => (
                          <div
                            key={p._id}
                            onClick={() => {
                              navigate(`/products/${p.category}/${p._id}`);
                              setShowSearch(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl cursor-pointer transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <img src={p.image[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-black text-slate-800 dark:text-white truncate uppercase">{p.name}</h4>
                              <p className="text-[10px] font-bold text-primary">{currency}{p.offerPrice || p.price}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-600 px-2 py-4 text-center italic">No items found</p>
                      )}
                      <button
                        onClick={() => { navigate('/products'); setShowSearch(false); }}
                        className="w-full py-3 mt-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors"
                      >
                        View All Results
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
              className="cursor-pointer text-slate-600 dark:text-slate-400 hover:text-primary transition-all p-2 bg-slate-50 dark:bg-slate-800 rounded-xl"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 16.243l.707.707M7.757 7.757l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>


            <div
              onClick={() => navigate('/notifications')}
              className="relative cursor-pointer group p-2"
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {getUnreadNotificationCount() > 0 && (
                <span className="absolute top-0 right-0 text-[8px] font-black text-white bg-amber-500 w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-sm">
                  {getUnreadNotificationCount()}
                </span>
              )}
            </div>

            {/* Cart Icon with Badge */}
            <div
              onClick={() => navigate('/cart')}
              className="relative cursor-pointer group p-2"
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 text-[8px] font-black text-white bg-primary w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-sm">{getCartCount()}</span>
              )}
            </div>


            {/* User Profile or Login */}
            {!user ? (
              <button
                onClick={() => setShowUserLogin(true)}
                className={`text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 ${isScrolled || location.pathname !== '/' ? 'bg-slate-900 text-white hover:bg-primary' : 'bg-primary text-white hover:bg-slate-900'}`}
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-primary transition-all overflow-hidden"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase italic italic">
                    {user.name.charAt(0)}
                  </div>
                </div>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 rounded-[2rem] z-50 py-4 animate-fadeIn overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-700 mb-2">
                      <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight truncate text-sm italic">{user.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest truncate">{user.email}</p>
                    </div>
                    <NavLink
                      to="/my-orders"
                      className="block px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary flex items-center gap-3"
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      My Orders
                    </NavLink>
                    <NavLink
                      to="/notifications"
                      className="block px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary flex items-center gap-3"
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      Notifications
                    </NavLink>
                    <NavLink
                      to="/settings"
                      className="block px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-primary flex items-center gap-3"
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Settings
                    </NavLink>
                    <div className="my-2 border-t border-slate-50 dark:border-slate-700"></div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-6 py-3 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-xs font-black text-red-600 flex items-center gap-3 uppercase tracking-widest"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className='flex items-center gap-5 sm:hidden'>
          <button
            onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-slate-600 dark:text-slate-400 p-2"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 16.243l.707.707M7.757 7.757l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          <div
            onClick={() => navigate('/notifications')}
            className="relative cursor-pointer transition-transform active:scale-90"
          >
            <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {getUnreadNotificationCount() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black text-white bg-amber-500 w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
                {getUnreadNotificationCount()}
              </span>
            )}
          </div>

          <div
            onClick={() => navigate('/cart')}
            className="relative cursor-pointer transition-transform active:scale-90"
          >
            <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black text-white bg-primary w-4 h-4 flex items-center justify-center rounded-full shadow-lg">{getCartCount()}</span>
          </div>

          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg transform active:scale-90 transition-all"
          >
            {open ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 shadow-2xl py-8 flex flex-col items-center gap-4 px-6 text-sm sm:hidden animate-slideDown border-t border-slate-50 dark:border-slate-800 transition-colors duration-500">
          {[
            { name: 'Home', path: '/' },
            { name: 'All Products', path: '/products' },
            { name: 'Shop', path: '/shop' },
            { name: 'About', path: '/about' },
            { name: 'Contact', path: '/contact' }
          ].map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`w-full py-4 px-8 rounded-2xl text-center font-black uppercase tracking-widest text-xs transition-all ${isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            >
              {link.name}
            </NavLink>
          ))}

          {user && (
            <NavLink
              to="/notifications"
              onClick={() => setOpen(false)}
              className={`w-full py-4 px-8 rounded-2xl text-center font-black uppercase tracking-widest text-xs transition-all ${isActive('/notifications') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Notifications
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/settings"
              onClick={() => setOpen(false)}
              className={`w-full py-4 px-8 rounded-2xl text-center font-black uppercase tracking-widest text-xs transition-all ${isActive('/settings') ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Settings
            </NavLink>
          )}

          <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-4"></div>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="w-full py-5 bg-slate-900 dark:bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full py-5 border-2 border-slate-900 dark:border-slate-700 text-slate-900 dark:text-white font-black uppercase tracking-widest rounded-2xl active:scale-95"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

