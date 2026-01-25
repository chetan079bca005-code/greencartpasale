import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast"
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItems
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [cartRecommendations, setCartRecommendations] = useState([]);

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        product.quantity = cartItems[key];
        tempArray.push(product);
      }
    }
    setCartArray(tempArray);
  };

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      if (!user?._id) return;
      const { data } = await axios.get('/api/address', {
        params: { userId: user._id }
      });
      setAddresses(data || []);
      if (data?.length > 0) {
        setSelectedAddress(data[0]);
      } else {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error('Please select a delivery address')
      }
      setPlacingOrder(true);

      if (paymentOption === "COD") {
        const { data } = await axios.post('/api/order/cod', {
          userId: user._id,
          items: cartArray.map(item => ({
            product: {
              _id: item._id,
              name: item.name,
              price: item.offerPrice || item.price,
              image: item.image[0]
            },
            quantity: item.quantity
          })),
          address: selectedAddress._id,
          totalAmount: (getCartAmount() * 1.02).toFixed(2)
        })

        if (data.success) {
          setCartItems({});
          localStorage.removeItem('cartItems');
          toast.success("Order Placed Successfully")
          navigate('/my-orders')
        } else {
          toast.error(data.message)
        }
      } else if (paymentOption === "eSewa") {
        const { data } = await axios.post('/api/order/esewa', {
          userId: user._id,
          items: cartArray.map(item => ({
            product: {
              _id: item._id,
              name: item.name,
              price: item.offerPrice || item.price,
              image: item.image[0]
            },
            quantity: item.quantity
          })),
          address: selectedAddress._id,
          totalAmount: (getCartAmount() * 1.02).toFixed(2)
        })

        if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
          setCartItems({});
          localStorage.removeItem('cartItems');
          document.open();
          document.write(data);
          document.close();
          return;
        }

        if (data.success === false) {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post('/api/order/stripe', {
          userId: user._id,
          items: cartArray.map(item => ({
            product: {
              _id: item._id,
              name: item.name,
              price: item.offerPrice || item.price,
              image: item.image[0]
            },
            quantity: item.quantity
          })),
          address: selectedAddress._id,
          totalAmount: (getCartAmount() * 1.02).toFixed(2)
        })

        if (data.success) {
          setCartItems({});
          localStorage.removeItem('cartItems');
          window.location.replace(data.url)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setPlacingOrder(false);
    }
  };

  const getUnitDisplay = (product) => {
    switch (product.category.toLowerCase()) {
      case 'vegetables':
      case 'fruits':
      case 'grain':
        return 'kg';
      case 'dairy products':
        return 'L';
      case 'cold drinks':
        return 'bottle';
      case 'instant food':
        return 'packet';
      default:
        return 'unit';
    }
  };

  const formatQuantity = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return 0;
    return value % 1 === 0 ? value : value.toFixed(1);
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  // Fetch cart-based recommendations
  useEffect(() => {
    const fetchCartRecommendations = async () => {
      try {
        const cartProductIds = Object.keys(cartItems).filter(key => cartItems[key] > 0);
        if (cartProductIds.length === 0) return;

        const { data } = await axios.post('/api/recommendations/cart', {
          cartItems: cartProductIds,
          userId: user?._id
        });
        setCartRecommendations(data?.recommendations || []);
      } catch (error) {
        console.log("Cart recommendations not available");
      }
    };
    
    if (Object.keys(cartItems).length > 0) {
      fetchCartRecommendations();
    }
  }, [cartItems, user, axios]);

  if (getCartCount() === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-slate-900 transition-colors duration-500">
        <div className="w-40 h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-8 rounded-3xl shadow-inner">
          <svg className="w-16 h-16 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Your Cart is Empty</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium text-sm leading-relaxed">
          It looks like you haven't added anything to your cart yet. Explore our fresh products and start shopping!
        </p>
        <Link
          to="/shop"
          className="px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-white dark:bg-slate-900 transition-colors duration-500 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 inline-block">Order Management</span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Shopping Cart</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-4">{getCartCount()} items in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main List */}
          <div className="flex-1 space-y-4">
            {cartArray.map((product, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col sm:flex-row items-center gap-8 group hover:shadow-lg hover:border-primary dark:hover:border-primary transition-all duration-300 shadow-sm">
                <div
                  onClick={() => navigate(`/products/${product.category.toLowerCase()}/${product._id}`)}
                  className="w-28 h-28 flex-shrink-0 bg-slate-100 dark:bg-slate-900 rounded-xl p-3 cursor-pointer group-hover:scale-105 transition-all"
                >
                  <img className="w-full h-full object-contain" src={product.image[0]} alt={product.name} />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <span className="text-primary font-bold tracking-wider text-[10px] uppercase">{product.category}</span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">{product.name}</h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => updateCartItem(product._id, Math.max(0.5, cartItems[product._id] - 0.5))}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary transition-all font-bold"
                      >-</button>
                      <span className="px-4 text-sm font-bold text-slate-900 dark:text-white min-w-[80px] text-center">
                        {formatQuantity(cartItems[product._id])} {getUnitDisplay(product)}
                      </span>
                      <button
                        onClick={() => updateCartItem(product._id, cartItems[product._id] + 0.5)}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary transition-all font-bold"
                      >+</button>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                      {currency}{(product.offerPrice || product.price).toFixed(2)} / {getUnitDisplay(product)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center gap-6">
                  <div className="text-xl font-bold text-primary">
                    {currency}{((product.offerPrice || product.price) * product.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all active:scale-90"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <Link
              to="/products"
              className="inline-flex items-center gap-3 text-primary font-bold text-sm mt-8 hover:gap-4 transition-all"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-xl sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Order Summary</h2>

              <div className="space-y-6 mb-8">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Delivery Address</span>
                    <button
                      onClick={() => setShowAddress(!showAddress)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {addresses.length > 0 ? "Change" : "Add New"}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                      {selectedAddress ?
                        `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`
                        : "No address selected"}
                    </div>
                    {showAddress && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                        {addresses.map((address, idx) => (
                          <button
                            key={idx}
                            onClick={() => { setSelectedAddress(address); setShowAddress(false); }}
                            className="w-full p-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                          >
                            {address.street}, {address.city}
                          </button>
                        ))}
                        <Link to="/add-address" className="block p-4 text-center text-sm font-medium text-primary hover:bg-slate-50 dark:hover:bg-slate-700">
                          + Add New Address
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 block">Payment Method</span>
                  <select
                    onChange={e => setPaymentOption(e.target.value)}
                    value={paymentOption}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-white outline-none focus:border-primary transition-colors"
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="eSewa">eSewa Mobile Wallet</option>
                    <option value="Online">Online Payment (Stripe)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 space-y-3 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{currency}{getCartAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-primary">
                  <span>Shipping Fee</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                  <span>Tax (2%)</span>
                  <span>{currency}{(getCartAmount() * 0.02).toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Total</span>
                  <div className="text-2xl font-bold text-primary">
                    {currency}{(getCartAmount() * 1.02).toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placingOrder}
                className={`w-full py-4 mt-6 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 ${placingOrder ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-primary/20 hover:shadow-xl'
                  }`}
              >
                {placingOrder ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>

        {/* Cart Recommendations Section */}
        {cartRecommendations.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Complete Your Order</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Customers also bought these items</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cartRecommendations.slice(0, 5).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;