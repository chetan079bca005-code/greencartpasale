import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, setUser, setShowUserLogin, navigate, searchQuery, setSearchQuery, getCartCount, axios } = useAppContext();
  const location = useLocation();

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
    if (searchQuery.length > 0) {
      navigate('/products');
    }
  }, [searchQuery, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
    }`}>
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32">
        {/* Logo */}
        <NavLink to="/" onClick={() => setOpen(false)} className="transform hover:scale-105 transition-transform">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">प</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-primary">पसले</h1>
              <span className="text-xs text-gray-500">Fresh Groceries</span>
            </div>
          </div>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8">
          {/* Nav Links */}
          <NavLink 
            to="/" 
            className={`relative group ${isActive('/') ? 'text-primary' : 'text-gray-600'}`}
          >
            Home
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full ${isActive('/') ? 'w-full' : ''}`}></span>
          </NavLink>
          <NavLink 
            to="/products" 
            className={`relative group ${isActive('/products') ? 'text-primary' : 'text-gray-600'}`}
          >
            All Products
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full ${isActive('/products') ? 'w-full' : ''}`}></span>
          </NavLink>
          <NavLink 
            to="/shop" 
            className={`relative group ${isActive('/shop') ? 'text-primary' : 'text-gray-600'}`}
          >
            Shop
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full ${isActive('/shop') ? 'w-full' : ''}`}></span>
          </NavLink>
          <NavLink 
            to="/about" 
            className={`relative group ${isActive('/about') ? 'text-primary' : 'text-gray-600'}`}
          >
            About
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full ${isActive('/about') ? 'w-full' : ''}`}></span>
          </NavLink>
          <NavLink 
            to="/contact" 
            className={`relative group ${isActive('/contact') ? 'text-primary' : 'text-gray-600'}`}
          >
            Contact
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full ${isActive('/contact') ? 'w-full' : ''}`}></span>
          </NavLink>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full hover:border-primary transition-colors">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          </div>

          {/* Cart Icon with Badge */}
          <div 
            onClick={() => navigate('/cart')} 
            className="relative cursor-pointer transform hover:scale-110 transition-transform"
          >
            <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80" />
            <span className="absolute -top-2 -right-2 text-[10px] font-semibold text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full animate-bounce">{getCartCount()}</span>
          </div>

          {/* User Profile or Login */}
          {!user ? (
            <button 
              onClick={() => setShowUserLogin(true)} 
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-full transform hover:scale-105 hover:shadow-lg"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <img
                src={assets.profile_icon}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer transform hover:scale-110 transition-transform"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-lg z-50 py-2 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <NavLink 
                    to="/my-orders" 
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors" 
                    onClick={() => setShowDropdown(false)}
                  >
                    My Orders
                  </NavLink>
                  <button 
                    onClick={logout} 
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className='flex items-center gap-6 sm:hidden'>
          <div 
            onClick={() => navigate('/cart')} 
            className="relative cursor-pointer transform hover:scale-110 transition-transform"
          >
            <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80" />
            <span className="absolute -top-2 -right-2 text-[10px] font-semibold text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full animate-bounce">{getCartCount()}</span>
          </div>

          <button 
            onClick={() => setOpen(!open)} 
            aria-label="Menu" 
            className="transform hover:scale-110 transition-transform"
          >
            <img src={assets.profile_icon} alt="Profile" className="w-10" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden flex animate-slideDown">
          <NavLink 
            to="/" 
            onClick={() => setOpen(false)}
            className={`w-full py-2 ${isActive('/') ? 'text-primary' : 'text-gray-600'}`}
          >
            Home
          </NavLink>
          <NavLink 
            to="/products" 
            onClick={() => setOpen(false)}
            className={`w-full py-2 ${isActive('/products') ? 'text-primary' : 'text-gray-600'}`}
          >
            All Products
          </NavLink>
          <NavLink 
            to="/shop" 
            onClick={() => setOpen(false)}
            className={`w-full py-2 ${isActive('/shop') ? 'text-primary' : 'text-gray-600'}`}
          >
            Shop
          </NavLink>
          <NavLink 
            to="/about" 
            onClick={() => setOpen(false)}
            className={`w-full py-2 ${isActive('/about') ? 'text-primary' : 'text-gray-600'}`}
          >
            About
          </NavLink>
          <NavLink 
            to="/contact" 
            onClick={() => setOpen(false)}
            className={`w-full py-2 ${isActive('/contact') ? 'text-primary' : 'text-gray-600'}`}
          >
            Contact
          </NavLink>
          {user && (
            <NavLink 
              to="/my-orders" 
              onClick={() => setOpen(false)}
              className={`w-full py-2 ${isActive('/my-orders') ? 'text-primary' : 'text-gray-600'}`}
            >
              My Orders
            </NavLink>
          )}

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="w-full cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-full text-sm transform hover:scale-105"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-full text-sm transform hover:scale-105"
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
