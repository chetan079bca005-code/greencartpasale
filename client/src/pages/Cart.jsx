import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast"

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
      if (!user?._id) {
        toast.error("Please login to view addresses");
        return;
      }

      const { data } = await axios.get('/api/address', {
        params: { userId: user._id }
      });

      console.log("Fetched addresses:", data); // Debug log
      setAddresses(data || []);

      if (data?.length > 0) {
        setSelectedAddress(data[0]);
      } else {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error('please select an address')
      }
      setPlacingOrder(true);

      //place order with cod
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
          totalAmount: (getCartAmount() * 1.02).toFixed(2) // Including 2% tax
        })

        if (data.success) {
          // Clear cart items
          setCartItems({});
          // Clear local storage cart if it exists
          localStorage.removeItem('cartItems');
          toast.success(data.message)
          navigate('/my-orders')
        } else {
          toast.error(data.message)
        }
      } else if (paymentOption === "eSewa") {
        //place order with esewa
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

        // eSewa returns raw HTML form for redirection
        if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
          // Clear cart items before redirecting
          setCartItems({});
          localStorage.removeItem('cartItems');

          // Write the HTML response to the document to auto-submit the form
          document.open();
          document.write(data);
          document.close();
          return;
        }

        if (data.success === false) {
          toast.error(data.message)
        }
      } else {
        //place order with stripe
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
          totalAmount: (getCartAmount() * 1.02).toFixed(2) // Including 2% tax
        })

        if (data.success) {
          // Clear cart items before redirecting
          setCartItems({});
          // Clear local storage cart if it exists
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
        return 'kg';
      case 'grain':
        return 'kg';
      case 'dairy products':
        return 'L';
      case 'cold drinks':
        return 'bottle';
      case 'instant food':
        return 'packet';
      default:
        return 'piece';
    }
  };

  const formatQuantity = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 0; // or return '' if you want to show nothing
    }
    if (value % 1 === 0) {
      return value;
    }
    return value.toFixed(1);
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






  return products.length > 0 && cartItems ? (
    <div className="pt-24 pb-10">
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
        {/* Cart Items Section */}
        <div className="flex-1 max-w-4xl">
          <h1 className="text-3xl font-medium mb-6">
            Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
          </h1>

          <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
            <p className="text-left">Product Details</p>
            <p className="text-center">Subtotal</p>
            <p className="text-center">Action</p>
          </div>

          {cartArray.map((product, index) => (
            <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
              <div className="flex items-center md:gap-6 gap-3">
                <div
                  onClick={() => {
                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
                >
                  <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                </div>
                <div>
                  <p className="hidden md:block font-semibold">{product.name}</p>
                  <div className="font-normal text-gray-500/70">
                    <div className="flex items-center">
                      <p>Qty:</p>
                      <div className="flex items-center ml-2">
                        <button
                          onClick={() => updateCartItem(product._id, Math.max(0.5, cartItems[product._id] - 0.5))}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-12 text-center border-t border-b border-gray-300 py-1">
                          {formatQuantity(cartItems[product._id])} {getUnitDisplay(product)}
                        </span>
                        <button
                          onClick={() => updateCartItem(product._id, cartItems[product._id] + 0.5)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center">
                {currency}{((product.offerPrice || product.price) * product.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(product._id)}
                className="cursor-pointer mx-auto"
              >
                <img src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6" />
              </button>
            </div>
          ))}

          <button
            onClick={() => { navigate("/products"); window.scrollTo(0, 0); }}
            className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
          >
            <img
              src={assets.arrow_right_icon_colored}
              alt="arrow"
              className="group-hover:-translate-x-1 transition"
            />
            Continue Shopping
          </button>
        </div>

        {/* Order Summary Section */}
        <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
          <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
          <hr className="border-gray-300 my-5" />

          <div className="mb-6">
            <p className="text-sm font-medium uppercase">Delivery Address</p>
            {loadingAddresses ? (
              <p className="text-gray-500 mt-2">Loading addresses...</p>
            ) : (
              <div className="relative flex justify-between items-start mt-2">
                <p className="text-gray-500">
                  {selectedAddress ?
                    `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                    : "No address selected"}
                </p>
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="text-primary hover:underline cursor-pointer"
                >
                  {addresses.length > 0 ? "Change" : "Add"}
                </button>

                {showAddress && (
                  <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                    {addresses.length > 0 ? (
                      <>
                        {addresses.map((address, index) => (
                          <p
                            key={index}
                            onClick={() => {
                              setSelectedAddress(address);
                              setShowAddress(false);
                            }}
                            className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {address.street}, {address.city}, {address.state}, {address.country}
                          </p>
                        ))}
                        <hr className="border-gray-200 my-1" />
                        <p
                          onClick={() => {
                            navigate("/add-address");
                            setShowAddress(false);
                          }}
                          className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                        >
                          + Add new address
                        </p>
                      </>
                    ) : (
                      <p
                        onClick={() => navigate("/add-address")}
                        className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                      >
                        + Add new address
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium uppercase">Payment Method</p>
            <select
              onChange={e => setPaymentOption(e.target.value)}
              value={paymentOption}
              className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
            >
              <option value="COD">Cash On Delivery</option>
              <option value="eSewa">eSewa Mobile Wallet</option>
              <option value="Online">Online Payment (Stripe)</option>
            </select>
          </div>

          <hr className="border-gray-300" />

          <div className="text-gray-500 mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Price</span><span>{currency}{getCartAmount().toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Shipping Fee</span><span className="text-green-600">Free</span>
            </p>
            <p className="flex justify-between">
              <span>Tax (2%)</span><span>{currency}{(getCartAmount() * 0.02).toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-lg font-medium mt-3">
              <span>Total Amount:</span><span>{currency}{(getCartAmount() * 1.02).toFixed(2)}</span>
            </p>
          </div>

          <button
            onClick={placeOrder}
            disabled={placingOrder}
            className={`w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dark transition ${placingOrder ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {placingOrder ? 'Processing...' : (
              paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"
            )}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center py-20">
      <img src={assets.empty_cart} alt="Empty cart" className="w-48 mx-auto mb-6" />
      <h2 className="text-2xl font-medium mb-4">Your Cart is Empty</h2>
      <button
        onClick={() => navigate('/products')}
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
      >
        Continue Shopping
      </button>
    </div>




  );
};





export default Cart;