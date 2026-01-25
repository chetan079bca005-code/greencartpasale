import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart, currency } = useAppContext();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [boughtTogether, setBoughtTogether] = useState([]);

  useEffect(() => {
    const foundProduct = products.find((p) => p._id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setThumbnail(foundProduct.image?.[0] || null);
    }
    window.scrollTo(0, 0);
  }, [id, products]);

  useEffect(() => {
    const fetchBoughtTogether = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recommendations/frequently-bought/${id}`);
        const data = await response.json();
        setBoughtTogether(data.recommended || []);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
    if (id) fetchBoughtTogether();
  }, [id]);


  if (!product) return <div className="p-6">Product not found.</div>;


  const relatedProducts = products.filter(
    (p) => p.category === product.category && p._id !== product._id
  );

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

  const getQuantityStep = (product) => {
    switch (product.category.toLowerCase()) {
      case 'vegetables':
      case 'fruits':
      case 'grain':
        return 0.5;
      case 'dairy products':
        return 0.5;
      case 'cold drinks':
      case 'instant food':
        return 1;
      default:
        return 1;
    }
  };

  const formatQuantity = (value) => {
    if (value % 1 === 0) {
      return value;
    }
    return value.toFixed(1);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await addToCart(product._id, quantity);
    setIsAddingToCart(false);
  };

  const handleBuyNow = async () => {
    setIsAddingToCart(true);
    await addToCart(product._id, quantity);
    setIsAddingToCart(false);
    navigate("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb - Minimalist */}
      <div className="flex items-center space-x-2 text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-600 mb-12 transition-colors">
        <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
        <span>/</span>
        <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/shop')}>Shop</span>
        <span>/</span>
        <span className="text-slate-900 dark:text-white">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Images */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
          <div className="flex md:flex-col gap-3">
            {product.image.map((img, i) => (
              <div
                key={i}
                onClick={() => setThumbnail(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${thumbnail === img ? 'border-primary shadow-lg scale-105' : 'border-slate-100 dark:border-slate-700 hover:border-primary/50'
                  }`}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex-grow bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-700 flex items-center justify-center p-8 transition-colors">
            <img src={thumbnail} alt="Selected" className="max-w-full h-[350px] md:h-[450px] object-contain hover:scale-105 transition-transform duration-700 drop-shadow-2xl" />
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-primary/10">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight uppercase italic decoration-primary/20 decoration-8 underline-offset-8">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
              <div className="flex items-center gap-1.5 text-amber-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span>{product.rating || 4.8} Rating</span>
              </div>
              <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
              <span className="text-primary">Verified Fresh</span>
            </div>
          </div>

          <div className="mb-10 space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-black text-primary tracking-tighter transition-all">{currency}{product.offerPrice}</span>
              {product.price > product.offerPrice && (
                <span className="text-xl text-slate-300 dark:text-slate-700 line-through font-bold">{currency}{product.price}</span>
              )}
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Price updated based on daily market</p>
          </div>

          <div className="space-y-10">
            {/* Controls */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Select Quantity ({getUnitDisplay(product)})</p>
              <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl w-fit border border-slate-200 dark:border-slate-700 transition-colors">
                <button
                  onClick={() => setQuantity(prev => Math.max(getQuantityStep(product), prev - getQuantityStep(product)))}
                  className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 dark:text-white rounded-xl shadow-sm hover:bg-slate-900 dark:hover:bg-primary hover:text-white transition-all font-black text-xl"
                >−</button>
                <span className="w-16 text-center font-black text-xl text-slate-900 dark:text-white">{formatQuantity(quantity)}</span>
                <button
                  onClick={() => setQuantity(prev => prev + getQuantityStep(product))}
                  className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 dark:text-white rounded-xl shadow-sm hover:bg-slate-900 dark:hover:bg-primary hover:text-white transition-all font-black text-xl"
                >+</button>
              </div>
            </div>

            {/* Description Minimalist */}
            <div className="space-y-4 py-8 border-y border-slate-100 dark:border-slate-800 transition-colors">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Product Details</p>
              <div className="grid grid-cols-1 gap-3">
                {product.description.map((desc, i) => (
                  <div key={i} className="flex gap-4 text-xs text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
                    <span className="text-primary mt-0.5 animate-pulse">•</span>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="py-5 px-4 bg-slate-900 dark:bg-slate-700 text-white font-black rounded-2xl hover:bg-primary transition-all uppercase text-[10px] tracking-widest shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isAddingToCart ? 'Syncing...' : 'Add To Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isAddingToCart}
                className="py-5 px-4 bg-primary text-white font-black rounded-2xl hover:bg-slate-900 dark:hover:bg-slate-600 transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <div className="flex flex-col mb-10">
            <span className="text-amber-500 font-black tracking-widest text-[10px] uppercase bg-amber-500/10 px-4 py-1.5 rounded-full w-fit border border-amber-500/10">More to Explore</span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mt-4 uppercase tracking-tighter italic">Related Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.slice(0, 4).map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}


      {/* Frequently Bought Together (Apriori Algorithm) */}
      {boughtTogether.length > 0 && (
        <div className="mt-24">
          <div className="flex flex-col mb-10">
            <span className="text-primary font-black tracking-widest text-[10px] uppercase bg-primary/10 px-4 py-1.5 rounded-full w-fit border border-primary/10">Recommendations</span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mt-4 uppercase tracking-tighter italic whitespace-nowrap overflow-hidden text-ellipsis">Frequently Bought Together</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Customers who viewed this also added these to their cart.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {boughtTogether.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};


export default ProductDetails;
