import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { dummyProducts } from '../assets/assets.js';
import { toast } from 'react-hot-toast';
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || '₨';
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setproducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [notifications, setNotifications] = useState([]);

  // Theme management - Fixed implementation
  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (themeValue) => {
      // First remove both classes
      root.classList.remove('light', 'dark');
      
      let effectiveTheme = themeValue;
      
      if (themeValue === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      // Apply the class
      root.classList.add(effectiveTheme);
      
      // Also set data attribute for better CSS compatibility
      root.setAttribute('data-theme', effectiveTheme);
      
      // Force style recalculation
      document.body.style.colorScheme = effectiveTheme;
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // Listen for system theme changes if system is selected
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        root.classList.remove('light', 'dark');
        const newTheme = e.matches ? 'dark' : 'light';
        root.classList.add(newTheme);
        root.setAttribute('data-theme', newTheme);
        document.body.style.colorScheme = newTheme;
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (newTheme !== theme) {
      setTheme(newTheme);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get('/api/notification/list');
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      const { data } = await axios.post('/api/notification/mark-read', { notificationId: id });
      if (data.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      }
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      const { data } = await axios.post('/api/notification/delete', { notificationId: id });
      if (data.success) {
        setNotifications(data.notifications || notifications.filter(n => n._id !== id));
        return true;
      }
    } catch (error) {
      toast.error("Failed to delete notification");
      return false;
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const { data } = await axios.post('/api/notification/mark-all-read');
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const { data } = await axios.post('/api/user/update-password', { currentPassword, newPassword });
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
      return false;
    }
  };

  const updateUserSettings = async (newSettings) => {
    try {
      const { data } = await axios.post('/api/user/update-settings', { settings: newSettings });
      if (data.success) {
        setUser(prev => ({ ...prev, settings: data.settings }));
        toast.success("Settings updated");
        return true;
      }
    } catch (error) {
      toast.error("Failed to update settings");
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  //fetch seller status

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get('/api/seller/is-auth');
      if (data.success) {
        setIsSeller(true)
      } else {
        setIsSeller(false)

      }
    } catch (error) {
      setIsSeller(false)


    }

  }


  //fetch user auth status, user data and cart items

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/is-auth')
      if (data.success) {
        setUser(data.user)
        setCartItems(data.user.cartItems)
      }
    } catch (error) {
      setUser(null)
    }

  }

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/list', { params: { search: searchQuery } })

      if (data.success) {
        setproducts(data.products)

      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)


    }

  };

  const addToCart = (itemId, quantity = 1) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += quantity;
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    toast.success('Added to Cart');
  };

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success('Cart updated');
  };

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success('Removed from cart');
    setCartItems(cartData);
  };

  //get cartitem count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];

    }
    return totalCount;
  }

  //get cart total amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo && cartItems[items] > 0) {
        totalAmount += (itemInfo.offerPrice || itemInfo.price) * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  }


  useEffect(() => {
    fetchProducts()
  }, [searchQuery]);

  useEffect(() => {
    fetchUser()
    fetchSeller()
  }, []);


  //update database cartitems
  useEffect(() => {
    const updateCart = async () => {
      try {
        // In your useEffect code, modify the axios call:
        const { data } = await axios.post('/api/cart/update', {
          userId: user._id,  // Add the user ID
          cartItems
        }); 
        if (!data.success) {
          toast.error(data.message)
        } else {
          // Refresh notifications after cart update (they may have been created on backend)
          fetchNotifications();
        }

      } catch (error) {
        toast.error(error.message)
      }
    }

    if (user) {
      updateCart()
    }
  }, [cartItems]);

  // Create notification helper function (for frontend use)
  const createNotification = async (type, title, message) => {
    if (!user) return;
    try {
      const { data } = await axios.post('/api/notification/create', {
        userId: user._id,
        type,
        title,
        message
      });
      if (data.success) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  };

  // Refresh user settings from server
  const refreshUserSettings = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get('/api/user/is-auth');
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const value = {
    navigate,
    user,
    setUser,
    setIsSeller,
    isSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setCartItems,
    theme,
    toggleTheme,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadNotificationCount,
    changePassword,
    updateUserSettings,
    fetchNotifications,
    createNotification,
    refreshUserSettings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);


